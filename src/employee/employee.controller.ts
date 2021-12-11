import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/shared/decorators/getUser.decorator';
import { UserDocument } from 'src/user/schema/user.schema';
import { CreateEmployeeRequestDto } from './dtos/request/create-employee-request.dto';
import { EmployeeService } from './employee.service';
import { EmployeeDocument } from './schema/employee.schema';

@Controller('employee')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async createEmployee(
    @Body()
    createEmployeeAttrs: CreateEmployeeRequestDto,
    @GetUser() user: UserDocument,
  ): Promise<EmployeeDocument> {
    return this.employeeService.createEmployee(createEmployeeAttrs, user);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async getAllEmployees(
    @GetUser() user: UserDocument,
  ): Promise<EmployeeDocument[]> {
    return this.employeeService.getAllEmployees(user);
  }

  @Get(':employeeId')
  @UseGuards(AuthGuard('jwt'))
  async getEmployee(
    @Param() { employeeId }: { employeeId: string },
    @GetUser() user: UserDocument,
  ): Promise<EmployeeDocument> {
    return this.employeeService.getEmployee(employeeId, user);
  }

  @Put(':employeeId')
  @UseGuards(AuthGuard('jwt'))
  async updateEmployee(
    @Body()
    updateEmployeeAttrs: Partial<CreateEmployeeRequestDto>,
    @Param() { employeeId }: { employeeId: string },
    @GetUser() user: UserDocument,
  ): Promise<EmployeeDocument> {
    return this.employeeService.updateEmployee(
      employeeId,
      updateEmployeeAttrs,
      user,
    );
  }
}
