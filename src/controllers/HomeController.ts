import { Request, Response } from "express";
import Controller from "./Controller";
import AppService from './../services/AppService';
import { HttpRequestParams } from "../dataTypes/Http";
import AppDataSource from "../config/dataSource";
import TxnInput from "../entities/TxnInput";
import { VAULT_ADDRESS } from "../config/settings";
import { FindOptionsWhere } from "typeorm";

class HomeController extends Controller {
    public static async index(req: Request, res: Response) {
        const appService = new AppService();
        res.send({
            hello: "Welcome to Btc Wallet",
            info: { latestBlock: await appService.getLatestBlock(), consolidatedBlock: (await appService.getHighestIndexInDb())?.blockNumber ?? 0 },
            baseUrl: req.baseUrl,
        })
    }

    public static async walletBalance({ req, res }: HttpRequestParams) {
        const txnInputRepo = AppDataSource.getRepository(TxnInput);
        const findOptions: FindOptionsWhere<TxnInput> = { spent: false }
        if (req.query?.address) {
            findOptions.address = req.query.address as string;
        }
        const unspentTxn = await txnInputRepo.find({ where: findOptions });
        let balance = unspentTxn.reduce((accumulator, currentTxn) => {
            return accumulator + currentTxn.value;
        }, 0)
        return {
            balance,
            vault_address: VAULT_ADDRESS
        }
    }


}

export default HomeController;