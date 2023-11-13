import { Controller, Get, Post, Body, Patch, Param, Delete, Res, Req } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Request } from 'express';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  create(@Body() createProjectDto: CreateProjectDto ,@Req() req: Request) {
    
    return this.projectsService.create(createProjectDto , req.user);
  }

  @Get()
  findAll() {
    return this.projectsService.findAll();
  }

  @Get('/full')
  findAllFull() {
    return this.projectsService.findAllFull();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.projectsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProjectDto: UpdateProjectDto) {
    return this.projectsService.update(+id, updateProjectDto);
  }

  // add collaborator
  @Patch(':id/addCollaborator')
  addCollaborator(@Param('id') id: string, @Body('userId') userId : number) {
    return this.projectsService.addCollaborator(+id, userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.projectsService.remove(+id);
  }
}
