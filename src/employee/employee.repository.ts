import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepository } from 'src/shared/repository/base.repository';
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
