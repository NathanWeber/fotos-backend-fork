import { HashComparer } from '@/core/cryptography/hash-comparer'
import { Encrypter } from '@/core/cryptography/encrypter'
import { PhotographerRepository } from '@/domain/photos/application/repositories/photographer-repository'
import { AuthenticatePhotographerUseCase } from '@/domain/photos/application/use-cases/authenticate-photographer'
import { Injectable } from '@nestjs/common'

@Injectable()
export class NestAuthenticateUseCase extends AuthenticatePhotographerUseCase {
  constructor(
    photographerRepository: PhotographerRepository,
    hashComparer: HashComparer,
    encrypter: Encrypter
  ) {
    super(photographerRepository, hashComparer, encrypter)
  }
}
