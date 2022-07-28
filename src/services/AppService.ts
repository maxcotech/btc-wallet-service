import Service from "./Service";
import AppDataSource from "./../config/dataSource";
import IndexedBlock from "../entities/IndexedBlock";
import { Repository } from "typeorm";
import BlockService from './BlockService';
import { Block } from './../dataTypes/Block';
import TransactionService from './TransactionService';
import { Transaction } from './../dataTypes/Transaction';
import Address from "../entities/Address";
import TxnInput from "../entities/TxnInput";

export default class AppService extends Service {
    indexedBlockRepo: Repository<IndexedBlock>;
    blockService: BlockService;
    txnService: TransactionService;
    addressRepo: Repository<Address>;
    txnInputRepo: Repository<TxnInput>;
    timer: number = 1000 * 10 ; // Default 10 secs Interval

    constructor(){
        super();
        this.indexedBlockRepo = AppDataSource.getRepository(IndexedBlock);
        this.addressRepo = AppDataSource.getRepository(Address);
        this.txnInputRepo = AppDataSource.getRepository(TxnInput);
        this.blockService = new BlockService();
        this.txnService = new TransactionService();
        console.log("Blockchain Synchronizing Service Initialized.");
    }
    public async syncBlockchainData() {
        try {
            setTimeout(async () => {
                let indexed = await this.indexedBlockRepo.count();
                if (indexed === 0) {
                    console.log('No Indexed Block',this.timer);
                    await this.indexLatestBlock();
                    this.timer = 1000 * 60 * 10; // 10 minutes interval;
                } else {
                    const latestNum: number = await this.blockService.getLatestBlockNumber();
                    if(latestNum !== undefined && latestNum !== null){
                        if(await this.isNewBlock(latestNum)){
                            if(await this.blocksAreMissing(latestNum)){
                                this.timer = 1000; // to quickly process missing blocks, 1 secs interval
                                const nextIndex = await this.getNextToIndexNumber(latestNum);
                                await this.indexBlockByNumber(nextIndex);
                            } else {
                                await this.indexBlockByNumber(latestNum);
                                this.timer = 1000 * 60 * 10; //10 minuites interval;
                            }
                        } else {
                            this.timer = 1000 * 60 * 10; //increase timer to check again in 10 mins 
                        }
                    }
                }
                this.syncBlockchainData();
            }, this.timer);
        } catch (e) {
            if (e instanceof Error) {
                console.log(e.name, e.message, e.stack);
            }
        }
    }

    async isNewBlock(latestNum: number){
        const highestIndex = await this.getHighestIndexInDb();
        if(highestIndex !== null){
            if(latestNum > highestIndex.blockNumber){
                return true;
            }
        }
        return false;
    }

    async blocksAreMissing(latestNum: number){
        const highestIndex = await this.getHighestIndexInDb();
        if(highestIndex !== null && highestIndex !== undefined){
            if((latestNum - highestIndex.blockNumber) > 1){
                console.log('Blocks were missed between ', latestNum, "and", highestIndex.blockNumber);
                return true;
            }
        }
        return false;
    }

    async indexBlockByNumber(blockNum: number){
        const blockhash = await this.blockService.getBlockhashByNumber(blockNum);
        if(blockhash !== null &&  blockhash !== undefined){
            const block: Block = await this.blockService.getBlock(blockhash);
            if(block !== undefined){
                for await (let txn of block.tx){
                    await this.processTransaction(txn);
                }
                const newIndex = new IndexedBlock();
                newIndex.blockNumber = blockNum;
                this.indexedBlockRepo.save(newIndex);
                console.log("Block Processed", blockNum);
                return true;
            }
        }
        console.log('failed to index block with number ',blockNum);
        return false;
    }

    async getNextToIndexNumber(latestNum: number = 0){
        const highestIndex = await this.getHighestIndexInDb();
        if(highestIndex !== null && highestIndex !== undefined){
            const nextIndex = highestIndex?.blockNumber + 1;
            if(nextIndex < latestNum){
                return nextIndex;
            }
        }
        return latestNum;
    }

    async getHighestIndexInDb(){
        const highestIndex = await this.indexedBlockRepo.find({order:{blockNumber:"DESC"},skip:0,take:1});
        if(highestIndex !== null && highestIndex !== undefined && highestIndex.length > 0){
            return highestIndex[0]
        }
        return null;
    }

    async processTransaction(txnHash: string){
        const txn: Transaction = await this.txnService.getRawTransaction(txnHash, true);
        if(txn !== undefined){
            for await (let voutItem of txn.vout){
                const scriptPubKey = voutItem.scriptPubKey; 
                if(scriptPubKey.address !== undefined){
                    const addrRecord = await this.addressRepo.findOneBy({address: voutItem.scriptPubKey.address});

                    if(addrRecord !== null && (await this.txnInputRepo.findOneBy({txId: txn.txid}) === null)){
                        const newInput = new TxnInput();
                        newInput.address = scriptPubKey.address;
                        newInput.scriptPubKey = scriptPubKey.hex;
                        newInput.txId = txn.txid;
                        newInput.txnHash = txn.hash;
                        newInput.vout = voutItem.n;
                        newInput.value = voutItem.value;
                        newInput.spent = false;
                        await this.txnInputRepo.save(newInput)
                    }
                }
            }
            console.log("processed transaction",txnHash);
            return true;
        }
        console.log('failed to process transaction with hash',txnHash);
        return false;
    }

    async indexLatestBlock(){
        const latestBlock = await this.blockService.getLatestBlockNumber();
        if(latestBlock !== null && latestBlock !== undefined){
            if(await this.indexedBlockRepo.findOneBy({blockNumber:latestBlock}) === null){
                if(await this.indexBlockByNumber(latestBlock)){
                    return true;
                }
            }
        }
        return false;
    }
}
