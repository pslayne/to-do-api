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
import { ApiExcludeEndpoint, ApiOkResponse, ApiResponse, ApiResponseProperty } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('/signin')
    @ApiOkResponse({description: "user signed in"})
    async signUp(@Body() user: LoginUser) {
        return await this.authService.signIn(user);
    }

    @UseGuards(AuthGuard)
    @Get('profile')
    @ApiExcludeEndpoint()
    getProfile(@Request() req) {
        return req.user;
    }
}
