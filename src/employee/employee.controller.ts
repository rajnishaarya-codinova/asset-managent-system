import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
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

  @Delete(':employeeId')
  @UseGuards(AuthGuard('jwt'))
  async deleteEmployee(
    @Param() { employeeId }: { employeeId: string },
    @GetUser() user: UserDocument,
  ): Promise<boolean> {
    return this.employeeService.deleteEmployee(employeeId, user);
  }

  @Post('upload')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: any,
    @GetUser() user: UserDocument,
  ): Promise<EmployeeDocument[]> {
    return this.employeeService.uploadFile(file, user);
  }
}
