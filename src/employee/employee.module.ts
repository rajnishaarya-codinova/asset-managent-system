import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EmployeeController } from './employee.controller';
import { EmployeeRepository } from './employee.repository';
import { EmployeeService } from './employee.service';
import { Employee, EmployeeSchema } from './schema/employee.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Employee.name, schema: EmployeeSchema },
    ]),
  ],
  controllers: [EmployeeController],
  providers: [EmployeeService, EmployeeRepository],
  exports: [EmployeeService, EmployeeRepository],
})
export class EmployeeModule {}
