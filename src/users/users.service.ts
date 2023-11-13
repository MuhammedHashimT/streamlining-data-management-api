import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User) private userRepository : Repository<User>,
    private readonly jwtService : JwtService
  ) {

  }

async create(createUserDto: CreateUserDto) { 
     // checking the username already exist
    const username = createUserDto.username;
    const isUserNameExist = await this.userRepository.findOne({
      where : {
        username : username
      }
    });

    if(isUserNameExist){
      throw new HttpException(
        `user with username ${username} already exist`,
        HttpStatus.BAD_REQUEST,
      );
    }


    // hash the password
    const salt = bcrypt.genSaltSync(10);

    const password = bcrypt.hashSync(createUserDto.password,salt);

    createUserDto.password = password;

    try{
      const user = this.userRepository.create(createUserDto);

      return this.userRepository.save(user);

    }catch(e){
      throw new HttpException(
        `something went wrong`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      )
    }
    
  }

  async findAll() {
    try{
      const users =await this.userRepository.find();
      return users;
    }catch(e){
      throw new HttpException(
        `something went wrong`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      )
    }
  }

  async findAllFull() {
    try{
      const users =await this.userRepository.find({
        relations : ['projects' , 'collaborations' , 'orgUsers' , 'ownerOrganizations' , 'orgUsers.organization' ]
      });
      return users;
    }catch(e){
      throw new HttpException(
        `something went wrong`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      )
    }
  }

  async findOne(id: number) {
    try{
      const users =await this.userRepository.findOne(
        {
          where : {
            id : id
          },
        relations : ['projects' , 'collaborations' , 'orgUsers' , 'ownerOrganizations' , 'orgUsers.organization' ]
        }
      );
      return users;
    }catch(e){
      throw new HttpException(
        `something went wrong`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      )
    }
  }

 async update(id: number, updateUserDto: UpdateUserDto) {
  
    
    const user = await this.userRepository.findOne({
      where : {
        id : id
      }
    })

    if(!user){
      throw new HttpException(
        `user with name ${updateUserDto.username} not found`,
        HttpStatus.NOT_FOUND,
      )
    }

    const isUserNameExist = await this.userRepository.findOne({
      where : {
        username : updateUserDto.username
      }
    })

    if(isUserNameExist && isUserNameExist.id != id){
      throw new HttpException(
        `user with name ${updateUserDto.username} already exist`,
        HttpStatus.BAD_REQUEST,
      )
    }

    const salt = bcrypt.genSaltSync(10);
    if(updateUserDto.password){
      updateUserDto.password = bcrypt.hashSync(updateUserDto.password,salt);
    }

    try{
      const user = await this.userRepository.save({
        id : id,
        ...updateUserDto
      });
      return user;
    }
    catch(e){
      throw new HttpException(
        `something went wrong`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      )
    }

  }

  async remove(id: number) {  
      const user = await this.userRepository.findOne({
        where : {
          id : id
        }
      })
  
      if(!user){
        throw new HttpException(
          `user with id ${id} not found`,
          HttpStatus.NOT_FOUND,
        )
      }
  
      try{
        const user = await this.userRepository.delete({
          id : id
        });
        return user;
      }
      catch(e){
        throw new HttpException(
          `something went wrong`,
          HttpStatus.INTERNAL_SERVER_ERROR,
        )
      }
  }

  async login(username : string,password : string){

    // check is it admin

    if(username == process.env.ADMIN_USERNAME && password == process.env.ADMIN_PASSWORD){
      return {
        username : 'admin',
        isAdmin : true ,
        FirstName : "Admin",
      LastName : "Admin",
      email : "Admin",
      id : "Admin"
      }
    }

    const user = await this.userRepository.findOne({
      where : {
        username : username
      }
    })

    if(!user){
      throw new HttpException(
        `user with name ${username} not found`,
        HttpStatus.NOT_FOUND,
      )
    }

    const isPasswordMatch = bcrypt.compareSync(password,user.password);

    if(!isPasswordMatch){
      throw new HttpException(
        `password not match`,
        HttpStatus.BAD_REQUEST,
      )
    }

    return user;
  }

  async verifyToken(token : any){
    // verify the token of jwt
    console.log(token);
    
    const tokenData = await this.jwtService.verify(JSON.stringify(token) ,
      {
        secret :  process.env.JWT_SECRET,
      });

    // check if the user exist
    const user = await this.userRepository.findOne({
      where : {
        id : tokenData.id
      }
    })

    if(!user){
      throw new HttpException(
        `user with id ${tokenData.id} not found`,
        HttpStatus.NOT_FOUND,
      )
    }

    return user;

  }

}
