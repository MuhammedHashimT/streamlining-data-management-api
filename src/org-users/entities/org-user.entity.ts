import { Organization } from "src/organizations/entities/organization.entity";
import { User } from "src/users/entities/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class OrgUser {

    @PrimaryGeneratedColumn()
    id : number;

    // Many to One
    @ManyToOne(() => User , (user : User) => user.orgUsers)
    user : User;

    @ManyToOne(() => Organization , (organization : Organization) => organization.orgUsers)
    organization : Organization;

}
