import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePetDto } from './dto/create-pet.dto';
import { UpdatePetDto } from './dto/update-pet.dto';

@Injectable()
export class PetsService {
  constructor(private prisma: PrismaService) {}

  async create(createPetDto: CreatePetDto) {
    const ownerExists = await this.prisma.owner.findUnique({
      where: { id: createPetDto.ownerId },
    });

    if (!ownerExists) {
      throw new NotFoundException(
        `Owner with ID ${createPetDto.ownerId} not found`,
      );
    }

    return this.prisma.pet.create({
      data: {
        ...createPetDto,
        dateOfBirth: new Date(createPetDto.dateOfBirth),
      },
      include: {
        owner: true,
      },
    });
  }

  async findAll() {
    return this.prisma.pet.findMany({
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            telefone: true,
          },
        },
      },
    });
  }
  async findOne(id: string) {
    const pet = await this.prisma.pet.findUnique({
      where: { id },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            telefone: true,
          },
        },
      },
    });

    if (!pet) {
      throw new NotFoundException(`Pet with ID ${id} not found`);
    }

    return pet;
  }

  async findByOwner(ownerId: string) {
    return this.prisma.pet.findMany({
      where: { ownerId },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            telefone: true,
          },
        },
      },
    });
  }

  async update(id: string, updatePetDto: UpdatePetDto) {
    await this.findOne(id);

    if (updatePetDto.ownerId) {
      const ownerExists = await this.prisma.owner.findUnique({
        where: { id: updatePetDto.ownerId },
      });

      if (!ownerExists) {
        throw new NotFoundException(
          `Owner with ID ${updatePetDto.ownerId} not found`,
        );
      }
    }

    const data: any = { ...updatePetDto };

    if (updatePetDto.dateOfBirth) {
      data.dateOfBirth = new Date(updatePetDto.dateOfBirth);
    }

    return this.prisma.pet.update({
      where: { id },
      data,
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            telefone: true,
          },
        },
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.pet.delete({
      where: { id },
    });
  }
}
