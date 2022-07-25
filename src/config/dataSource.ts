import "reflect-metadata"
import { DataSource } from "typeorm"
import TxnInput from '../entities/TxnInput';
import Address from '../entities/Address';
import IndexedBlock from '../entities/IndexedBlock';

const AppDataSource = new DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "",
    database: "btc_wallet_service",
    entities: [TxnInput,Address,IndexedBlock],
    synchronize: true,
    logging: false,
})

// to initialize initial connection with the database, register all entities
// and "synchronize" database schema, call "initialize()" method of a newly created database
// once in your application bootstrap
export default AppDataSource;