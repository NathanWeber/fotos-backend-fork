import { Entity } from '@/core/entities/entity'
import { EntityID } from '@/core/entities/entity-id'
import { Optional } from '@/core/types/optional'

export interface PhotographerProps {
  name: string
  email: string
  password: string
  createdAt: Date
  updatedAt?: Date
  inactivatedAt?: Date
}

export class Photographer extends Entity<PhotographerProps> {
  get name(): string {
    return this.props.name
  }

  get email(): string {
    return this.props.email
  }

  get password() {
    return this.props.password
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

  static create(
    props: Optional<PhotographerProps, 'createdAt'>,
    id?: EntityID
  ) {
    const photographer: Photographer = new Photographer(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id
    )

    return photographer
  }
}
