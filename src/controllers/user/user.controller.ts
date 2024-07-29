import {
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Post,
  Put,
  ParseIntPipe,
} from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { UserService } from 'src/services/user/user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  async getUserById(@Param('id', ParseIntPipe) id: number): Promise<User> {
    const user = await this.userService.user(
      { id },
      {
        include: {
          creations: true,
          profile: true,
          // creations: {
          //   select: {
          //     id: true,
          //     name: true,
          //     image: true,
          //   },
          // },
        },
      },
    );

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  @Get()
  async getUsers(): Promise<User[]> {
    return this.userService.users({});
  }

  @Put(':id')
  async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: Prisma.UserUpdateInput,
  ): Promise<User> {
    try {
      const updatedUser = await this.userService.updateUser({
        where: { id },
        data,
      });

      if (!updatedUser) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }

      return updatedUser;
    } catch (error) {
      console.error('Error updating user:', error);

      throw new InternalServerErrorException('Failed to update user');
    }
  }

  @Post()
  async createUser(@Body() data: Prisma.UserCreateInput): Promise<User> {
    try {
      const newUser = await this.userService.createUser(data);

      return newUser;
    } catch (error) {
      console.error('Error creating user:', error);

      throw new InternalServerErrorException('Failed to create user');
    }
  }

  @Delete(':id')
  async deleteUser(@Param('id', ParseIntPipe) id: number): Promise<User> {
    try {
      const deletedUser = await this.userService.deleteUser({ id });

      if (!deletedUser) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }

      return deletedUser;
    } catch (error) {
      console.error('Error deleting user:', error);
      throw new InternalServerErrorException('Failed to delete user');
    }
  }
}
