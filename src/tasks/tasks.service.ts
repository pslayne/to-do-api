import {
    HttpStatus,
    Injectable,
    InternalServerErrorException,
    Logger,
} from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Task } from './tasks.entity';
import { UserDTO, UsersService } from './../users/users.service';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTask {
    ownerId: string;
    @ApiProperty({example: "task title"})
    title: string;
    @ApiProperty({example: "task description (optional)"})
    description?: string;
}

export class UpdateTask extends CreateTask {
    @ApiProperty({example: "caec9e6d-2598-4b69-abf6-d34f81852a24"})
    id: string;
    @ApiProperty({example: true})
    isDone?: boolean;
}

export class TaskDTO {
    @ApiProperty({example: "caec9e6d-2598-4b69-abf6-d34f81852a24"})
    id?: string;
    @ApiProperty({example: "task title"})
    title: string;
    @ApiProperty({example: "task description"})
    description: string;
    @ApiProperty({example: false})
    isDone?: boolean;
    @ApiProperty({example: "2024-06-22T23:45:11.941Z"})
    createDateTime?: Date;
    @ApiProperty({
        example: {
            "id": "c9b99c0d-d74b-40dd-861d-23f9c96e2722",
            "name": "maria"
        }
    })
    owner: UserDTO;
}

@Injectable()
export class TasksService {
    private tasksRepository;
    private logger = new Logger();

    constructor(private dataSource: DataSource, private userService: UsersService) {
        this.tasksRepository = this.dataSource.getRepository(Task);
    }

    async create(createTask: CreateTask): Promise<object> {
        try {
            if (!createTask.title) {
                return {
                    "msg": "Missing title",
                    "status": HttpStatus.BAD_REQUEST
                }
            }
            const owner = await this.userService.findOneById(createTask.ownerId);

            const newTask: TaskDTO = {
                title: createTask.title,
                description: createTask.description,
                owner: owner
            }

            const task = await this.tasksRepository.create(newTask);
            
            const created = await this.tasksRepository.save(task);

            if (created) {
                return {
                    "msg": "Task Created",
                    "task": {
                        "id": created.id,
                        "title": created.title,
                        "description": created.description,
                        "owner": {
                            id: created.owner.id,
                            name: created.owner.name
                        },
                        "createdAt": created.createDateTime
                    },
                    "status": HttpStatus.CREATED
                }
            }

        } catch (err) {
            this.logger.error(err.message, err.stack);
            throw new InternalServerErrorException();
        }
    }

    async update(updateTask: UpdateTask): Promise<object> {
        try {
            const existing = await this.tasksRepository.findOne({
                relations: {
                    owner: true,
                },
                where: {
                    id: updateTask.id,
                    owner: {
                        id: updateTask.ownerId,
                    },
                },
            });

            if(!existing) {
                return {
                    "msg": "Task doesn't exist",
                    "status": HttpStatus.BAD_REQUEST
                };
            }

            const updateFields = {
                title: updateTask.title || existing.title,
                description: updateTask.description || existing.description,
                isDone: updateTask.isDone || existing.isDone
            }

            await this.tasksRepository
                .createQueryBuilder()
                .update(Task)
                .set(updateFields)
                .where("id = :id", { id: updateTask.id })
                .execute()

            return {
                "msg": "Task Updated",
                "task": {
                    "id": existing.id,
                    "title": updateFields.title,
                    "description": updateFields.description,
                    "isDone": updateFields.isDone,
                    "owner": existing.owner.name,
                    "createdAt": existing.createDateTime
                },
                "status": HttpStatus.CREATED
            }

        } catch (err) {
            this.logger.error(err.message, err.stack);
            throw new InternalServerErrorException();
        }
    }

    async delete(id: string, ownerId: string): Promise<object> {
        try {
            const existing = await this.tasksRepository.findOne({
                relations: {
                    owner: true,
                },
                where: {
                    id: id,
                    owner: {
                        id: ownerId,
                    },
                },
            });

            if(!existing) {
                return {
                    "msg": "Task doesn't exist",
                    "status": HttpStatus.BAD_REQUEST
                };
            }

            await this.tasksRepository
                .createQueryBuilder()
                .delete()
                .where("id = :id", { id: id })
                .execute()

            return {
                "msg": "Task deleted",
                "status": HttpStatus.OK
            }

        } catch (err) {
            this.logger.error(err.message, err.stack);
            throw new InternalServerErrorException();
        }
    }

    async list(ownerId: string, isDone: boolean): Promise<object> {
        try {
            const where = {
                owner: {
                    id: ownerId,
                }
            };

            if(isDone !== undefined) where['isDone'] = isDone;

            const existing = await this.tasksRepository.find({
                relations: {
                    owner: true,
                },
                where
            });
            return existing.map((task) => {
                return {
                    id: task.id,
                    title: task.title,
                    description: task.description,
                    isDone: task.isDone,
                    createDateTime: task.createDateTime,
                    owner: {
                        id: task.owner.id,
                        name: task.owner.name
                    },
                }
            });
        } catch (err) {
            this.logger.error(err.message, err.stack);
            throw new InternalServerErrorException();
        }
    }

    async get(ownerId: string, taskId: string): Promise<object> {
        try {
            const task = await this.tasksRepository.findOne({
                relations: {
                    owner: true,
                },
                where: {
                    id: taskId,
                    owner: {
                        id: ownerId,
                    },
                }
            });
            return {
                id: task.id,
                title: task.title,
                description: task.description,
                isDone: task.isDone,
                createDateTime: task.createDateTime,
                owner: {
                    id: task.owner.id,
                    name: task.owner.name
                },
            };
        } catch (err) {
            this.logger.error(err.message, err.stack);
            throw new InternalServerErrorException();
        }
    }
}
