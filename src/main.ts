import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as session from 'express-session';
import { MongoDBStore } from 'connect-mongodb-session';
import { join } from 'path';
import * as hbs from 'hbs';
import * as hbsUtils from 'hbs-utils';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const configService = app.get(ConfigService);
  const port = configService.get<number>('http.port') || 3000;
  const store = new MongoDBStore({
    uri: configService.get<string>('db.mongodb.uri'),
    collection: configService.get<string>('session.store.collection'),
  });
  store.on('error', function (error) {
    console.log(error);
  });

  app.use(
    session({
      secret: configService.get<string>('session.secret'),
      resave: configService.get<boolean>('session.resave'),
      saveUninitialized: configService.get<boolean>(
        'session.saveUninitialized',
      ),
      cookie: { maxAge: configService.get<number>('session.cookie.maxAge') },
      store: store,
    }),
  );
  app.use(function (req, res, next) {
    res.locals.session = req.session;
    next();
  });
  const options = new DocumentBuilder()
    .setTitle('Api v1')
    .setDescription('The boilerplate API for nestjs devs')
    .setVersion('1.0')
    .addBearerAuth({ in: 'header', type: 'http' })
    .build();
  const document = SwaggerModule.createDocument(app, options);
  console.log(join(__dirname, '..', 'public'));
  app.enableCors();
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', '/public/views'));
  hbs.registerPartials(join(__dirname, '..', '/public/views/layouts/'));
  hbsUtils(hbs).registerWatchedPartials(
    join(__dirname, '..', '/public/views/layouts'),
  );
  app.setViewEngine('hbs');

  SwaggerModule.setup('api', app, document);

  await app.listen(port, async () => {
    console.log(
      `The server is running on ${port} port: http://localhost:${port}/api`,
    );
  });
}
bootstrap();
