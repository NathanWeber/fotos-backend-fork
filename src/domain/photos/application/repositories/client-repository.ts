import { AbstractRepository } from '@/core/repositories/abstract-repository'
import { Client } from '../../enterprise/entities/client'

export abstract class ClientRepository extends AbstractRepository<Client> {
  abstract findByPhotographerIdAndEmail(
    photographerId: string,
    email: string
  ): Promise<Client | null>
}
