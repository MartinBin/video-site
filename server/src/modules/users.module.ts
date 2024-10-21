import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersService } from '../services/users.service';
import { UsersController } from '../controllers/users.controller';
import { User, UserSchema } from 'src/schemas/user.schema';
import { JwtModule } from '@nestjs/jwt';
import * as dotenv from 'dotenv';
import { PassportModule } from '@nestjs/passport';

dotenv.config();

@Module({
    imports: [
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]), // Provide UserModel
    ],
    providers: [UsersService],
    controllers: [UsersController],
    exports: [UsersService], // Export UsersService to be used in other modules
})
export class UsersModule {}
