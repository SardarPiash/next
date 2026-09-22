import { Body, Controller, Get, Post, Req, UseGuards, UsePipes } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ZodValidationPipe } from 'common/zod-validation.pipe';
import type { RegisterDto } from './dto/register.dto';
import { registerSchema } from './dto/register.dto';
import type { LoginDto } from './dto/login.dto';
import { loginSchema } from './dto/login.dto';
import { refreshSchema, type RefreshDto } from './dto/refresh.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { Throttle } from '@nestjs/throttler';



@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService, 

    ) {}

    @Post('register')
    @Throttle({ default: { limit: 5, ttl: 60000 } })
    @UsePipes(new ZodValidationPipe(registerSchema))
    async register(@Body() body: RegisterDto) {
        return this.authService.register(body.email, body.password);
    }

    @Post('login')
    @Throttle({ default: { limit: 5, ttl: 60000 } })
    @UsePipes(new ZodValidationPipe(loginSchema))
    async login(@Body() body: LoginDto) {
        return this.authService.login(body.email, body.password);
    }

    @Post('refresh')
    @UsePipes(new ZodValidationPipe(refreshSchema))
    async refresh(@Body() body: RefreshDto) {
        return this.authService.refreshAccessToken(body.refreshToken);
    }  
    
    @Get('me')
    @UseGuards(JwtAuthGuard)
    me(@Req() req:any) {
        console.log(req,("Request object======================="));
        return req.user;
    }
}