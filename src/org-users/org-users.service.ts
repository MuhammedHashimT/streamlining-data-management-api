import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateOrgUserDto } from './dto/create-org-user.dto';
import { UpdateOrgUserDto } from './dto/update-org-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { OrgUser } from './entities/org-user.entity';
import { Repository } from 'typeorm';
import { OrganizationsService } from 'src/organizations/organizations.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class OrgUsersService {
  constructor(
    @InjectRepository(OrgUser) private orgUserRepository: Repository<OrgUser>,
    private usersService: UsersService,
    private organizationsService: OrganizationsService,
  ) {}

  async create(createOrgUserDto: CreateOrgUserDto) {
    const userId = createOrgUserDto.userId;
    const organizationId = createOrgUserDto.organizationId;

    const user = await this.usersService.findOne(userId);
    const organization =
      await this.organizationsService.findOne(organizationId);

    if (!user) {
      throw new HttpException(
        `user with id ${userId} not found`,
        HttpStatus.NOT_FOUND,
      );
    }

    if (!organization) {
      throw new HttpException(
        `organization with id ${organizationId} not found`,
        HttpStatus.NOT_FOUND,
      );
    }

    try {
      const orgUser = this.orgUserRepository.create({
        user: user,
        organization: organization,
      });
      return this.orgUserRepository.save(orgUser);
    } catch (e) {
      throw new HttpException(
        `something went wrong`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAll() {
    try {
      const orgUsers = await this.orgUserRepository.find();

      return orgUsers;
    } catch (e) {
      throw new HttpException(
        `something went wrong`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOne(id: number) {
    try {
      const orgUsers = await this.orgUserRepository.find({
        where: {
          id: id,
        },
      });

      return orgUsers;
    } catch (e) {
      throw new HttpException(
        `something went wrong`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(id: number, updateOrgUserDto: UpdateOrgUserDto) {
    const userId = updateOrgUserDto.userId;
    const organizationId = updateOrgUserDto.organizationId;

    const user = await this.usersService.findOne(userId);
    const organization =
      await this.organizationsService.findOne(organizationId);

    if (!user) {
      throw new HttpException(
        `user with id ${userId} not found`,
        HttpStatus.NOT_FOUND,
      );
    }

    if (!organization) {
      throw new HttpException(
        `organization with id ${organizationId} not found`,
        HttpStatus.NOT_FOUND,
      );
    }

    const orgUser = await this.orgUserRepository.findOne({
      where: {
        id: id,
      },
    });

    if (!orgUser) {
      throw new HttpException(
        `orgUser with id ${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }

    try {
      await this.orgUserRepository.save({
        ...orgUser,
        ...updateOrgUserDto,
      });
    } catch (e) {
      throw new HttpException(
        `something went wrong`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async remove(id: number) {
    try {
      const orgUser = await this.orgUserRepository.findOne({
        where: {
          id: id,
        },
      });

      if (!orgUser) {
        throw new HttpException(
          `orgUser with id ${id} not found`,
          HttpStatus.NOT_FOUND,
        );
      }

      return this.orgUserRepository.delete(id);
    } catch (e) {
      throw new HttpException(
        `something went wrong`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
