import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({name:"TxnInputs"})
export default class TxnInput {
   
    @PrimaryGeneratedColumn()
    id: number;

    @Column({length: 2000,type:"varchar"})
    txId: string;

    @Column({length: 1000})
    address: string;

    @Column({length: 8000, type:"varchar"})
    txnHash: string;

    @Column({default: 0})
    vout: number;

    @Column({type:"double"})
    value: number; 

    @Column({type:"bool", default: false})
    spent: boolean;

    @Column({nullable: true, type:"varchar", length: 2000})
    scriptPubKey: string

    @Column({nullable: true , type: "varchar", length: 2000})
    redeemScript: string

    @Column({nullable: true, type:"timestamp", default: () => "CURRENT_TIMESTAMP"})
    createdAt: string;
    

}
