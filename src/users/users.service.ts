import {
    HttpStatus,
    Injectable,
    InternalServerErrorException,
    Logger,
} from '@nestjs/common';
import { DataSource } from 'typeorm';
import { User } from './users.entity';
import * as bcrypt from 'bcrypt';
  
export interface CreateUser {
    login: string;
    password: string;
    name: string;
}

export interface UserDTO extends CreateUser {
    id: string;
}

@Injectable()
export class UsersService {
    private userRepository;
    private logger = new Logger();

    //   inject the Datasource provider
    constructor(private dataSource: DataSource) {
        // get users table repository to interact with the database
        this.userRepository = this.dataSource.getRepository(User);
    }

    //  create handler to create new user and save to the database
    async createUser(createUser: CreateUser): Promise<object> {
        try {
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