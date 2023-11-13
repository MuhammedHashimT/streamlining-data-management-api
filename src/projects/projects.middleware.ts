import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { UsersService } from 'src/users/users.service';
import { ProjectsService } from './projects.service';
import { Project } from './entities/project.entity';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class ProjectMiddleware implements NestMiddleware {

    constructor(
        private readonly userService : UsersService,
        private readonly projectService : ProjectsService
    ){}

    async use(req: Request, res: Response, next: NextFunction) {
    const cookie = req.cookies['user'];
    const body = req.body;

    if(!cookie){
        req.user = null;
        return res.status(401).json({message : 'unauthorized'});
    }

    const verifiedUser : User = await this.userService.verifyToken(cookie);

    if(verifiedUser){
        req.user  = verifiedUser as User;
    }else{
        req.user = null;
        return res.status(401).json({message : 'unauthorized'});
    }

    if(body.id){
        const project : Project = await this.projectService.findOne(body.id);

        if(project.organization){
            if(project.organization.owner.id !== verifiedUser.id || project.organization.orgUsers.find((collaborator) => collaborator.user.id === verifiedUser.id) === undefined){
                return res.status(401).json({message : 'unauthorized'});
            }
        }
        
        if(project){
            if(project.user.id !== verifiedUser.id || project.collaborators.find((collaborator) => collaborator.id === verifiedUser.id) === undefined){
                return res.status(401).json({message : 'unauthorized'});
            }
        }

    }

    next();
  }
}
