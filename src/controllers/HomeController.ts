import { Request, Response } from "express";
import Controller from "./Controller";

class HomeController extends Controller {
    public static index(req: Request, res: Response){
        res.send({
            hello: "Welcome to Btc Wallet",
            baseUrl: req.baseUrl,
        })
    }

    
}

export default HomeController;