
import { Controller, Get, Request, Post, UseGuards, Version, Req, Body } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import {JwtAuthGuard, LocalAuthGuard, RBACGuard} from './auth.guards';

@Controller('auth')
@ApiTags("Auth")
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('login')
    @UseGuards(LocalAuthGuard)
    @Version("1")
    async login(@Req() req, @Body() loginDto: LoginDto) {
        return this.authService.login(loginDto.username);
    }

    @Get('profile')
    @Version("1")
    @UseGuards(JwtAuthGuard, RBACGuard)
    @ApiBearerAuth('jwt')
    getProfile(@Req() req) {
        return req.user;
    }
}
