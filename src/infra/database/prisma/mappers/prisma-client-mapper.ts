import { EntityID } from '@/core/entities/entity-id'
import { Client } from '@/domain/photos/enterprise/entities/client'
import { Client as PrismaClient, Prisma } from '@prisma/client'

export class PrismaClientMapper {
  static toDomain(raw: PrismaClient): Client {
    return Client.create(
      {
        photographerId: new EntityID(raw.photographerId),
        name: raw.name,
        email: raw.email,
        phoneNumber: raw.phoneNumber,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
        inactivatedAt: raw.inactivatedAt,
      },
      new EntityID(raw.id)
    )
  }

  static toPrisma(client: Client): Prisma.ClientUncheckedCreateInput {
    return {
      id: client.id.toString(),
      photographerId: client.photographerId.toString(),
      name: client.name,
      email: client.email,
      phoneNumber: client.phoneNumber,
      createdAt: client.createdAt,
      updatedAt: client.updatedAt,
      inactivatedAt: client.inactivatedAt,
    }
  }
}
