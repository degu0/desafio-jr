import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { OwnersService } from './owners.service';
import { CreateOwnerDto } from './dto/create-owner.dto';
import { UpdateOwnerDto } from './dto/update-owner.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt-guard.guard';

@Controller('owner')
export class OwnersController {
  constructor(private readonly ownersService: OwnersService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  createOwner(@Body() createOwnerDto: CreateOwnerDto) {
    return this.ownersService.create(createOwnerDto);
  } 

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOneOwner(@Param('id') id: string) {
    return this.ownersService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOwnerDto: UpdateOwnerDto) {
    return this.ownersService.update(id, updateOwnerDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ownersService.remove(id);
  }
}
