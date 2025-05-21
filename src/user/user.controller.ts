import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { get } from 'http';
import { create } from 'domain';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post('create')
    async create(@Body() createUserDto: CreateUserDto){
        return await this.userService.create(createUserDto);
    }

    @Get('stats') getDashMetrics(){
        return this.userService.getDashMetrics();
    }

    @Get('query')
    getUser(@Query() query: any) {
    return this.userService.getUser(query);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }
}
