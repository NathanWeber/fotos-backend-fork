import { Module } from '@nestjs/common'

import { DatabaseModule } from '../database/database.module'
import { CryptographyModule } from '../cryptography/cryptography.module'

import { HealthController } from './controllers/health.controller'
import { NestHealthUseCase } from '../nest/use-cases/health'
import { NestRegisterPhotographerUseCase } from '../nest/use-cases/register-photographer'
import { RegisterPhotographerController } from './controllers/register-photographer.controller'
import { NestCreateClientUseCase } from '../nest/use-cases/create-client'
import { CreateClientController } from './controllers/create-client.controller'
import { NestAuthenticateUseCase } from '../nest/use-cases/authenticate'
import { AuthenticateController } from './controllers/authenticate-controller'

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [
    HealthController,
    RegisterPhotographerController,
    CreateClientController,
    AuthenticateController,
  ],
  providers: [
    NestHealthUseCase,
    NestRegisterPhotographerUseCase,
    NestCreateClientUseCase,
    NestAuthenticateUseCase,
  ],
})
export class HttpModule {}
