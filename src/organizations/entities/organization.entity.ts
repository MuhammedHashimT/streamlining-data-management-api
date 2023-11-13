import { OrgUser } from "src/org-users/entities/org-user.entity";
import { Project } from "src/projects/entities/project.entity";
import { User } from "src/users/entities/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Organization {
    @PrimaryGeneratedColumn()
    id : number;

    @Column()
    name : string;

    @Column({
        nullable : true
    })
    description : string;

    @Column({
        nullable : true
    })
    logo : string;

    @Column({
        nullable : true
    })
    website : string;

    @Column()
    email : string;

    @Column()
    username : string;

    // One to Many
    @OneToMany(() => Project , project => project.organization)
    projects : Project[];

    @OneToMany(() => OrgUser , orgUser => orgUser.organization)
    orgUsers : OrgUser[];

    // Many To One
    @ManyToOne(() => User , (user : User) => user.ownerOrganizations)
    owner : User;

    @CreateDateColumn()
    createdAt : Date;

    @UpdateDateColumn()
    updatedAt : Date;
}
