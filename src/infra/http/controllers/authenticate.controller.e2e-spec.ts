import { AppModule } from '@/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify'
import { Test } from '@nestjs/testing'
import { hash } from 'bcryptjs'
import { PhotographerFactory } from '@test/factories/make-photographer'

describe('Authenticate (E2E)', () => {
  let app: NestFastifyApplication
  let photographerFactory: PhotographerFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [PhotographerFactory],
    }).compile()

    app = moduleRef.createNestApplication<NestFastifyApplication>(
      new FastifyAdapter()
    )

    photographerFactory = moduleRef.get(PhotographerFactory)

    await app.init()
    await app.getHttpAdapter().getInstance().ready()
  })

  test('[POST] /sessions', async () => {
    await photographerFactory.makePrismaPhotographer({
      email: 'test@example.com',
      password: await hash('12345678', 8),
    })

    const response = await app.inject({
      method: 'POST',
      url: '/sessions',
      payload: {
        email: 'test@example.com',
        password: '12345678',
      },
    })

    expect(response.statusCode).toBe(201)
    expect(JSON.parse(response.body)).toEqual({
      access_token: expect.any(String),
    })
  })
})
