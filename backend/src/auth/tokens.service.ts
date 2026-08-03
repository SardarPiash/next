import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";


@Injectable()
export class TokensService {

    constructor(private readonly jwtService: JwtService, private readonly configService: ConfigService) {}
    async signRefreshToken(userId: string) {
        const payload = { sub: userId };
        return this.jwtService.signAsync(payload, {
            secret: this.configService.getOrThrow<string>('JWT_REFRESH_SECRET'),
            expiresIn: '7d',
        });
    }

    async verifyRefreshToken(refreshToken: string) {
        return this.jwtService.verifyAsync(refreshToken, {
            secret: this.configService.getOrThrow<string>('JWT_REFRESH_SECRET'),
        });
    }

}