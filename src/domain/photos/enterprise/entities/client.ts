import { Entity } from '@/core/entities/entity'
import { EntityID } from '@/core/entities/entity-id'
import { Optional } from '@/core/types/optional'

interface ClientProps {
  photographerId: EntityID
  name: string
  email: string
  phoneNumber?: string
  createdAt: Date
  updatedAt?: Date
  inactivatedAt?: Date
}

export class Client extends Entity<ClientProps> {
  get photographerId() {
    return this.props.photographerId
  }

  get name(): string {
    return this.props.name
  }

  get email(): string {
    return this.props.email
  }

  get phoneNumber(): string | undefined {
    return this.props.phoneNumber
  }

  get createdAt(): Date {
    return this.props.createdAt
  }

  get updatedAt(): Date | undefined {
    return this.props.updatedAt
  }

  get inactivatedAt(): Date | undefined {
    return this.props.inactivatedAt
  }

  set inactivatedAt(inactivatedAt: Date | undefined) {
    this.props.inactivatedAt = inactivatedAt
    this.touch()
  }

  private touch() {
    this.props.updatedAt = new Date()
  }

  static create(props: Optional<ClientProps, 'createdAt'>, id?: EntityID) {
    const client: Client = new Client(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id
    )

    return client
  }
}
