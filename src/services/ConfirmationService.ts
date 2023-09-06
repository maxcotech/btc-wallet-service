import { AxiosError, AxiosInstance } from "axios";
import AppDataSource from "../config/dataSource";
import { TXN_CONFIRM_MIN, VAULT_ADDRESS } from "../config/settings";
import Service from "./Service";
import { Repository } from 'typeorm';
import TxnInput from "../entities/TxnInput";
import BlockService from "./BlockService";
import TransactionService from "./TransactionService";

export default class ConfirmationService extends Service {
     queueHandler: any = null;
     receivedRepo: Repository<TxnInput>
     blockService: BlockService;
     txnService: TransactionService;
     constructor() {
          super();
          this.receivedRepo = AppDataSource.getRepository(TxnInput);
          this.blockService = new BlockService();
          this.txnService = new TransactionService();

     }

     async confirmTransaction(txn: TxnInput, client: AxiosInstance) {
          try {
               if (txn.address != VAULT_ADDRESS) {
                    const response = await client.post(`transactions/chain/confirm`, {
                         transaction: txn.txId
                    })
                    if (response.status === 200 || response.status === 204) {
                         console.log('Message sent successfully......', txn.txId);
                         this.receivedRepo.update({ id: txn.id }, { confirmed: true });
                    }
               } else {
                    this.receivedRepo.update({ id: txn.id }, { confirmed: true });
               }
          }
          catch (e) {
               if (e instanceof AxiosError) {
                    console.log(e.response?.data ?? "Unknown error detected");
               } else {
                    console.log(e);
               }
          }

     }



     async processUnconfirmedTransactions(timeout = 5000): Promise<any> {
          if (this.queueHandler !== null) {
               clearTimeout(this.queueHandler);
               this.queueHandler = null;
          }
          try {
               this.queueHandler = setTimeout(async () => {
                    const txns = await this.receivedRepo.find({
                         where: { confirmed: false },
                         order: { id: "DESC" }
                    })
                    if (txns.length > 0) {
                         const currentBlockNumber = await this.blockService.getLatestBlockNumber();
                         const minRequiredConfirmations = parseInt(TXN_CONFIRM_MIN as string);
                         const client = this.getAppClient();
                         for await (let txn of txns) {
                              const txnDetails = await this.txnService.getTransactionDetails(txn.txId);
                              if (txnDetails.status) {
                                   const confirmations = currentBlockNumber - txnDetails.status.block_height;
                                   if (confirmations >= minRequiredConfirmations) {
                                        await this.confirmTransaction(txn, client);
                                   }
                              }

                         }
                    }
                    return this.processUnconfirmedTransactions();

               }, timeout)
          }
          catch (e) {
               console.log(e);
               return this.processUnconfirmedTransactions(5000)
          }
     }

}