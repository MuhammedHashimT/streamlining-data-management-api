import { IsNotEmpty } from "class-validator";

export class CreateUserDto {

    @IsNotEmpty()
    username: string;
    @IsNotEmpty()
    password: string;
    @IsNotEmpty()
    email: string;
    @IsNotEmpty()
    FirstName: string;
    
    LastName: string;

    avatar: string;
}
