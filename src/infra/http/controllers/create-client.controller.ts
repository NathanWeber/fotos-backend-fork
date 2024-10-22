import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
} from '@nestjs/common'
import { z } from 'zod'
import { NestCreateClientUseCase } from '@/infra/nest/use-cases/create-client'
import { ClientAlreadyExistsError } from '@/domain/photos/application/errors/client-already-exists'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'

const createClientBodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  phoneNumber: z.string(),
})

const bodyValidationPipe = new ZodValidationPipe(createClientBodySchema)

type CreateClientBodySchema = z.infer<typeof createClientBodySchema>

@Controller('/client')
export class CreateClientController {
  constructor(private sut: NestCreateClientUseCase) {}

  @Post()
  @HttpCode(201)
  async handle(
    @Body(bodyValidationPipe) body: CreateClientBodySchema,
    @CurrentUser() user: UserPayload
  ) {
    const { name, email, phoneNumber } = body
    const userId = user.sub

    const result = await this.sut.execute({
      photographerId: userId,
      name,
      email,
      phoneNumber,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case ClientAlreadyExistsError:
          throw new ConflictException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
