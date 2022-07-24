import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export default class TxnInputs {
   
    @PrimaryGeneratedColumn()
    id: number;

    @Column({length: 1000,type:"varchar"})
    vout: string;

    @Column({length: 2000,type:"varchar"})
    tx_id: string;

    @Column({length: 1000})
    address: string;

    @Column({length: 8000, type:"varchar"})
    txn_hash: string;

    @Column({type:"bool", default: false})
    spent: boolean;

    @Column({nullable: true , type: "varchar", length: 2000})
    redeemScript: string

    @Column({nullable: true, type:"varchar", length: 2000})
    witnessScript: string

}
