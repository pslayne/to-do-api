import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import * as bcrypt from 'bcrypt';
import { UsersService } from './../users/users.service';
import { ApiProperty } from '@nestjs/swagger';

export class LoginUser {
    @ApiProperty({example: "maria"})
    login: string;
    @ApiProperty({example: "12345"})
    password: string;
}

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async signIn({ login, password }: LoginUser): Promise<{ access_token: string }> {
    const user = await this.usersService.findOne(login);
    if (!user || !bcrypt.compare(password, user.password)) {
      throw new UnauthorizedException();
    }
    const payload = { id: user.id, username: user.login };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}