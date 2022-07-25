import Controller from './Controller';
import { Request } from 'express';
import { Response } from 'express';
import AddressServices from './../services/AddressServices';
import Address from '../entities/Address';
import AppDataSource from './../config/dataSource';

export default class AddressController extends Controller {
    public static async createAddress(req: Request, res: Response){
        try{
            const service = new AddressServices();
            const addressPayload = service.generateSegwitAddress();
            if(addressPayload.address !== undefined){
                const addressModel = new Address();
                addressModel.address = addressPayload.address;
                addressModel.hash = addressPayload.hash ?? "";
                addressModel.pubKey = addressPayload.pubKey ?? "";
                addressModel.userId = req.body.userId;
                addressModel.witness = addressPayload.output ?? "";
                addressModel.wifCrypt = addressPayload.wifCrypt;
                const addressRepo = AppDataSource.getRepository(Address);
                const saved = await addressRepo.save(addressModel);
                res.json({
                    data: saved,
                    message: "Successful"
                })
            } else {
                res.status(500).json({
                    data: null,
                    message: "Failed to generate address"
                })
            }
            
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
