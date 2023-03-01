import MessageService from '../services/MessageService';
import { HttpRequestParams } from './../dataTypes/Http';
import TxnInput from './../entities/TxnInput';

class Controller {
    public static async ping({req,res}: HttpRequestParams){
        const messageService = new MessageService();
        const txnInput = new TxnInput();
        txnInput.address = "tb1q7wfy3ncf6jgstk735kexnurt0zpr5ya8tcttk5";
        txnInput.txId = "63aa087c7a0e703e11ef198b6e9d4c404bbdc3ec0ccdcfca9b84f5e7461d7dfb";
        txnInput.txnHash = "68c3be2ccebd906912ec65229588fecac3ff1bd7341660463dea8b241e2b22d4";
        txnInput.value = 0.00066193;
        txnInput.id = 7;
        await messageService.queueCreditTransaction(txnInput);
        return {
            message: "queued successfully"
        }
    }
}

export default Controller;