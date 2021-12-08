import { Type } from 'class-transformer';
import { IsEmail, IsMongoId, IsNumber, IsString } from 'class-validator';
import { ObjectId } from 'mongoose';
import { IAddress } from 'src/employee/schema/employee.schema';

export class AddressRequestDto {
  @IsString()
  city?: string;

  @IsString()
  country?: string;

  @IsString()
  state?: string;

  @IsNumber()
  zipCode?: string;
}

export class CreateEmployeeRequestDto {
  @IsString()
  empId: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsEmail()
  email: string;

  @Type(() => AddressRequestDto)
  address?: IAddress;
}

export class CreateEmployeeRequestWithManagerDto extends CreateEmployeeRequestDto {
  @IsMongoId()
  manager: ObjectId;
}
