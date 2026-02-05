import 'dotenv/config';
import { DataSource } from 'typeorm';
import { getDataSourceOptions } from './data-source.options';

const AppDataSource = new DataSource({
  ...getDataSourceOptions(),
  migrations: ['src/migrations/**/*.ts'],
  entities: ['src/**/*.entity.ts'],
  migrationsTableName: 'migrations',
});

export default AppDataSource;
