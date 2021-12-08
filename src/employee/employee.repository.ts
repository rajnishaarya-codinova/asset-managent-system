import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepository } from 'src/shared/repository/base.repository';
import { UserDocument } from 'src/user/schema/user.schema';
import { CreateEmployeeRequestWithManagerDto } from './dtos/request/create-employee-request.dto';
import { Employee, EmployeeDocument } from './schema/employee.schema';

@Injectable()
export class EmployeeRepository extends BaseRepository<EmployeeDocument> {
  constructor(
    @InjectModel(Employee.name)
    private readonly employeeModal: Model<EmployeeDocument>,
  ) {
    super(employeeModal);
  }
}
