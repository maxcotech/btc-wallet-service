
import Service from './Service';


export default class BlockService extends Service {
    async getLatestBlockNumber(){
        const result = await this.getRequest("getblockcount");
        console.log("Latest block.....",result.data?.result)
        return result.data?.result;
    }

    async getBlockhashByNumber(blockNum: any){
        const result = await this.getRequest("getblockhash",[blockNum]);
        console.log("Blockhash of block",blockNum,result.data?.result);
        return result.data?.result;
    }

    async getBlock(blockhash: any){
        const result = await this.getRequest("getblock",[blockhash])
        return result.data?.result;
    }
}

