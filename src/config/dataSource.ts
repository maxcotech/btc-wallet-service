import "reflect-metadata"
import { DataSource } from "typeorm"
import TxnInput from '../entities/TxnInput';
import Address from '../entities/Address';
import IndexedBlock from '../entities/IndexedBlock';
import AccountRecord from "../entities/AccountRecord";
import MessageQueue from "../entities/MessageQueue";
import FailedQueueMessage from "../entities/FailedQueueMessage";
import { DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT, DB_USER } from "./settings";

const AppDataSource = new DataSource({
    type: "mysql",
    host: DB_HOST,
    port: DB_PORT,
    username: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    entities: [TxnInput,Address,IndexedBlock,AccountRecord, MessageQueue, FailedQueueMessage],
    synchronize: true,
    logging: false,
})

// to initialize initial connection with the database, register all entities
// and "synchronize" database schema, call "initialize()" method of a newly created database
// once in your application bootstrap
export default AppDataSource;