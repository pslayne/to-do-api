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
import { TasksService, CreateTask, UpdateTask, TaskDTO } from './tasks.service';
import { ApiBadRequestResponse, ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiHeader, ApiOkResponse, ApiQuery, ApiResponse, ApiUnauthorizedResponse, PickType } from '@nestjs/swagger';

@Controller('tasks')
@ApiUnauthorizedResponse({ description: "unauthorized" })
export class TasksController {
    constructor(private taskService: TasksService) {}

    @UseGuards(AuthGuard)
    @Post('')
    @ApiCreatedResponse({ description: "task is created" })
    @ApiBadRequestResponse({ description: "missing title" })
    async create(@Request() req, @Body() task: CreateTask) {
        task.ownerId = req.user.id;
        return await this.taskService.create(task);
    }

    @UseGuards(AuthGuard)
    @Patch('')
    @ApiOkResponse({ description: "task is updated" })
    @ApiBadRequestResponse({ description: "task doesn't exist" })
    async update(@Request() req, @Body() task: UpdateTask) {
        task.ownerId = req.user.id;
        return await this.taskService.update(task);
    }
    
    @UseGuards(AuthGuard)
    @Delete('/:id')
    @ApiOkResponse({ description: "task is deleted" })
    @ApiBadRequestResponse({ description: "task doesn't exist" })
    async delete(@Request() req, @Param('id') id: string) {
        const ownerId = req.user?.id;
        return await this.taskService.delete(id, ownerId);
    }

    @UseGuards(AuthGuard)
    @Get()
    @ApiResponse({
        isArray: true,
        type: TaskDTO,
        status: 200
      })
    @ApiQuery({ name: 'isDone', example: true, required: false })
    async getAll(@Request() req, @Query('isDone') isDone?: boolean) {
        const ownerId = req.user?.id;
        return await this.taskService.list(ownerId, isDone);
    }

    @UseGuards(AuthGuard)
    @Get("/:id")
    @ApiResponse({
        isArray: false,
        type: TaskDTO,
        status: 200
      })
    @ApiBadRequestResponse({ description: "task doesn't exist" })
    async get(@Request() req, @Param('id') id: string) {
        const ownerId = req.user?.id;
        return await this.taskService.get(ownerId, id);
    }
}
