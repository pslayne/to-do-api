import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { AuthModule } from './../auth/auth.module';
import { UsersModule } from './../users/users.module';

@Module({
  imports: [AuthModule, UsersModule],
  providers: [TasksService],
  controllers: [TasksController],
  exports: [TasksService]
})
export class TasksModule {}
