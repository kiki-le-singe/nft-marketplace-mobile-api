import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { UserService } from 'src/services/user/user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  async getUserById(@Param('id') id: string): Promise<User> {
    const user = await this.userService.user(
      { id: Number(id) },
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
  getUsers() {
    return this.userService.users({});
  }

  @Put(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() data: Prisma.UserUpdateInput,
  ): Promise<User> {
    // Validate the user ID
    const userId = Number(id);
    if (Number.isNaN(userId)) {
      throw new BadRequestException(`Invalid user ID ${id}`);
    }

    try {
      const updatedUser = await this.userService.updateUser({
        where: { id: userId },
        data,
      });

      if (!updatedUser) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }

      return updatedUser;
    } catch (error) {
      console.error('Error updating user:', error);

      if (error instanceof NotFoundException) {
        throw error;
      }

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
  async deleteUser(@Param('id') id: string): Promise<User> {
    const userId = Number(id);
    if (Number.isNaN(userId)) {
      throw new BadRequestException('Invalid user ID');
    }

    try {
      const deletedUser = await this.userService.deleteUser({ id: userId });

      if (!deletedUser) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }

      return deletedUser;
    } catch (error) {
      console.error('Error deleting user:', error);

      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new InternalServerErrorException('Failed to delete user');
    }
  }
}
