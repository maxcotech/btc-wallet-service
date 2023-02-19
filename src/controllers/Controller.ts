import MessageService from '../services/MessageService';
import { HttpRequestParams } from './../dataTypes/Http';
import TxnInput from './../entities/TxnInput';

class Controller {
    public static async ping({req,res}: HttpRequestParams){
        const messageService = new MessageService();
        const txnInput = new TxnInput();
        txnInput.address = "uddjdejedjirjrdj";
        txnInput.received = true;
        txnInput.txId = "iefjlefefvjnrevrjre";
        txnInput.txnHash = "sjjdnddjkdmdkksmsnjdjd";
        txnInput.value = 2.5;
        await messageService.queueCreditTransaction(txnInput);
        return {
            message: "queued successfully"
        }
    }
}

export default Controller;