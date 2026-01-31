import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePetDto } from './dto/create-pet.dto';
import { UpdatePetDto } from './dto/update-pet.dto';

@Injectable()
export class PetsService {
  constructor(private prisma: PrismaService) {}

  async create(createPetDto: CreatePetDto, userId: string) {
    const ownerExists = await this.prisma.owner.findUnique({
      where: { id: createPetDto.ownerId },
    });

    if (!ownerExists) {
      throw new NotFoundException(
        `Owner with ID ${createPetDto.ownerId} not found`,
      );
    }

    const userExists = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!userExists) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    return this.prisma.pet.create({
      data: {
        ...createPetDto,
        dateOfBirth: new Date(createPetDto.dateOfBirth),
        createdById: userId,
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
        createdBy: {
          select: {
            id: true,
            email: true,
            name: true,
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
        createdBy: {
          select: {
            id: true,
            email: true,
            name: true,
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
        createdBy: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    });
  }

  async update(id: string, updatePetDto: UpdatePetDto, userId: string) {
    await this.findOne(id);

    const pet = await this.findOne(id);

    if (userId !== pet.createdById) {
      throw new UnauthorizedException(
        'You can only update pets that you created',
      );
    }

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

    delete data.createdById;

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
        createdBy: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    });
  }

  async remove(id: string, userId: string) {
    await this.findOne(id);

    const pet = await this.findOne(id);

    if (userId !== pet.createdById) {
      throw new UnauthorizedException(
        'You can only update pets that you created',
      );
    }

    return this.prisma.pet.delete({
      where: { id },
    });
  }
}
