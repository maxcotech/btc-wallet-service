import axios, { AxiosInstance } from "axios";
import * as bitcoin from "bitcoinjs-lib";
import { config } from "dotenv";

class Service {
    
    network: bitcoin.networks.Network;
    baseUrl: string;
    apiKey: string | undefined;
    client: AxiosInstance;
    jsonrpcVersion: 1.0


    constructor(){
        this.network = bitcoin.networks.testnet;
        this.baseUrl = "https://btc.getblock.io/testnet/";
        this.apiKey = process.env.SERVICE_API_KEY;
        this.client = this.getClient();
    }

    getClient(){
        config();
        const client = axios.create({baseURL:this.baseUrl});
        client.interceptors.request.use((configs) => {
            if(configs !== undefined && configs.headers !== undefined){
                configs.headers.accept = "application/json";
                configs.headers['x-api-key'] = process.env.GB_API_KEY ?? "";
                configs.headers['Content-Type'] = "text/plain";
            }
            return configs;
        })

        client.interceptors.response.use(
            function (response){
                return response;
            },
            function (error){
                console.log(error);
                return Promise.reject(error);
            }
        )
        return client;
    }

    getConnection(){
        return this;
    }

    getSingleParamReqBody(param: string ,method: string, id: string = "servicecall"){
        return {
            id,
            jsonrpc: this.jsonrpcVersion,
            method,
            params: [param]
        }
    }

    getRequest(method: string, params: Array<any> = [], id: string = "servicecall"){
        return this.client.post("",JSON.stringify({
            id,
            jsonrpc: this.jsonrpcVersion,
            method,
            params
        }))
       
    }

}

export default Service;