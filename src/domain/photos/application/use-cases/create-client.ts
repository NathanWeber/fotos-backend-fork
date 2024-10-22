import { left, right, Either } from '@/core/either'
import { Client } from '../../enterprise/entities/client'
import { ClientAlreadyExistsError } from '../errors/client-already-exists'
import { ClientRepository } from '../repositories/client-repository'
import { EntityID } from '@/core/entities/entity-id'

interface CreateClientUseCaseRequest {
  photographerId: string
  name: string
  email: string
  phoneNumber: string
}

type CreateClientUseCaseResponse = Either<
  ClientAlreadyExistsError,
  {
    client: Client
  }
>

export class CreateClientUseCase {
  constructor(private clientRepository: ClientRepository) {}

  async execute({
    photographerId,
    name,
    email,
    phoneNumber,
  }: CreateClientUseCaseRequest): Promise<CreateClientUseCaseResponse> {
    const clientWithSameEmail =
      await this.clientRepository.findByPhotographerIdAndEmail(
        photographerId,
        email
      )

    if (clientWithSameEmail) {
      return left(new ClientAlreadyExistsError())
    }

    const client = Client.create({
      photographerId: new EntityID(photographerId),
      name,
      email,
      phoneNumber,
    })

    await this.clientRepository.create(client)

    return right({ client })
  }
}
