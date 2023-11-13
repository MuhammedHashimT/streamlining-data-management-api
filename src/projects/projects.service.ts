import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from './entities/project.entity';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class ProjectsService {

  constructor(
    @InjectRepository(Project) private projectRepository : Repository<Project>,
    private readonly userService : UsersService
  ) {
  }

  create(createProjectDto: CreateProjectDto , user : any) {
    try{
      const project = this.projectRepository.create(createProjectDto);
      return this.projectRepository.save({
        ...project,
        user : user
      });
    }catch(e){
      throw new HttpException(
        `something went wrong`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      )
    }
  }

  async findAll() {
    try{
      const projects =await this.projectRepository.find();
      return projects;
    }catch(e){
      throw new HttpException(
        `something went wrong`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      )
    }
  }

  async findAllFull() {
    try{
      const projects =await this.projectRepository.find({
        relations : ['collaborators' , 'user' , 'organization'  ]
      });
      return projects;
    }catch(e){
      throw new HttpException(
        `something went wrong`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      )
    }
  }

  async findOne(id: number) {
    try{
      const project =await this.projectRepository.findOne(
        {
          where : {
            id : id
          },
          relations : ['collaborators' , 'user' , 'organization' ]
        }
      );
      return project;
    }catch(e){
      throw new HttpException(
        `something went wrong`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      )
    }
  }

  async  update(id: number, updateProjectDto: UpdateProjectDto) {
    try{
      const project =await this.projectRepository.findOne(
        {
          where : {
            id : id
          }
        }
      );
      if(!project){
        throw new HttpException(
          `project with id ${id} not found`,
          HttpStatus.NOT_FOUND,
        )
      }
      await this.projectRepository.save({
        ...project,
        ...updateProjectDto
      })
    }catch(e){
      throw new HttpException(
        `something went wrong`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      )
    }
  }

  async remove(id: number) {
    try{
      const project =await this.projectRepository.findOne(
        {
          where : {
            id : id
          }
        }
      );
      if(!project){
        throw new HttpException(
          `project with id ${id} not found`,
          HttpStatus.NOT_FOUND,
        )
      }
      await this.projectRepository.delete(id);
    }catch(e){
      throw new HttpException(
        `something went wrong`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      )
    }
  }

  // add collaborator to project
  async addCollaborator(projectId : number,userId : number){
    try{
      const project = await this.projectRepository.findOne(
        {
          where : {
            id : projectId
          }
        }
      );
      if(!project){
        throw new HttpException(
          `project with id ${projectId} not found`,
          HttpStatus.NOT_FOUND,
        )
      }

      const user = await this.userService.findOne(userId);

      if(!user){
        throw new HttpException(
          `user with id ${userId} not found`,
          HttpStatus.NOT_FOUND,
        )
      }

      // add user to project collaborators
      project.collaborators.push(user);

      await this.projectRepository.save({
        ...project,
        collaborators : [...project.collaborators]
      })
    }catch(e){
      throw new HttpException(
        `something went wrong`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      )
    }
  }
}
