import { Organization } from "src/organizations/entities/organization.entity";
import { User } from "src/users/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Project {
    @PrimaryGeneratedColumn()
    id : number;

    @Column( )
    name : string;

    @Column()
    description : string;

    @Column({ type: 'json' })
    data : JSON;

    @Column({
        default : false
    })
    isPublic : boolean;

    // Many to One
    @ManyToOne(() => User , (user : User) => user.projects)
    user : User;

    @ManyToOne(() => Organization , (organization : Organization) => organization.projects)
    organization : Organization;

 
    // Many to Many
    @JoinTable()
    @ManyToMany(() => User , (user : User) => user.collaborations)
    collaborators : User[];


    @CreateDateColumn()
    createdAt : Date;

    @UpdateDateColumn()
    updatedAt : Date;
}
