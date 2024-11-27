import { Injectable, BadRequestException } from '@nestjs/common';
import { UsersService } from 'src/user/users.service';
import { CreateUserDto } from 'src/auth/dto/create-user.dto';
import { LoginUserDto } from 'src/auth/dto/login-user.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async createUser(createUserDto: CreateUserDto) {
    const user = await this.usersService.findOneByUsername(
      createUserDto.username,
    );
    if (user) {
      throw new BadRequestException('Username is already taken');
    }

    const email = await this.usersService.findOneByEmail(createUserDto.email);
    if (email) {
      throw new BadRequestException('Email is already taken');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    return this.usersService.createUser({
      ...createUserDto,
      password: hashedPassword,
    });
  }

  async login(loginUserDto: LoginUserDto) {
    const user = await this.usersService.validateUser(
      loginUserDto.email,
      loginUserDto.password,
    );
    const payload = { email: user.email, sub: user._id, roles: user.roles };

    const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

    // Store the refresh token in the database
    await this.usersService.saveRefreshToken(user._id, refreshToken);

    return { accessToken, refreshToken };
  }
}
