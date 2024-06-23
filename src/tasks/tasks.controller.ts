import { Controller, 
    Get, 
    Post,
    UseGuards,
    Request,
    Body,
    Delete,
    Query,
    Param,
    Patch
} from '@nestjs/common';
import { AuthGuard } from './../auth/auth.guard';
import { TasksService, CreateTask, UpdateTask } from './tasks.service';

@Controller('tasks')
export class TasksController {
    constructor(private taskService: TasksService) {}

    @UseGuards(AuthGuard)
    @Post('')
    async create(@Request() req, @Body() task: CreateTask) {
        task.ownerId = req.user.id;
        return await this.taskService.create(task);
    }

    @UseGuards(AuthGuard)
    @Patch('')
    async update(@Request() req, @Body() task: UpdateTask) {
        task.ownerId = req.user.id;
        return await this.taskService.update(task);
    }
    
    @UseGuards(AuthGuard)
    @Delete('/:id')
    async delete(@Request() req, @Param('id') id: string) {
        const ownerId = req.user?.id;
        return await this.taskService.delete(id, ownerId);
    }

    @UseGuards(AuthGuard)
    @Get()
    async getAll(@Request() req, @Query('isDone') isDone: boolean) {
        const ownerId = req.user?.id;
        return await this.taskService.list(ownerId, isDone);
    }

    @UseGuards(AuthGuard)
    @Get("/:id")
    async get(@Request() req, @Param('id') id: string) {
        const ownerId = req.user?.id;
        return await this.taskService.get(ownerId, id);
    }
}
