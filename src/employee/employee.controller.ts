import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/shared/decorators/getUser.decorator';
import { Serialize } from 'src/shared/interceptors/serialize.interceptor';
import { UserDocument } from 'src/user/schema/user.schema';
import { CreateEmployeeRequestDto } from './dtos/request/create-employee-request.dto';
import { CreateEmployeeResponseDto } from './dtos/response/create-employee-response.dto';
import { EmployeeService } from './employee.service';
import { EmployeeDocument } from './schema/employee.schema';

@Controller('employee')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Serialize(CreateEmployeeResponseDto)
  @Post()
  @UseGuards(AuthGuard('jwt'))
  async createEmployee(
    @Body()
    data: CreateEmployeeRequestDto,
    @GetUser() user: UserDocument,
  ): Promise<EmployeeDocument> {
    return this.employeeService.createEmployee({ ...data, manager: user._id });
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async getAllEmployees(
    @GetUser() user: UserDocument,
  ): Promise<EmployeeDocument[]> {
    return this.employeeService.getAllEmployees(user);
  }
}
