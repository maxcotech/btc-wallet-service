
import Controller from './Controller';
import { Request } from 'express';
import { Response } from 'express';
import TransactionService from '../services/TransactionService';
import { prepareTxnParams, recordSentTransaction, validateInputSignatures } from '../helpers/transactions';
import { TxnOutput } from './../dataTypes/Transaction';
import { Psbt } from 'bitcoinjs-lib';
import AppDataSource from '../config/dataSource';
import Address from '../entities/Address';
import { config } from 'dotenv';
import AddressServices from '../services/AddressServices';
import CryptoJS from 'crypto-js';
import TxnInput from './../entities/TxnInput';


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

    public static async verifyTransaction(req: Request, res: Response){
        try{
            const {id,value,address} = req.body as Partial<TxnInput>;
            const txnInputRepo = AppDataSource.getRepository(TxnInput);
            const matched = await txnInputRepo.findOneBy({id});
            let reason = "";
            if(matched !== null){
                if(matched.address === address && matched.value == value && matched.received === false){
                    matched.received = true;
                    await txnInputRepo.save(matched);
                    res.json({
                        message: "Transaction successfully verified",
                        code: 200,
                        status: true
                    })
                    return true;
                }
            }
            res.status(422).json({
                message:"Could not verify this transaction: "+reason,
                code: 422, status: false
            })
        }
        catch(e){
            let message = "An Error Occurred";
            if(e instanceof Error){
                message = e.message;
            }
            res.status(500).json({
                message,code: 500, status: false
            })
        }
    }

    public static async createTransaction(req: Request, res: Response){
        try{
            config();
            const {address,amount} = req.body;
            console.log("submitted data...", req.body.address, req.body.amount)
            const txnParams = await prepareTxnParams([{address,value: amount} as TxnOutput]);
            const psbt = new Psbt({network: (new TransactionService()).network});
            const addressRepo = AppDataSource.getRepository(Address);
            txnParams.inputs.forEach((input) => {
                psbt.addInput({
                    hash: input.txId,
                    index: input.vout,
                    witnessUtxo: {
                        script: Buffer.from(input.scriptPubKey,"hex"),
                        value: input.value
                    }
                })
            })
            txnParams.outputs.forEach((output) => {
                psbt.addOutput({
                    address: output.address,
                    value: output.value
                })
            })
            let index = 0;
            for await (const input of txnParams.inputs){
                const addressData = await addressRepo.findOne({where:{address:input.address}});
                if(addressData !== null){
                    const wif = CryptoJS.AES.decrypt(addressData.wifCrypt,process.env.ENCRYPTION_SALT ?? "").toString(CryptoJS.enc.Utf8);
                    const ecpair = (new AddressServices()).getEcpair();
                    const wallet = ecpair.fromWIF(wif);
                    psbt.signInput(index,wallet);
                    psbt.validateSignaturesOfInput(index,validateInputSignatures);
                }
                index++;
            }
            psbt.finalizeAllInputs();
            const txn = psbt.extractTransaction()
            const txnHex = txn.toHex();
            const txnId = txn.getId();
            const txnService = new TransactionService();
            //Test Acceptance 
            const acceptanceResult = await txnService.testMempoolAcceptance([txnHex]);
            let acceptable = false;
            if(acceptanceResult !== undefined && acceptanceResult !== null && acceptanceResult[0]?.allowed === true){
                acceptable = true;
                await txnService.publishTransaction(txnHex);
                console.log("transaction sent ",txnHex);
                await recordSentTransaction(txnId,txnParams.inputs)
            }
            res.json({data: {txnId,txnHex,address,amount, txnFee: txnParams.transactionFee, acceptable}, status: "success", message:"Transaction sent"});
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