import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CreateUserDto } from "src/dto/create-user.dto";
import { User } from 'src/schemas/user.schema';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from "src/dto/login-user.dto";
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService{

    constructor(@InjectModel(User.name) private UserModel: Model<User>,
    private jwtService: JwtService,) {}

    async createUser(createUserDto: CreateUserDto){
        const user = await this.UserModel.findOne({username: createUserDto.username})
        if(user){
            throw new BadRequestException('username is already taken');
        }
        const email = await this.UserModel.findOne({email: createUserDto.email})

        if(email){
            throw new BadRequestException('email is already taken')
        }
        const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
        const newUser = new this.UserModel({
            ...createUserDto,
            password: hashedPassword,
        });
        return await newUser.save();
    }

    async validateUser(email: string, password: string): Promise<User | null> {
        const user = await this.UserModel.findOne({ email });
        if (user && await bcrypt.compare(password, user.password)) {
            return user;
        }
        throw new BadRequestException('email or password is not correct');
    }

    async logIn(loginUserDto: LoginUserDto){
        const user = await this.validateUser(loginUserDto.email, loginUserDto.password);
        const payload = { email: user.email, sub: user._id };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }

    async findById(id: string): Promise<User> {
        const user = await this.UserModel.findById(id).exec();
        if (!user) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }
        return user;
    }
}