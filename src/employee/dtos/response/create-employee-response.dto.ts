import { Expose } from 'class-transformer';
import { IAddress } from 'src/employee/schema/employee.schema';

export class CreateEmployeeResponseDto {
  @Expose()
  empId: string;

  @Expose()
  firstName: string;

  @Expose()
  lastName: string;

  @Expose()
  email: string;

  @Expose()
  address: IAddress;
}
