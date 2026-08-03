
import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(private readonly usersService: UsersService, private readonly jwtService: JwtService) {}

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

        const payload = { email: user.email, sub: user.id };
        console.log(payload);
        const accessToken = await this.jwtService.signAsync(payload);
        return { accessToken };

    }
}