import {
    Body,
    Controller,
    Get,
    Post,
    Request,
    UseGuards
} from '@nestjs/common';
import { AuthGuard } from './auth.guard';
import { AuthService, LoginUser } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('/signin')
    async signUp(@Body() user: LoginUser) {
        return await this.authService.signIn(user);
    }

    @UseGuards(AuthGuard)
    @Get('profile')
    getProfile(@Request() req) {
        return req.user;
    }
}
