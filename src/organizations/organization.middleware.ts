import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/entities/user.entity';
import { OrganizationsService } from './organizations.service';

@Injectable()
export class OrganizationMiddleware implements NestMiddleware {

    constructor(
        private readonly userService : UsersService,
        private readonly OrganizationService : OrganizationsService
    ){}

    async use(req: Request, res: Response, next: NextFunction) {
    const cookie = req.cookies['user'];
    const body = req.body;

    const verifiedUser : User = await this.userService.verifyToken(cookie);

    if(verifiedUser){
        req.user  = verifiedUser as User;
    }else{
        req.user = null;
        return res.status(401).json({message : 'unauthorized'});
    }

    if(body.id){
        const organization = await this.OrganizationService.findOne(body.id);

        if(organization){
            if(organization.owner.id !== verifiedUser.id){
                return res.status(401).json({message : 'unauthorized'});
            }
        }
    }

    next();
  }
}
