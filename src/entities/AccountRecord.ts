import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

export enum AccountRecordTypes {
    CREDIT = "credit",
    DEBIT = "debit"
}

@Entity({name:"account_records"})
export default class AccountRecord {
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column({type:"varchar",length:1000})
    userId: number;

    @Column({type:"double"})
    amount: number;

    @Column({type:"enum",enum: AccountRecordTypes})
    ledgerType: AccountRecordTypes;

    @Column({type:"timestamp",nullable: true, default: () => "CURRENT_TIMESTAMP"})
    createdAt: string;

}