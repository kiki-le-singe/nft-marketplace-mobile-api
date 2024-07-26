import { Controller, Get, Param } from '@nestjs/common';
import { User } from '@prisma/client';
import { UserService } from 'src/services/user/user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  async getUserById(@Param('id') id: string): Promise<User> {
    return this.userService.user(
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
  }

  @Get()
  getUsers() {
    return this.userService.users({});
  }
}
