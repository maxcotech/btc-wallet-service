import ECPairFactory from "ecpair";
import Service from "./Service";
import * as ecc from "tiny-secp256k1";
import * as bitcoin from "bitcoinjs-lib";
import CryptoJs from "crypto-js";
import { config } from 'dotenv';

class AddressServices extends Service {

    getEcpair(){
        const ecpair = ECPairFactory(ecc);
        return ecpair;
    }
    generateSegwitAddress(){
        config();
        const ecpair = this.getEcpair();
        const keypair = ecpair.makeRandom();
        const payment = bitcoin.payments.p2wpkh({pubkey:keypair.publicKey, network: this.network});
        const pubKey = payment.pubkey?.toString("hex");
        const address = payment.address;
        const signature = payment.signature?.toString("hex")
        const hash = payment.hash?.toString("hex");
        const output = payment.output?.toString("hex");
        const wifCrypt = CryptoJs.AES.encrypt(keypair.toWIF(),process.env.ENCRYPTION_SALT ?? "").toString();
        return { pubKey, address, signature, hash, output, wifCrypt}
    }
}

export default AddressServices