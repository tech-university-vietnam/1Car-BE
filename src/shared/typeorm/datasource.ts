import { DataSource } from 'typeorm';

export const connectionSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'admin',
  database: 'migration',
  logging: false,
  synchronize: true,
  name: 'default',
  entities: ['dist/src/**/**.entity{.ts,.js}'],
  migrations: ['dist/src/migrations/*.{ts,js}'],
  subscribers: [],
});
