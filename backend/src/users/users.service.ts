import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class UsersService {
    constructor(private readonly prisma: PrismaService) {}
    // create a new user
    async createUser(email:string, password: string){
        const user = this.prisma.user.create({
            data: {email, password}
        });
        return user;
    }

    // find a user by email
    async findUserByEmail(email:string){
        const user = this.prisma.user.findUnique({
            where: {email: email}
        });
        return user;
    }
}