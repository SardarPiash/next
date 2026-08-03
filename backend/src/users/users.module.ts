import { UsersService } from "./users.service";
import { Module } from "@nestjs/common";
import { PrismaModule } from "../prisma/prisma.module";


@Module({
    imports: [PrismaModule],
    controllers: [],
    providers: [UsersService],
    exports: [UsersService],
})
export class UsersModule {}