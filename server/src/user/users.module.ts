import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User, UserSchema } from './schema/user.schema';
import * as dotenv from 'dotenv';

dotenv.config();

@Module({
    imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]), // Provide UserModel
    ],
    providers: [UsersService],
    controllers: [UsersController],
    exports: [UsersService], // Export UsersService to be used in other modules
})
export class UsersModule {}
