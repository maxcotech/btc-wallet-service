
import Service from './Service';

export default class TransactionService extends Service{
    async getRawTransaction(txHash: string, isJson = true){
        const result = await this.getRequest("getrawtransaction",[txHash,isJson])
        return result.data?.result;
    }
}
