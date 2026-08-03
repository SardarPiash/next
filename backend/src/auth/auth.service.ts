
import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
    constructor(private readonly usersService: UsersService) {}

    async register(email: string, password: string) {
        const hasUser = await this.usersService.findUserByEmail(email);
        if (hasUser) {
            throw new BadRequestException('User already exists');
        }

        const user = await this.usersService.createUser(email, password);
        if(!user) {
            const status = "user not created";
            return { status };
        }else {
            const {password: _, id: __, ...userWithoutPassword} = user;
            const status = "user created";
            return { status, user: userWithoutPassword };
        }
    }
}