import { BadRequestException, Injectable } from '@nestjs/common';
import { isValidId } from 'src/shared/utils/common.utils';
import { UserDocument } from 'src/user/schema/user.schema';
import { CreateEmployeeRequestDto } from './dtos/request/create-employee-request.dto';
import { EmployeeRepository } from './employee.repository';
import { Employee, EmployeeDocument } from './schema/employee.schema';

@Injectable()
export class EmployeeService {
  constructor(private readonly employeeRepository: EmployeeRepository) {}

  async createEmployee(
    createEmployeeAttrs: CreateEmployeeRequestDto,
    user: UserDocument,
  ): Promise<EmployeeDocument> {
    const createdEmployee = await this.employeeRepository.create({
      ...createEmployeeAttrs,
      managedBy: user._id,
    });
    return createdEmployee;
  }

  async getAllEmployees(user: UserDocument): Promise<EmployeeDocument[]> {
    return this.employeeRepository.find({ managedBy: user._id });
  }

  async getEmployee(
    employeeId: string,
    user: UserDocument,
  ): Promise<EmployeeDocument> {
    if (!isValidId(employeeId)) {
      throw new BadRequestException('Inavlid Employee Id');
    }
    return this.employeeRepository.findOne({
      _id: employeeId,
      managedBy: user._id,
    });
  }

  async updateEmployee(
    employeeId: string,
    updateEmployeeAttrs: Partial<Employee>,
    user: UserDocument,
  ): Promise<EmployeeDocument> {
    if (!isValidId(employeeId)) {
      throw new BadRequestException('Inavlid Employee Id');
    }
    const employee = await this.employeeRepository.findOne({
      _id: employeeId,
      managedBy: user._id,
    });
    if (!employee) {
      throw new BadRequestException('Employee not found');
    }
    const updatedEmployee = await this.employeeRepository.findByIdAndUpdate(
      employeeId,
      updateEmployeeAttrs,
    );
    return updatedEmployee;
  }

  async deleteEmployee(
    employeeId: string,
    user: UserDocument,
  ): Promise<boolean> {
    const employee = await this.getEmployee(employeeId, user);
    if (!employee) {
      throw new BadRequestException();
    }
    return this.employeeRepository.deleteOne({ _id: employeeId });
  }
}
