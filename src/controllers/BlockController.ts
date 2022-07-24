
import Controller from './Controller';
import { Request } from 'express';
import { Response } from 'express';
import BlockService from '../services/BlockServices';

export default class BlockController extends Controller {
    public static getLatestBlock(req: Request, res: Response){
        try{
            res.json({
                data: (new BlockService()).getLatestBlockNumber()
            })
        }
        catch(e){
            let message = "An Error Occurred";
            if(e instanceof Error){
                message = e.message;
            }
            res.status(500).send({
                message
            })
        }
    }
}