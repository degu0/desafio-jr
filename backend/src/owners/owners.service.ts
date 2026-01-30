import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateOwnerDto } from './dto/create-owner.dto';
import { UpdateOwnerDto } from './dto/update-owner.dto';

@Injectable()
export class OwnersService {
  constructor(private prisma: PrismaService) {}

  async create(createOwnerDto: CreateOwnerDto) {
    return this.prisma.owner.create({
      data: createOwnerDto,
    });
  }

  async findOne(id: string) {
    const owner = await this.prisma.owner.findUnique({
      where: { id },
      include: {
        pets: true,
      },
    });

    if (!owner) {
      throw new NotFoundException(`Owner with ID ${id} not found`);
    }

    return owner;
  }
  async update(id: string, updateOwnerDto: UpdateOwnerDto) {
    await this.findOne(id);

    return this.prisma.owner.update({
      where: { id },
      data: updateOwnerDto,
      include: {
        pets: true,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.owner.delete({
      where: { id },
    });
  }
}
