import { faker } from '@faker-js/faker'

import { EntityID } from '@/core/entities/entity-id'
import {
  Photographer,
  PhotographerProps,
} from '@/domain/photos/enterprise/entities/photographer'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { PrismaPhotographerMapper } from '@/infra/database/prisma/mappers/prisma-photographer-mapper'
import { Injectable } from '@nestjs/common'

export function makePhotographer(
  override: Partial<PhotographerProps> = {},
  id?: EntityID
) {
  const photographer = Photographer.create(
    {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      ...override,
    },
    id
  )

  return photographer
}

@Injectable()
export class PhotographerFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaPhotographer(
    data: Partial<PhotographerProps> = {}
  ): Promise<Photographer> {
    const photographer = makePhotographer(data)

    await this.prisma.photographer.create({
      data: PrismaPhotographerMapper.toPrisma(photographer),
    })

    return photographer
  }
}
