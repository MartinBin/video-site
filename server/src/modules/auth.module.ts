import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UsersService } from 'src/services/users.service';
import { JwtStrategy } from '../strategy/jwt.strategy';
import { UsersModule } from 'src/modules/users.module';

@Module({
    imports: [
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.register({
            secret: process.env.JWT_SECRET, // Use your secret key
            signOptions: { expiresIn: '60s' }, // Token expiration time
        }),
        UsersModule,
    ], 
    providers: [UsersService, JwtStrategy],
    exports: [JwtStrategy, PassportModule, JwtModule], // Export JwtModule if needed in other modules
})
export class AuthModule {}