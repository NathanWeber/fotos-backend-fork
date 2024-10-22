import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
} from '@nestjs/common'
import { z } from 'zod'
import { Public } from '@/infra/auth/public'
import { NestRegisterPhotographerUseCase } from '@/infra/nest/use-cases/register-photographer'
import { PhotographerAlreadyExistsError } from '@/domain/photos/application/errors/photographer-already-exists'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

const registerPhotographerBodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
})

const bodyValidationPipe = new ZodValidationPipe(registerPhotographerBodySchema)

type RegisterPhotographerBodySchema = z.infer<
  typeof registerPhotographerBodySchema
>

@Controller('/register')
@Public()
export class RegisterPhotographerController {
  constructor(private sut: NestRegisterPhotographerUseCase) {}

  @Post()
  @HttpCode(201)
  async handle(@Body(bodyValidationPipe) body: RegisterPhotographerBodySchema) {
    const { name, email, password } = body

    const result = await this.sut.execute({
      name,
      email,
      password,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case PhotographerAlreadyExistsError:
          throw new ConflictException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
