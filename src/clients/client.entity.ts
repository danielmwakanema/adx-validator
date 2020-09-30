import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Client {
    @PrimaryGeneratedColumn()
    id: string;

    @Column({ length: 255 })
    name: string;
}