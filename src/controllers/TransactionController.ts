
import Controller from './Controller';
import { Request } from 'express';
import { Response } from 'express';
import TransactionService from '../services/TransactionService';
import { prepareTxnParams } from '../helpers/transactions';
import { TxnOutput } from './../dataTypes/Transaction';

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

    public static async createTransaction(req: Request, res: Response){
        try{
            const {address,amount} = req.body;
            console.log("submitted data...", req.body.address, req.body.amount)
            const txnParams = await prepareTxnParams([
                {address,value: amount} as TxnOutput
            ]);
            res.json({data: txnParams, status: "success"});
        }
        catch(e){
            let message = "An Error Occurred";
            if(e instanceof Error){
                message = e.message;
            }
            res.status(500).send({
                message,
                status: "failed"
            })
        }
    }
}