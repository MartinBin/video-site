import {Controller, Post, Body, UnauthorizedException, Request, UseGuards} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/auth/dto/create-user.dto';
import { LoginUserDto } from 'src/auth/dto/login-user.dto';
import {ApiBody, ApiOperation, ApiResponse} from '@nestjs/swagger';
import { JwtService } from '@nestjs/jwt';
import {UsersService} from "../user/users.service";
import {AuthGuard} from "@nestjs/passport";

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService,
              private readonly usersService: UsersService,
              private readonly jwtService: JwtService,) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User successfully registered.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  async register(@Body() createUserDto: CreateUserDto) {
    return this.authService.createUser(createUserDto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login a user' })
  @ApiResponse({ status: 200, description: 'User successfully logged in.' })
  @ApiResponse({ status: 400, description: 'Invalid credentials.' })
  async login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Refresh the access token using a refresh token' })
  @ApiResponse({ status: 200, description: 'New access token generated successfully.', type: Object })
  @ApiResponse({ status: 401, description: 'Invalid or expired refresh token.' })
  @ApiBody({ type: String, description: 'The refresh token' })
  async refreshToken(@Body('refreshToken') refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken);

      // Validate the refresh token against the database
      const user = await this.usersService.validateRefreshToken(
          payload.sub,
          refreshToken,
      );

      if (!user) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      // Generate new access token
      const newAccessToken = this.jwtService.sign(
          { email: payload.email, sub: payload.sub, roles: payload.roles },
          { expiresIn: '15m' },
      );

      return { accessToken: newAccessToken };
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('logout')
  @ApiOperation({ summary: 'Logout the currently logged-in user' })
  @ApiResponse({ status: 200, description: 'Logout successful. Refresh token invalidated.' })
  @ApiResponse({ status: 401, description: 'Unauthorized - Please log in.' })
  async logout(@Request() req) {

    await this.usersService.invalidateRefreshToken(req.user._id);
    return { message: 'Logout successful' };
  }
}
