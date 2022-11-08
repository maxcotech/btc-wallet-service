import TxnInput from './../entities/TxnInput';
import axios from 'axios';
import { config } from 'dotenv';
import { AxiosInstance } from 'axios';
import Service from './Service';
config();

export default class MessageService extends Service{
    client: AxiosInstance;
    constructor(){
        super();
        this.client = this.getAppClient();
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
}