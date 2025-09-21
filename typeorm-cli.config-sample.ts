import { DataSource } from 'typeorm';

export default new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'username',
  password: 'password',
  database: 'dbname',
  entities: ['**/*.entity.js'],
  migrations: ['migrations/*.js'],
});
