import { Injectable } from '@nestjs/common'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { ClientRepository } from '@/domain/photos/application/repositories/client-repository'
import { Client } from '@/domain/photos/enterprise/entities/client'
import { PrismaService } from '../prisma.service'
import { PrismaClientMapper } from '../mappers/prisma-client-mapper'

@Injectable()
export class PrismaClientRepository implements ClientRepository {
  constructor(private prisma: PrismaService) {}

  async findByPhotographerIdAndEmail(
    photographerId: string,
    email: string
  ): Promise<Client | null> {
    const client = await this.prisma.client.findFirst({
      where: {
        email,
        photographerId,
      },
    })

    if (!client) {
      return null
    }

    return PrismaClientMapper.toDomain(client)
  }

  async findById(id: string): Promise<Client> {
    const client = await this.prisma.client.findUnique({
      where: {
        id,
      },
    })

    if (!client) {
      return null
    }

    return PrismaClientMapper.toDomain(client)
  }

  async findMany({ page }: PaginationParams): Promise<Client[]> {
    const questionComments = await this.prisma.client.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      take: 20,
      skip: (page - 1) * 20,
    })

    return questionComments.map(PrismaClientMapper.toDomain)
  }

  async create(client: Client): Promise<void> {
    const data = PrismaClientMapper.toPrisma(client)

    await this.prisma.client.create({
      data,
    })
  }

  async save(item: Client): Promise<void> {
    const data = PrismaClientMapper.toPrisma(item)

    await this.prisma.client.update({
      where: {
        id: item.id.toString(),
      },
      data,
    })
  }
  async delete(item: Client): Promise<void> {
    await this.prisma.client.delete({
      where: {
        id: item.id.toString(),
      },
    })
  }
}
