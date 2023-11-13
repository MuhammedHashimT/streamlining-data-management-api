import { IsNotEmpty } from "class-validator";

export class CreateOrganizationDto {
    @IsNotEmpty()
    name : string;

    description : string;

    logo : string;

    website : string;

    @IsNotEmpty()
    email : string;

    @IsNotEmpty()
    username : string;
}
