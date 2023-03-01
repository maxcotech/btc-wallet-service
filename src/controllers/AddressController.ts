import Controller from './Controller';
import AddressServices from './../services/AddressServices';
import Address from '../entities/Address';
import AppDataSource from './../config/dataSource';
import { HttpRequestParams } from './../dataTypes/Http';
import AppException from '../exceptions/AppException';
import { walletErrors } from '../config/errors/wallet.errors';

export default class AddressController extends Controller {
    public static async createAddress({req, res }: HttpRequestParams){
        const service = new AddressServices();
        const addressPayload = service.generateSegwitAddress();
        return await this.saveAddress(addressPayload, req.body.userId);
    }

    public static async saveAddress(addressPayload: any, userId = "0"){
        if(addressPayload.address !== undefined){
            const addressModel = new Address();
            addressModel.address = addressPayload.address;
            addressModel.hash = addressPayload.hash ?? "";
            addressModel.pubKey = addressPayload.pubKey ?? "";
            addressModel.userId = userId;
            addressModel.witness = addressPayload.output ?? "";
            addressModel.wifCrypt = addressPayload.wifCrypt;
            const addressRepo = AppDataSource.getRepository(Address);
            const saved = await addressRepo.save(addressModel);
            return saved;
        } else {
            throw new AppException(walletErrors.failedToCreateAddress);
        }
    }
}
