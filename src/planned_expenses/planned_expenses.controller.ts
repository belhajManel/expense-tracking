import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { PlannedExpensesService } from './planned_expenses.service';
import { CreatePlannedExpenseDto } from './dto/create-planned_expense.dto';
import { UpdatePlannedExpenseDto } from './dto/update-planned_expense.dto';
import { AccessTokenGuard } from 'src/iam/authentication/guards/access-token.guard';

@Controller('planned-expenses')
export class PlannedExpensesController {
  constructor(
    private readonly plannedExpensesService: PlannedExpensesService,
  ) {}

  @UseGuards(AccessTokenGuard)
  @Post()
  create(@Body() createPlannedExpenseDto: CreatePlannedExpenseDto) {
    return this.plannedExpensesService.create(createPlannedExpenseDto);
  }

  @UseGuards(AccessTokenGuard)
  @Get()
  findAll() {
    return this.plannedExpensesService.findAll();
  }

  @UseGuards(AccessTokenGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.plannedExpensesService.findOne(id);
  }

  @UseGuards(AccessTokenGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePlannedExpenseDto: UpdatePlannedExpenseDto,
  ) {
    return this.plannedExpensesService.update(id, updatePlannedExpenseDto);
  }

  @UseGuards(AccessTokenGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.plannedExpensesService.remove(+id);
  }
}
