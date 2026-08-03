
import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { TokensService } from './tokens.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(private readonly usersService: UsersService, private readonly tokensService: TokensService, private readonly jwtService: JwtService) {}

    async register(email: string, password: string) {
        const hasUser = await this.usersService.findUserByEmail(email);
        if (hasUser) {
            throw new BadRequestException('User already exists');
        }

        const passwordHash = await bcrypt.hash(password, 10);
        const user = await this.usersService.createUser(email, passwordHash);
        if(!user) {
            const status = "user not created";
            return { status };
        }else {
            const {password: _, id: __, ...userWithoutPassword} = user;
            const status = "user created";
            return { status, user: userWithoutPassword };
        }
    }

    // login function
    async login(email: string, password: string){
        const user = await this.usersService.findUserByEmail(email);

        if(!user){
            throw new UnauthorizedException('Invalid credentials');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(!isPasswordValid){
            throw new UnauthorizedException('Invalid credentials');
        }

        const accessToken = await this.jwtService.signAsync({ sub: user.id });
        const refreshToken = await this.tokensService.signRefreshToken(user.id);
        return { accessToken, refreshToken };

    }

    async refreshAccessToken(refreshToken: string) {
        try {
            const payload = await this.tokensService.verifyRefreshToken(refreshToken);
            const accessToken = await this.jwtService.signAsync({ sub: payload.sub });
            return { accessToken };
        } catch (error) {
            throw new UnauthorizedException('Invalid refresh token or expired');
        }
    }
}