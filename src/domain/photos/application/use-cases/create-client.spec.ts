import { InMemoryClientRepository } from '@test/domain/photos/repository/in-memory-client-repository'
import { Client } from '../../enterprise/entities/client'
import { CreateClientUseCase } from './create-client'
import { describe, beforeEach, it, expect } from 'vitest'

let inMemoryClientRepository: InMemoryClientRepository<Client>

let sut: CreateClientUseCase

describe('Create client', () => {
  beforeEach(() => {
    inMemoryClientRepository = new InMemoryClientRepository<Client>()

    sut = new CreateClientUseCase(inMemoryClientRepository)
  })

  it('should be able to create a new client', async () => {
    const result = await sut.execute({
      photographerId: '1',
      name: 'John Doe',
      email: 'johndoe@mail.com',
      phoneNumber: '99999999999',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      client: inMemoryClientRepository.items[0],
    })
  })
})
