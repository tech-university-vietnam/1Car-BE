import { DataSource } from 'typeorm';

export const connectionSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'admin',
  database: 'migration',
  logging: false,
  synchronize: false,
  name: 'default',
  entities: ['dist/**/**.entity{.ts,.js}'],
  migrations: ['dist/migrations/*.{ts,js}'],
  subscribers: [],
});
