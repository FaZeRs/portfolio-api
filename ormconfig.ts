import { DataSource } from 'typeorm';
require('dotenv').config();

const typeOrmConfig = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : null,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  entities: [__dirname + '/src/**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
  migrationsRun: false,
  // Timezone configured on the MySQL server.
  // This is used to typecast server date/time values to JavaScript Date object and vice versa.
  timezone: 'Z',
  synchronize: false,
  debug: process.env.NODE_ENV === 'development' ? true : false,
});

export default typeOrmConfig;
