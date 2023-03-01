"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const TxnInput_1 = __importDefault(require("../entities/TxnInput"));
const Address_1 = __importDefault(require("../entities/Address"));
const IndexedBlock_1 = __importDefault(require("../entities/IndexedBlock"));
const AccountRecord_1 = __importDefault(require("../entities/AccountRecord"));
const MessageQueue_1 = __importDefault(require("../entities/MessageQueue"));
const FailedQueueMessage_1 = __importDefault(require("../entities/FailedQueueMessage"));
const settings_1 = require("./settings");
const AppDataSource = new typeorm_1.DataSource({
    type: "mysql",
    host: settings_1.DB_HOST,
    port: settings_1.DB_PORT,
    username: settings_1.DB_USER,
    password: settings_1.DB_PASSWORD,
    database: settings_1.DB_NAME,
    entities: [TxnInput_1.default, Address_1.default, IndexedBlock_1.default, AccountRecord_1.default, MessageQueue_1.default, FailedQueueMessage_1.default],
    synchronize: true,
    logging: false,
});
// to initialize initial connection with the database, register all entities
// and "synchronize" database schema, call "initialize()" method of a newly created database
// once in your application bootstrap
exports.default = AppDataSource;
