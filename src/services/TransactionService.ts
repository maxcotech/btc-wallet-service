
import axios from 'axios';
import Service from './Service';
import { FeeRatePayload } from './../dataTypes/Transaction';

export default class TransactionService extends Service{
    async getRawTransaction(txHash: string, isJson = true){
        const result = await this.getRequest("getrawtransaction",[txHash,isJson])
        return result.data?.result;
    }

    async getFeeDensity(): Promise<FeeRatePayload>{
        const result = await axios.get(this.feeDensityUrl);
        return result.data;
    }

    async testMempoolAcceptance(transactions: string[]){
        const result = await this.getRequest("testmempoolaccept",[transactions]);
        return result.data?.result;
    }

    async publishTransaction(txnHex: string){
        const result = await this.getRequest("sendrawtransaction",[txnHex])
        return result.data?.result;
        
    }

    

    
}
