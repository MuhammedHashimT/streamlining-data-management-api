import { OrgUser } from "src/org-users/entities/org-user.entity";
import { Organization } from "src/organizations/entities/organization.entity";
import { Project } from "src/projects/entities/project.entity";
import { Column, CreateDateColumn, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id : number;

    @Column()
    FirstName : string;

    @Column()
    LastName : string;

    @Column()
    email : string;

    @Column()
    username : string;

    @Column()
    password : string;

    @Column()
    avatar : string;

    @Column({
        default : false
    })
    isGoogler : boolean;
    // One to Many

    @OneToMany(() => Project , (project : Project) => project.user)
    projects : Project[];

    @OneToMany(() => OrgUser , (orgUser : OrgUser) => orgUser.user)
    orgUsers : OrgUser[];

    @OneToMany(() => Organization , (organization : Organization) => organization.owner)
    ownerOrganizations : Organization[];

    @ManyToMany(() => Project , (project : Project) => project.collaborators)
    collaborations : Project[];

    @CreateDateColumn()
    createdAt : Date;

    @UpdateDateColumn()
    updatedAt : Date;
}
