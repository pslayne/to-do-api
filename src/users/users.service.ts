import {
    HttpStatus,
    Injectable,
    InternalServerErrorException,
    Logger,
} from '@nestjs/common';
import { DataSource } from 'typeorm';
import { User } from './users.entity';
import * as bcrypt from 'bcrypt';
import { ApiProperty } from '@nestjs/swagger';
  
export class CreateUser {
    @ApiProperty({example: "maria"})
    login: string;
    @ApiProperty({example: "12345"})
    password: string;
    @ApiProperty({example: "maria da silva"})
    name: string;
}

export class UserDTO extends CreateUser {
    @ApiProperty({example: "9e0783ba-bfca-4227-a21a-e61a5862b626"})
    id: string;
}

@Injectable()
export class UsersService {
    private userRepository;
    private logger = new Logger();

    constructor(private dataSource: DataSource) {
        this.userRepository = this.dataSource.getRepository(User);
    }

    async createUser(createUser: CreateUser): Promise<object> {
        try {
            if(!createUser.login || !createUser.name || !createUser.password) {
                return {
                    "msg": "Missing fields",
                    "status": HttpStatus.BAD_REQUEST
                };
            }

            const existing = await this.findOne(createUser.login);
            
            if(existing) {
                return {
                    "msg": "Username already exists",
                    "status": HttpStatus.BAD_REQUEST
                };
            }

            createUser.password = await hashPassword(createUser.password);
            const user = await this.userRepository.create(createUser);
            const created = await this.userRepository.save(user);

            if(created) {
                return {
                    "msg": "User Created",
                    "status": HttpStatus.CREATED
                };
            }
        } catch (err) {
            this.logger.error(err.message, err.stack);
            throw new InternalServerErrorException(
                'Something went wrong, Try again!',
            );
        }
    }

    async list(): Promise<object> {
        try {
            const existing = await this.userRepository.find();
            return existing.map((user) => {
                return {
                    id: user.id,
                    name: user.name
                }
            });
        } catch (err) {
            this.logger.error(err.message, err.stack);
            throw new InternalServerErrorException();
        }
    }

    async findOne(username: string): Promise<UserDTO> {
        return await this.userRepository.findOneBy({
            login: username
        });
    }

    async findOneById(id: string): Promise<UserDTO> {
        return await this.userRepository.findOneBy({
            id
        });
    }
}

async function hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    return await bcrypt.hash(password, salt);
}