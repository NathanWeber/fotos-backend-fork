import { AppModule } from '@/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { PhotographerFactory } from '@test/factories/make-photographer'

describe('Create Client (E2E)', () => {
  let app: NestFastifyApplication
  let photographerFactory: PhotographerFactory
  let prisma: PrismaService
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [PhotographerFactory],
    }).compile()

    app = moduleRef.createNestApplication<NestFastifyApplication>(
      new FastifyAdapter()
    )

    prisma = moduleRef.get(PrismaService)
    photographerFactory = moduleRef.get(PhotographerFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
    await app.getHttpAdapter().getInstance().ready()
  })

  test('[POST] /client', async () => {
    const user = await photographerFactory.makePrismaPhotographer()
    const accessToken = jwt.sign({ sub: user.id.toString() })
    const response = await app.inject({
      method: 'POST',
      url: '/client',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${accessToken}`,
      },
      payload: JSON.stringify({
        name: 'John Doe',
        email: 'johndoe@mail.com',
        phoneNumber: '99999999999',
      }),
    })
    console.log(response.body)
    expect(response.statusCode).toBe(201)

    const clientOnDatabase = await prisma.client.findFirst({
      where: {
        email: 'johndoe@mail.com',
        photographerId: user.id.toString(),
      },
    })

    expect(clientOnDatabase).toBeTruthy()
  })
})
