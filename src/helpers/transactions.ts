
import AppDataSource from '../config/dataSource';
import TxnInput from '../entities/TxnInput';
import { TxnOutput, TxnParams } from './../dataTypes/Transaction';
import { sumItemValues } from './array_helpers';
import InsufficientInputs from './../exceptions/InsufficientInputs';
import TransactionService from '../services/TransactionService';
import { btcToSatoshi, convertItemsToSatoshi } from './conversions';
import { config } from 'dotenv';


export async function prepareTxnParams(initialOutputs: TxnOutput[]){
    config();
    const amountToSend = sumItemValues<TxnOutput>(initialOutputs,"value");
    console.log("amount to send.........",amountToSend)
    const txnParams: TxnParams = {inputs: [],outputs:[]}
    const {inputsToUse, totalAmount} = await getInputsForAmount(amountToSend);
    console.log("Number of inputs to use....",inputsToUse.length);
    console.log("Amount available....",totalAmount);
    if((inputsToUse.length <= 0) || (totalAmount < amountToSend)){
        throw new InsufficientInputs("Inputs not sufficient to create transaction")
    } else {
        let txnFees = await calculateTransactionFees(inputsToUse.length, initialOutputs.length);
        let amountToSendInSats = btcToSatoshi(amountToSend);
        let totalAmountInSats = btcToSatoshi(totalAmount);
        let finalOutputs = convertItemsToSatoshi(initialOutputs,"value");
        let finalInputs = convertItemsToSatoshi(inputsToUse,"value");
        let remainder = totalAmountInSats - amountToSendInSats;
        if(remainder > 0){
            txnFees = await calculateTransactionFees(inputsToUse.length, finalOutputs.length + 1);
            finalOutputs = deductFeeFromOutputs(finalOutputs,txnFees);
            finalOutputs.push({
                address: process.env.VAULT_ADDRESS,
                value: remainder
            } as TxnOutput)
        } else {
            finalOutputs = deductFeeFromOutputs(finalOutputs,txnFees);
        }
        txnParams.inputs = finalInputs;
        txnParams.outputs = finalOutputs;
        txnParams.transactionFee = txnFees;
    }
    return txnParams;
}

export async function getInputsForAmount(amount: number): Promise<{inputsToUse: TxnInput[], totalAmount: number}>{
    const inputsToUse: TxnInput[] = [];
    let inputAmount: number = 0;
    const txnRepo = AppDataSource.getRepository(TxnInput);
    const txnInputs = await txnRepo.find({where:{spent: false},order:{id:"ASC"}});
    if(txnInputs.length > 0){
        const inputsLen = txnInputs.length;
        for(let i:number = 0; i < inputsLen; i++){
            if(inputAmount < amount){
                let currentInput: TxnInput = txnInputs[i];
                inputsToUse.push(currentInput);
                inputAmount += currentInput.value;
            } else {
                break;
            }
        }
    }
    return {
        inputsToUse,
        totalAmount: inputAmount
    }
}

 
export async function calculateTransactionFees(inputCount: number, outputCount: number){
    const vBytes = Math.ceil((42 + (272 * inputCount) + (128 * outputCount)) / 4);
    const txnService = new TransactionService();
    const densityObject = await txnService.getFeeDensity();
    const feerate = densityObject?.medium_fee_per_kb ?? 6000;
    const satsPerByte = feerate / 1000;
    return satsPerByte * vBytes;
}


export function deductFeeFromOutputs(outputs: TxnOutput[], fee: number){
    const outputLen = outputs.length;
    const divPercentage = 100 / outputLen;
    const amountToDeduct = (divPercentage / 100) * fee;
    const newOutputs = outputs.map((output) => {
        return { ...output,value: output.value - amountToDeduct }
    })
    return newOutputs;
}






