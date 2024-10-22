import { Body, Controller, Post } from "@nestjs/common";
import { UsersService } from "./users.service";
import { ApiBody, ApiConsumes, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from "src/auth/dto/create-user.dto";
import { LoginUserDto } from "src/auth/dto/login-user.dto";


@ApiTags('users')
@Controller('users')
export class UsersController{
    constructor(private readonly usersService: UsersService){}

}