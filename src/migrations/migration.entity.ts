import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Migration {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    clientId: string;

    @Column()
    channelId: string;

    @Column({ nullable: true })
    totalMigratedElements: number;

    @Column({ nullable: true })
    totalDataElements: number;

    @Column({ nullable: true })
    totalFailedElements: number;

    @Column({ nullable: true })
    uploadedAt: string;

    @Column({ nullable: true })
    structureValidatedAt: string;

    @Column({ nullable: true })
    structureFailedValidationAt: string;

    @Column({ nullable: true })
    elementsAuthorizationAt: string;

    @Column({ nullable: true })
    elementsFailedAuthorizationAt: string;

    @Column({ nullable: true })
    valuesValidatedAt: string;
    
    @Column({ nullable: true })
    valuesFailedValidationAt: string;

    @Column({ nullable: true })
    migrationCompletedAt: string;

    @CreateDateColumn()
    createdAt: string;

    @UpdateDateColumn()
    updatedAt: string;
}