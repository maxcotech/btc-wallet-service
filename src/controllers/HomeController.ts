import { Request, Response } from "express";
import Controller from "./Controller";
import AppService from './../services/AppService';

class HomeController extends Controller {
    public static async index(req: Request, res: Response){
        const appService = new AppService();
        res.send({
            hello: "Welcome to Btc Wallet",
            info: {latestBlock: await appService.getLatestBlock(), consolidatedBlock: await appService.getHighestIndexInDb() },
            baseUrl: req.baseUrl,
        })
    }

    
}

export default HomeController;