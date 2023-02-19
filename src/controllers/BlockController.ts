
import Controller from './Controller';
import BlockService from '../services/BlockService';
import { HttpRequestParams } from './../dataTypes/Http';

export default class BlockController extends Controller {
    
    public static  async getLatestBlock({req, res }: HttpRequestParams){
        await (new BlockService()).getLatestBlockNumber()
    }

    public static async getBlockHash({req, res }: HttpRequestParams){
        await (new BlockService()).getBlockhashByNumber(parseInt(req.params.blockNumber))
    }

    public static async getBlock({req, res }: HttpRequestParams){
        await (new BlockService()).getBlock(req.params.blockhash)
    }
}
