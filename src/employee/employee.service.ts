import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ExcelUploadService } from 'src/shared/ExcelUpload/excel-upload.service';
import { EmployeeExceptionEnum } from 'src/shared/enum/employee-exception.enum';
import { isValidId } from 'src/shared/utils/common.utils';
import { UserDocument } from 'src/user/schema/user.schema';
import { CreateEmployeeRequestDto } from './dtos/request/create-employee-request.dto';
import { EmployeeRepository } from './employee.repository';
import { Employee, EmployeeDocument } from './schema/employee.schema';

@Injectable()
export class EmployeeService {
  constructor(
    private readonly employeeRepository: EmployeeRepository,
    private readonly excelUploadService: ExcelUploadService,
  ) {}

  validateFile(data: CreateEmployeeRequestDto): void {
    if (
      typeof data.empId === undefined ||
      typeof data.empId !== 'string' ||
      data.empId.trim().length < 1
    ) {
      throw new BadRequestException();
    } else if (
      typeof data.firstName === undefined ||
      typeof data.firstName !== 'string' ||
      data.firstName.trim().length < 1
    ) {
      throw new BadRequestException();
    } else if (
      typeof data.lastName === undefined ||
      typeof data.lastName !== 'string' ||
      data.lastName.trim().length < 1
    ) {
      throw new BadRequestException();
    } else if (
      typeof data.email === undefined ||
      typeof data.email !== 'string' ||
      data.email.trim().length < 1
    ) {
      throw new BadRequestException();
    }
  }

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
      throw new BadRequestException(EmployeeExceptionEnum.INVALID_EMPLOYEE_ID);
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
      throw new BadRequestException(EmployeeExceptionEnum.INVALID_EMPLOYEE_ID);
    }
    const employee = await this.employeeRepository.findOne({
      _id: employeeId,
      managedBy: user._id,
    });
    if (!employee) {
      throw new BadRequestException(EmployeeExceptionEnum.EMPLOYEE_NOT_FOUND);
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

  async uploadFile(file: any, user: UserDocument): Promise<EmployeeDocument[]> {
    try {
      const data = this.excelUploadService.getData(file);
      const records = data.map((i: CreateEmployeeRequestDto) => {
        this.validateFile(i);
        return { ...i, managedBy: user._id };
      });
      const uploaded = await this.employeeRepository.bulkInsert(records);
      return uploaded;
    } catch (error) {
      if (error.code === 11000) {
        throw new BadRequestException();
      }
      throw new InternalServerErrorException();
    }
  }
}
