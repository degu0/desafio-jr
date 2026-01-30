import { IsNotEmpty, IsString, Matches, MinLength } from 'class-validator';

export class CreateOwnerDto {
  @IsString()
  @IsNotEmpty({ message: 'Name is required' })
  @MinLength(2, { message: 'Name must be at least 2 characters long' })
  name: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^(?:\+55\s?)?(?:\(?\d{2}\)?\s?)?\d{4,5}-?\d{4}$/, {
    message: 'Phone must be in format: (XX) XXXXX-XXXX or (XX) XXXX-XXXX',
  })
  telefone: string;
}
