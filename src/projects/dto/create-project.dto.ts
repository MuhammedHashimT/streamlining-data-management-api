import { IsNotEmpty } from "class-validator";

export class CreateProjectDto {
    @IsNotEmpty()
    name: string;
    
    description: string;

    data: JSON;

    isPublic: boolean;

    userId : number;

    organizationId : number;
}
