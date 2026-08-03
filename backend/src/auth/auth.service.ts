
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
        const {password: _, ...userWithoutPassword} = user;

        return userWithoutPassword;
    }
}