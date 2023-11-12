import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { OrgUsersService } from './org-users.service';
import { CreateOrgUserDto } from './dto/create-org-user.dto';
import { UpdateOrgUserDto } from './dto/update-org-user.dto';

@Controller('org-users')
export class OrgUsersController {
  constructor(private readonly orgUsersService: OrgUsersService) {}

  @Post()
  create(@Body() createOrgUserDto: CreateOrgUserDto) {
    return this.orgUsersService.create(createOrgUserDto);
  }

  @Get()
  findAll() {
    return this.orgUsersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.orgUsersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrgUserDto: UpdateOrgUserDto) {
    return this.orgUsersService.update(+id, updateOrgUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.orgUsersService.remove(+id);
  }
}
