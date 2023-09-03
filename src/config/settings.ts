import { config } from "dotenv"

config()

export const ENCRYPTION_PASSPHRASE = process.env.ENCRYPTION_PASSPHRASE ?? ""
export const ENCRYPTION_SALT = process.env.ENCRYPTION_SALT ?? ""
export const GB_API_KEY = process.env.GB_API_KEY ?? ""
export const VAULT_ADDRESS = process.env.VAULT_ADDRESS
export const APP_API_URL = process.env.APP_API_URL
export const APP_API_KEY = process.env.APP_API_KEY
export const WALLET_DEFAULT_SYMBOL = process.env.WALLET_DEFAULT_SYMBOL ?? "BTC"
export const CLIENT_AUTH = process.env.CLIENT_AUTH
export const APP_BASE_URL = process.env.APP_BASE_URL ?? process.env.APP_API_KEY
export const NODE_BASE_URL = process.env.NODE_BASE_URL ?? "https://btc.getblock.io/mainnet/"
export const PORT = process.env.PORT;
export const MESSAGE_RETRY_LIMIT = parseInt(process.env.MESSAGE_RETRY_LIMIT ?? "100000")
export const TXN_CONFIRM_MIN = process.env.TXN_CONFIRM_MIN ?? 3;

//Database Specific Configs 
export const DB_TYPE = process.env.DB_TYPE ?? "mysql"
export const DB_HOST = process.env.DB_HOST
export const DB_PASSWORD = process.env.DB_PASSWORD
export const DB_NAME = process.env.DB_NAME
export const DB_USER = process.env.DB_USER
export const DB_PORT = parseInt(process.env.DB_PORT ?? "3306")