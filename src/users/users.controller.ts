import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUser } from './dto/login-user.dto';
import { Request, Response } from 'express';
import { JwtService } from '@nestjs/jwt';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly JWTService: JwtService,
  ) {}

  @Post()
  async create(
    @Body() createUserDto: CreateUserDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const user = await this.usersService.create(createUserDto);
    const token = await this.JWTService.signAsync({
      FirstName: user.FirstName,
      LastName: user.LastName,
      email: user.email,
      username: user.username,
      id: user.id,
    },
    {
      secret: process.env.JWT_SECRET,
    });
    if (user) {
      response.cookie(
        'user',
        {
          data: token,
        },
        {
          httpOnly: true,
          // exprires in 7 days
          expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
          sameSite: 'none',
          secure: true,
        },
      );
      return user;
    } else {
      return { message: 'something went wrong' };
    }
  }

    @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get('full')
  findAllFull() {
    return this.usersService.findAllFull();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }

  @Post('login')
  async login(
    @Body() loginUserDto: LoginUser,
    @Res({ passthrough: true }) response: Response,
  ) {
    const logged = await this.usersService.login(
      loginUserDto.username,
      loginUserDto.password,
    );
    const token = await this.JWTService.signAsync({
      FirstName: logged.FirstName,
      LastName: logged.LastName,
      email: logged.email,
      username: logged.username,
      id: logged.id,
    },
    {
      secret: process.env.JWT_SECRET,
    }
    );
    if (logged) {
      response.cookie(
        'user',
        {
          data: token,
        },
        {
          httpOnly: true,
          // exprires in 7 days
          expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
          sameSite: 'none',
          secure: true,
  
        },
      );
      return logged;
    } else {
      return { message: 'username or password is incorrect' };
    }
  }

  // logout
  @Post('logout')
  async logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('user');
    return {
      message: 'success',
    };
  }

  // get logged user

  @Get('/logged/check')
  async getLogged(@Req() req: Request) {
    console.log('token');
    try {
      const token = req.cookies['user'].data;
      console.log(token);

      const data = await this.JWTService.verifyAsync(
        token,

        {
          secret: process.env.JWT_SECRET,
        },
      );
      return data;
    } catch (e) {
      return { message: 'not logged' };
    }
  }
}
