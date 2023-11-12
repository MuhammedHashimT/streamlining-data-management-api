import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { ProjectsModule } from './projects/projects.module';
import { OrganizationsModule } from './organizations/organizations.module';
import { OrgUsersModule } from './org-users/org-users.module';
import { ProjectMiddleware } from './projects/projects.middleware';
import { OrganizationMiddleware } from './organizations/organization.middleware';

@Module({
  imports: [
    // env configuration

    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),

  

    // config of JWT

    // PassportModule.register({ defaultStrategy: 'jwt' }),
    // JwtModule.registerAsync({
    //   useFactory: async () => ({
    //     secret: process.env.JWT_SECRET,
    //     signOptions: { expiresIn: '1d' },
    //   }),
    // }),

    // connecting to mysql planetscale server

    TypeOrmModule.forRootAsync(
      // dataSourceOptions
      {
        useFactory: (configService: ConfigService) => ({
          type: 'mysql',
          host: configService.get<string>('DB_HOST'),
          port: configService.get<number>('DB_PORT'),
          username: configService.get<string>('DB_USERNAME'),
          password: configService.get<string>('DB_PASSWORD'),
          database: configService.get<string>('DB_NAME'),
          entities: ['dist/**/entities/*.entity{.ts,.js}'],
          autoLoadEntities: true,
          synchronize: true,
          ssl: { rejectUnauthorized: true },
          // migrationsTableName: 'migrations',
          // migrations: ['dist/src/database/migrations/*.js'],
          // configService.get<string>('MYSQL_ATTR_SSL_CA') ,
          // cli: {
          //   migrationsDir: 'src/database/migrations',
          // },
          // namingStrategy: new SnakeNamingStrategy(),
          // url:configService.get<string>('DATABASE_URL'),
        }),

        inject: [ConfigService],
      },
    ),

    UsersModule,

    ProjectsModule,

    OrganizationsModule,

    OrgUsersModule,

    // graphql configuration
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {

  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ProjectMiddleware)
      .forRoutes({ path: 'projects', method: RequestMethod.PATCH  })
      .apply(ProjectMiddleware)
      .forRoutes({ path: 'projects', method: RequestMethod.DELETE  })
      .apply(ProjectMiddleware)
      .forRoutes({ path: 'projects', method: RequestMethod.POST  })
      .apply(OrganizationMiddleware)
      .forRoutes({ path: 'organizations', method: RequestMethod.PATCH  })
      .apply(OrganizationMiddleware)
      .forRoutes({ path: 'organizations', method: RequestMethod.DELETE  })
      .apply(OrganizationMiddleware)
      .forRoutes({ path: 'organizations', method: RequestMethod.POST  })
  }
}
