import bitcoin  from "bitcoinjs-lib";
import {config} from "dotenv";

class Service {
    network: bitcoin.networks.Network;
    baseUrl: string;
    apiKey: string | undefined;

    constructor(){
        this.network = bitcoin.networks.testnet;
        this.baseUrl = "https://btc.getblock.io/testnet/";
        this.apiKey = process.env.SERVICE_API_KEY;
    }

    getConnection(){
        return this;
    }

}

export default Service;