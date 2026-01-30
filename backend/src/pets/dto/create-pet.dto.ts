import { PetType } from '@prisma/client';
import { IsDateString, IsEnum, IsNotEmpty, IsString, IsUUID, MinLength } from 'class-validator';

export class CreatePetDto {
  @IsString()
  @IsNotEmpty({ message: 'Name is required' })
  @MinLength(2, { message: 'Name must be at least 2 characters long' })
  name: string;
  
  @IsEnum(PetType, { message: 'Type must be a valid pet type' })
  @IsNotEmpty({ message: 'Type is required' })
  type: PetType;

  @IsString()
  @IsNotEmpty({ message: 'Race is required' })
  race: string;

  @IsDateString({}, { message: 'Date of birth must be a valid date' })
  @IsNotEmpty({ message: 'Date of birth is required' })
  dateOfBirth: string;

  @IsUUID('4', { message: 'Owner ID must be a valid UUID' })
  @IsNotEmpty({ message: 'ownerId is required' })
  ownerId: string;
}
