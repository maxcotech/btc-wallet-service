import TxnInput from './../entities/TxnInput';
import { AxiosError, AxiosInstance } from 'axios';
import Service from './Service';
import { MESSAGE_RETRY_LIMIT, WALLET_DEFAULT_SYMBOL } from '../config/settings';
import MessageQueue from '../entities/MessageQueue';
import { MessageTypes } from '../config/enum';
import { In, Not, Repository } from 'typeorm';
import AppDataSource from '../config/dataSource';
import FailedQueueMessage from '../entities/FailedQueueMessage';

export default class MessageService extends Service{
    client: AxiosInstance;
    failedMessageRepo: Repository<FailedQueueMessage>;
    messageRepo: Repository<MessageQueue>;
    constructor(){
        super();
        this.client = this.getAppClient();
        this.messageRepo = AppDataSource.getRepository(MessageQueue);
        this.failedMessageRepo = AppDataSource.getRepository(FailedQueueMessage);
    }

    async sendIncomingTransaction(payload: TxnInput, retrial = 10, trialIntervalMins = 5){
        try{
            await this.client.post(`transactions/chain/incoming/BTC`,payload);
            console.log(`Successfully Notified app of transaction with system id ${payload.id} and Address ${payload.address}`)
        } catch (e){
            if(e instanceof Error){
                console.log(`Failed to send transaction message with address ${payload.address} and system id ${payload.id} retrying in ${trialIntervalMins} mins: remaining trial count is ${retrial}`,e.message,e.stack);
                if(retrial > 0){
                    const newRetrial = retrial - 1;
                    const newInterval = trialIntervalMins * 2
                    setTimeout(async () => {
                        await this.sendIncomingTransaction(payload, newRetrial, newInterval );
                    },1000 * 60 * trialIntervalMins);
                }
                
            }
        }
    }

    async fetchQueue(){
        const messages = await this.messageRepo.find({
            order: { retries: 'ASC'},
            take: 100,
            skip: 0,
            where: { message: Not("")}})
        messages;
        return messages;
    }

    async processMessageQueue(timeout = 5000){
        setTimeout(async () => {
            let currentItem: MessageQueue | null  = null;
            try{
                const queue = await this.fetchQueue();
                const queueLength = queue.length;
                if(queueLength > 0){
                    for(let i = 0; i < queueLength; i++){
                        currentItem = queue[i];
                        const messagePayload = JSON.parse(currentItem.message);
                        const response = await this.client.post(`transactions/chain/incoming/${WALLET_DEFAULT_SYMBOL}`,messagePayload);
                        if(response.status === 200){
                            console.log(`message sent successfully`,currentItem.message)
                            await this.messageRepo.delete({id: currentItem.id})
                        }
                    }
                }
                this.processMessageQueue();
            }
            catch(e){
                console.log('Failed to Send Pending Messages ',(e instanceof AxiosError )? e.response?.data : ((e instanceof Error)? e.message:""))
                if(currentItem){
                    if(currentItem.retries >= MESSAGE_RETRY_LIMIT){
                        await this.moveToFailedMessageRecord(currentItem)
                    } else {
                        await this.messageRepo.update({id: currentItem.id},{retries: currentItem.retries + 1})
                    }
                }
                this.processMessageQueue()
            }
        }, timeout)
    }

    async reQueueFailedMessages(){
        try{
            const items = await this.failedMessageRepo.find();
            if(items.length > 0){
                const messages: MessageQueue[] = [];
                const failedIdsToDelete: number[] = [];
                items.forEach((item) => {
                    const newMessage = new MessageQueue();
                    newMessage.message = item.message;
                    newMessage.type = item.type;                                                                                                                                                                   
                    newMessage.retries = 0;
                    messages.push(newMessage);
                    failedIdsToDelete.push(item.id);
                })
                await AppDataSource.transaction(async () => {
                    await this.messageRepo.insert(messages);
                    await this.failedMessageRepo.delete({id: In(failedIdsToDelete)})
                })
                return 'Successfully requeued all failed messages';
            }
            return "No failed messages to requeue";
        }
        catch(e){
            return 'Failed to restore failed messages '+((e instanceof Error)? e.message: "");
        }
    }

    async moveToFailedMessageRecord(message: MessageQueue){
        const newFailedMsg = new FailedQueueMessage();
        newFailedMsg.message = message.message;
        newFailedMsg.retried = message.retries;
        newFailedMsg.messageId = message.id;
        newFailedMsg.type = message.type;
        let savedFailedMsg = null;
        await AppDataSource.transaction(async () => {
            savedFailedMsg = await this.failedMessageRepo.save(newFailedMsg);
            await this.messageRepo.delete({id: message.id});
        })
        return savedFailedMsg;
    }


    async queueCreditTransaction(txnData: TxnInput){
        try{
            console.log('queueing for messaging',txnData);
            const messagePayload = {
                address: txnData.address,
                value: txnData.value,
                tx_id: txnData.txId,
                currency_code:  WALLET_DEFAULT_SYMBOL,
                address_memo: null
            }
            const messageString = JSON.stringify(messagePayload);
            const messageQueue = new MessageQueue();
            messageQueue.message = messageString;
            console.log('message string',messageQueue.message ?? "none", messageString);
            messageQueue.type = MessageTypes.creditTransaction;
            await this.messageRepo.save(messageQueue);
            return true;
        }
        catch(e){
            if(e instanceof Error){
                console.log(e.message,e.stack)
            }
            return false;
        }
    }

}