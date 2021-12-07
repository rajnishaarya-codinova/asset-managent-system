import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDocument } from 'src/user/schema/user.schema';
import { CreateEmployeeRequestWithManagerDto } from './dtos/request/create-employee-request.dto';
import { Employee, EmployeeDocument } from './schema/employee.schema';

@Injectable()
export class EmployeeRepository {
  constructor(
    @InjectModel('Employee') private readonly employeeModal: Model<Employee>,
  ) {}

  async createEmployee(
    data: CreateEmployeeRequestWithManagerDto,
  ): Promise<EmployeeDocument> {
    return this.employeeModal.create(data);
  }

  async getAllEmployees(user: UserDocument): Promise<EmployeeDocument[]> {
    return this.employeeModal.find({ manager: user._id });
  }
}
