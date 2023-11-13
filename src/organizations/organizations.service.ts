import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Organization } from './entities/organization.entity';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class OrganizationsService {
  constructor(
    @InjectRepository(Organization)
    private organizationRepository: Repository<Organization>,
    private readonly userService: UsersService,
  ) {}

  async create(createOrganizationDto: CreateOrganizationDto , user : any) {
    // checking the username already exist
    const username = createOrganizationDto.username;
    const isUserNameExist = await this.organizationRepository.findOne({
      where: {
        username: username,
      },
    });

    if (isUserNameExist) {
      throw new HttpException(
        `organization with username ${username} already exist`,
        HttpStatus.BAD_REQUEST,
      );
    }


    try {
      const organization = this.organizationRepository.create(
        {
          ...createOrganizationDto,
          owner: user,
        }
      );

      return this.organizationRepository.save(organization);
    } 
    catch (e) {
      throw new HttpException(
        `something went wrong`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAll() {
    try {
      const organizations = await this.organizationRepository.find();
      return organizations;
    } catch (e) {
      throw new HttpException(
        `something went wrong`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAllFull() {
    try {
      const organizations = await this.organizationRepository.find({
        relations: ['owner' , 'projects' , 'orgUsers' , 'orgUsers.user'],
      });
      return organizations;
    } catch (e) {
      throw new HttpException(
        `something went wrong`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOne(id: number) {
    try {
      const organizations = await this.organizationRepository.findOne({
        where: {
          id: id,
        },
        relations: ['owner' , 'projects' , 'orgUsers' , 'orgUsers.user'],
      });
      return organizations;
    } catch (e) {
      throw new HttpException(
        `something went wrong`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(id: number, updateOrganizationDto: UpdateOrganizationDto) {
    const organization = await this.organizationRepository.findOne({
      where: {
        id: id,
      },
    });

    if (!organization) {
      throw new HttpException(
        `organization with name ${updateOrganizationDto.name} not found`,
        HttpStatus.NOT_FOUND,
      );
    }

    const isUserNameExist = await this.organizationRepository.findOne({
      where: {
        username: organization.username,
      },
    });

    if (isUserNameExist && isUserNameExist.username != organization.username) {
      throw new HttpException(
        `organization with username ${isUserNameExist.username} already exist`,
        HttpStatus.BAD_REQUEST,
      );
    }

    

    // check if the username already exists

    try {
      return this.organizationRepository.save({
        ...organization,
        ...updateOrganizationDto,
      });
    } catch (e) {
      throw new HttpException(
        `something went wrong`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async remove(id: number) {
    const organization = await this.organizationRepository.findOne({
      where: {
        id: id,
      },
    });

    if (!organization) {
      throw new HttpException(
        `organization with name ${organization.name} not found`,
        HttpStatus.NOT_FOUND,
      );
    }

    try {
      return this.organizationRepository.delete(id);
    } catch (e) {
      throw new HttpException(
        `something went wrong`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

}
