import { PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, Entity } from 'typeorm';
import { User } from "./../users/users.entity";

@Entity('task')
export abstract class Task {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({type: 'varchar', length: 100})
    title: string;

    @Column({type: 'varchar', length: 500, default: ""})
    description: string;

    @Column({ type: 'boolean', default: false })
    isDone: boolean;

    @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    createDateTime: Date;

    @ManyToOne(() => User, (user) => user.tasks, {eager: true, onUpdate: 'CASCADE', nullable: false})
    owner: User
}