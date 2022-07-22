import ECPairFactory from "ecpair";
import Service from "./Service";
import * as ecc from "tiny-secp256k1";
import bitcoin from "bitcoinjs-lib";

class AddressServices extends Service {
    generateSegwitAddress(){
        const ecpair = ECPairFactory(ecc);
        const keypair = ecpair.makeRandom();
        const {address} = bitcoin.payments.p2pkh({pubkey:keypair.publicKey, network: this.network});
        

    }
}

export default AddressServices