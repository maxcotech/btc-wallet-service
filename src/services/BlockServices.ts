
import Service from './Service';


export default class BlockService extends Service {
    async getLatestBlockNumber(){
        const result = await this.getRequest("getblockcount")
        return result.data?.result;
    }
}