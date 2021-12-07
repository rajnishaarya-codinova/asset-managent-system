import { Injectable } from '@nestjs/common';
import { UserDocument } from 'src/user/schema/user.schema';
import { CreateEmployeeRequestWithManagerDto } from './dtos/request/create-employee-request.dto';
import { EmployeeRepository } from './employee.repository';
import { EmployeeDocument } from './schema/employee.schema';

@Injectable()
export class EmployeeService {
  constructor(private readonly employeeRepository: EmployeeRepository) {}

  async createEmployee(
    data: CreateEmployeeRequestWithManagerDto,
  ): Promise<EmployeeDocument> {
    return this.employeeRepository.createEmployee(data);
  }

  async getAllEmployees(user: UserDocument): Promise<EmployeeDocument[]> {
    return this.employeeRepository.getAllEmployees(user);
  }
}
