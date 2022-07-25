import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity({name:"addresses"})
export default class Address {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({unique:true,length:1000, type: "varchar"})
    address: string;

    @Column({length:1000, type:"varchar"})
    hash: string;

    @Column({type:"varchar", length: 1000})
    pubKey: string;  //hex form

    @Column({type:"varchar", length: 2000})
    wifCrypt: string;

    @Column({type:"varchar",length: 1000})
    witness: string; // payment output

    @Column({type:"varchar",length:1000, nullable: true})
    userId: string;

    @Column({type:"timestamp",nullable: true, default: () => "CURRENT_TIMESTAMP"})
    createdAt: string;
}