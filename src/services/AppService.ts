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
                    this.timer = 1000 * 5;
                    // this.syncBlockchainData();
                }
            }, this.timer);
        } catch (e) {
            if (e instanceof Error) {
                console.log(e.name, e.message, e.stack);
            }
        }
    }

    async indexBlockByNumber(blockNum: number){
        const blockhash = await this.blockService.getBlockhashByNumber(blockNum);
        if(blockhash !== null &&  blockhash !== undefined){
            const block: Block = await this.blockService.getBlock(blockhash);
            if(block !== undefined){
                for await (let txn of block.tx){
                    
                }
            }
        }
        console.log('failed to index block with number ',blockNum);
        return false;
    }

    async processTransaction(txnHash: string){
        const txn: Transaction = await this.txnService.getRawTransaction(txnHash, true);
        if(txn !== undefined){
            for await (let voutItem of txn.vout){
                if(voutItem.scriptPubKey.address !== undefined){
                    const addrRecord = await this.addressRepo.findOneBy({address: voutItem.scriptPubKey.address});

                    if(addrRecord !== null && (await this.txnInputRepo.findOneBy({txId: txn.txid}) === null)){
                        const newInput = new TxnInput();

                    }
                }
            }
        }
        console.log('failed to process transaction with hash',txnHash);
        return false;
    }

    async indexLatestBlock(){
        const latestBlock = await this.blockService.getLatestBlockNumber();
        if(latestBlock !== null && latestBlock !== undefined){
            const indexBlock = new IndexedBlock();
            indexBlock.blockNumber = latestBlock;
            await this.indexedBlockRepo.save(indexBlock);
        }
    }
}
