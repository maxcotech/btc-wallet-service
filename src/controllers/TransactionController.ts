
import Controller from './Controller';
import { Request } from 'express';
import { Response } from 'express';
import TransactionService from '../services/TransactionService';

export default class TransactionController extends Controller{
    public static async getRawTransaction(req: Request, res: Response){
        try{
            res.json({
                data: await (new TransactionService()).getRawTransaction(req.params.tx_hash)
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