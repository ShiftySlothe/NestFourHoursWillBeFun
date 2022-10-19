import * as mongoose from 'mongoose';

export const databaseProviders = [
  {
    provide: 'DATABASE_CONNECTION',
    useFactory: (): Promise<typeof mongoose> => {
      // __MONGO_URI__ is set during e2e testing
      const mongoUri =
        (global as any).__MONGO_URI__ || 'mongodb://root:root@localhost:27017/';
      return mongoose.connect(mongoUri);
    },
  },
];
