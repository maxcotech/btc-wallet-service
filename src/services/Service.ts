import bitcoin  from "bitcoinjs-lib";
import {config} from "dotenv";

class Service {


    constructor(){
        const network = bitcoin.networks.testnet;
        const baseUrl = "https://btc.getblock.io/testnet/";
        const apiKey = process.env.SERVICE_API_KEY;
    }

    getConnection(){
        
    }

}

export default Service;