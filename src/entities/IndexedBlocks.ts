import { Column, Entity, PrimaryGeneratedColumn } from "typeorm"

@Entity()
export default class IndexedBlocks {
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column({unique:true})
    blockNumber: number;

    @Column({type:"timestamp", nullable: true, default: Date.now()})
    createdAt: string;

}