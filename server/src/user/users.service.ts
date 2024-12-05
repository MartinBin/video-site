import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from 'src/auth/dto/create-user.dto';
import { User } from './schema/user.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async findOneByEmail(email: string) {
    return await this.userModel.findOne({ email });
  }

  async findOneByUsername(username: string) {
    return await this.userModel.findOne({ username });
  }

  async createUser(createUserDto: CreateUserDto) {
    const newUser = new this.userModel({
      ...createUserDto,
      roles: createUserDto.roles || ['user'],
    });
    return await newUser.save();
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userModel.findOne({ email });
    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }
    throw new BadRequestException('email or password is not correct');
  }

  async findById(id: string): Promise<User> {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async saveRefreshToken(userId: any, refreshToken: string) {
    await this.userModel.findByIdAndUpdate(userId, { refreshToken });
  }

  async validateRefreshToken(
    userId: string,
    refreshToken: string,
  ): Promise<boolean> {
    const user = await this.userModel.findById(userId);
    return user && user.refreshToken === refreshToken;
  }

  async invalidateRefreshToken(userId: any) {
    await this.userModel.findByIdAndUpdate(userId, { refreshToken: null });
  }

  async getUserById(id: string, options?: { includeRole?: boolean }) {
    const user = await this.userModel.findById(id).select('-password -refreshToken -roles').exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (options?.includeRole) {
      return await this.userModel.findById(id).select('-password -refreshToken').exec();
    }
    return user;
  }

  async subscribeUser(subscriberId: string, userId: string){
    const user = await this.userModel.findById(userId).select('-password -refreshToken -roles');
    const subscriber = await this.userModel.findById(subscriberId).select('-password -refreshToken -roles');

    if (!user || !subscriber) {
      throw new NotFoundException('User not found');
    }

    if (user.subscribers.some(sub => sub.userId === subscriberId)) {
      throw new BadRequestException('Already subscribed');
    }

    user.subscribers.push({ userId: subscriber._id.toString(), username: subscriber.username });
    await user.save();

    subscriber.subscribed.push({ userId: user._id.toString(), username: user.username });
    await subscriber.save();

    return { userId: subscriber._id.toString(), username: subscriber.username };
  }

  async unsubscibeUser(subscriberId: string, userId: string){
    const user = await this.userModel.findById(userId).select('-password -refreshToken -roles');
    const subscriber = await this.userModel.findById(subscriberId).select('-password -refreshToken -roles');

    if (!user || !subscriber) {
      throw new NotFoundException('User not found');
    }

    const subscriberIndex = user.subscribers.findIndex(sub => sub.userId === subscriber._id.toString());
    if (subscriberIndex === -1) {
      throw new BadRequestException('Not subscribed');
    }

    user.subscribers.splice(subscriberIndex, 1);
    await user.save();

    const subscribedIndex = subscriber.subscribed.findIndex(sub => sub.userId === user._id.toString());
    if (subscribedIndex !== -1) {
      subscriber.subscribed.splice(subscribedIndex, 1);
      await subscriber.save();
    }

    return { userId: subscriber._id.toString(), username: subscriber.username };
  }
}
