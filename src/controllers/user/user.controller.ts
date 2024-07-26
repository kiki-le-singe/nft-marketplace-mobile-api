import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { User } from '@prisma/client';
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
}
