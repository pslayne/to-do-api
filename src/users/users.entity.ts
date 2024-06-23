import { PrimaryGeneratedColumn, Column, OneToMany, Entity } from 'typeorm';
import { Task } from "./../tasks/tasks.entity";

@Entity('user')
export abstract class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 100 })
    name: string;
    
    @Column({ type: 'varchar', length: 30 })
    login: string;
    
    @Column({ type: 'varchar', length: 300 })
    password: string;

    @OneToMany(() => Task, (task) => task.owner, { cascade: true })
    tasks: Task[]
}