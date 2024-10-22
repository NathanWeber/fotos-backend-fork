import { left, right, Either } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { PhotographerRepository } from '../repositories/photographer-repository'
import { HashComparer } from '@/core/cryptography/hash-comparer'
import { Encrypter } from '@/core/cryptography/encrypter'
import { WrongCredentialsError } from '../errors/wrong-credentials-error'

interface AuthenticatePhotographerUseCaseRequest {
  email: string
  password: string
}

type AuthenticatePhotographerUseCaseResponse = Either<
  WrongCredentialsError,
  {
    accessToken: string
  }
>

@Injectable()
export class AuthenticatePhotographerUseCase {
  constructor(
    private photographerRepository: PhotographerRepository,
    private hashComparer: HashComparer,
    private encrypter: Encrypter
  ) {}

  async execute({
    email,
    password,
  }: AuthenticatePhotographerUseCaseRequest): Promise<AuthenticatePhotographerUseCaseResponse> {
    const photographer = await this.photographerRepository.findByEmail(email)

    if (!photographer) {
      return left(new WrongCredentialsError())
    }

    const isPasswordValid = await this.hashComparer.compare(
      password,
      photographer.password
    )

    if (!isPasswordValid) {
      return left(new WrongCredentialsError())
    }

    const accessToken = await this.encrypter.encrypt({
      sub: photographer.id.toString(),
    })

    return right({
      accessToken,
    })
  }
}
