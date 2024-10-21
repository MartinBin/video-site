import { Body, Controller, Post } from "@nestjs/common";
import { UsersService } from "src/services/users.service";
import { ApiBody, ApiConsumes, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from "src/dto/create-user.dto";
import { LoginUserDto } from "src/dto/login-user.dto";


@ApiTags('users')
@Controller('users')
export class UsersController{
    constructor(private readonly usersService: UsersService){}

    @Post()
    @ApiOperation({summary: 'Create user'})
    async createUser(@Body() createUserDto: CreateUserDto){
        return this.usersService.createUser(createUserDto);
    }

    @Post('login')
    async login(@Body() loginUserDto: LoginUserDto) {
        return this.usersService.logIn(loginUserDto);
    }

}