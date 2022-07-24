import Controller from './Controller';
import { Request } from 'express';
import { Response } from 'express';
import AddressServices from './../services/AddressServices';

export default class AddressController extends Controller {
    public static createAddress(req: Request, res: Response){
        try{
            const service = new AddressServices();
            const addressPayload = service.generateSegwitAddress();
            res.json({
                data: addressPayload,
                message: "Successful"
            })
        }
        catch(e){
            let message = "Unknown error occurred";
            if(e instanceof Error){
                message = e.message;
            }
            res.status(500).json({
                message
            })
        }
       
    }
}
