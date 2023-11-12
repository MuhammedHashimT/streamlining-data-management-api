import { Module } from '@nestjs/common';
import { OrgUsersService } from './org-users.service';
import { OrgUsersController } from './org-users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrgUser } from './entities/org-user.entity';
import { UsersModule } from 'src/users/users.module';
import { OrganizationsModule } from 'src/organizations/organizations.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      OrgUser
    ]),
    UsersModule,
    OrganizationsModule,
  ],
  controllers: [OrgUsersController],
  providers: [OrgUsersService],
  exports: [OrgUsersService]
})
export class OrgUsersModule {}
