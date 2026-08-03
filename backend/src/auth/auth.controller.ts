import { Body, Controller, Post, UsePipes } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ZodValidationPipe } from 'common/zod-validation.pipe';
import type { RegisterDto } from './dto/register.dto';
import { registerSchema } from './dto/register.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('register')
    @UsePipes(new ZodValidationPipe(registerSchema))
    async register(@Body() body: RegisterDto) {
        return this.authService.register(body.email, body.password);
    }
}