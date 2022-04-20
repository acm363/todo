import { MongoMemoryServer } from 'mongodb-memory-server';
import { MongooseModule, MongooseModuleOptions } from '@nestjs/mongoose';
import { DynamicModule, Logger } from '@nestjs/common';

const mongoServer: MongoMemoryServer = new MongoMemoryServer();

export async function getInMemoryDatabaseModule(options: MongooseModuleOptions = {}): Promise<DynamicModule> {
  Logger.log('In Memory database started');
  return MongooseModule.forRootAsync({
    useFactory: async () => {
      await mongoServer.start();
      const mongoUri = mongoServer.getUri();
      return {
        uri: mongoUri,
        ...options,
      };
    },
  });
}

export async function shutdownInMemoryDb(): Promise<void> {
  Logger.log('In Memory database shut down');
  await mongoServer.stop();
}
