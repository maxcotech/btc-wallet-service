import axios, { AxiosInstance } from "axios";
import * as bitcoin from "bitcoinjs-lib";
import { AUTH_HEADER_KEY } from "../config/appConstants";
import { APP_API_KEY, APP_API_URL, GB_API_KEY, NODE_BASE_URL } from "../config/settings";
import { getClientSecret } from "../helpers/auth_helpers";

class Service {

    network: bitcoin.networks.Network;
    baseUrl: string;
    client: AxiosInstance;
    feeDensityUrl: string;
    jsonrpcVersion: 1.0


    constructor() {
        this.network = bitcoin.networks.bitcoin;
        this.baseUrl = NODE_BASE_URL;
        this.feeDensityUrl = "https://api.blockcypher.com/v1/btc/main";
        this.client = this.getClient();
    }

    getAppClient() {
        const client = axios.create({ baseURL: APP_API_URL });
        client.interceptors.request.use(async (configs) => {
            if (configs !== undefined && configs.headers !== undefined) {
                configs.headers.accept = "application/json";
                configs.headers[AUTH_HEADER_KEY] = await getClientSecret() ?? "";
            }
            return configs;
        })
        client.interceptors.response.use(
            function (response) {
                return response;
            },
            function (error) {
                console.log(error);
                return Promise.reject(error);
            }
        )
        return client;
    }

    getClient() {
        const client = axios.create({ baseURL: this.baseUrl });
        client.interceptors.request.use((configs) => {
            if (configs !== undefined && configs.headers !== undefined) {
                configs.timeout = 25000
                configs.headers.accept = "application/json";
                configs.headers['x-api-key'] = GB_API_KEY ?? "";
                configs.headers['Content-Type'] = "text/plain";
            }
            return configs;
        })

        client.interceptors.response.use(
            function (response) {
                return response;
            },
            function (error) {
                console.log(error);
                return Promise.reject(error);
            }
        )
        return client;
    }

    getConnection() {
        return this;
    }

    getSingleParamReqBody(param: string, method: string, id: string = "servicecall") {
        return {
            id,
            jsonrpc: this.jsonrpcVersion,
            method,
            params: [param]
        }
    }

    async getRequest(method: string, params: Array<any> = [], id: string = "servicecall") {
        return await this.client.post("", JSON.stringify({
            id,
            jsonrpc: this.jsonrpcVersion,
            method,
            params
        }), {
            maxContentLength: Infinity,
            maxBodyLength: Infinity,
            timeoutErrorMessage: "Could not complete this request on time ",
        })
    }

}

export default Service;