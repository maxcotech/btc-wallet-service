export interface Transaction {
    txid: string,
    hash: string,
    version: number,
    size: number,
    vsize: number,
    weight: number,
    locktime: number,
    vin: VinItem[],
    vout: VoutItem[],
    hex: string,
    blockhash: string,
    confirmations: number,
    time: number,
    blocktime: number
}


export interface VinItem {
    coinbase?: string,
    txinwitness: string[],
    sequence: number
}

export interface VoutItem {
    value: number,
    n: number,
    scriptPubKey: ScriptPubKey
}

export interface ScriptPubKey {
    asm: string,
    desc: string,
    hex: string,
    address?: string,
    type: string
}