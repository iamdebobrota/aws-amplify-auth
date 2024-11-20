import { DataSourceOptions } from "typeorm";
import environmentConfig from "./environment.config";
console.log(environmentConfig);
export const dbConfig: DataSourceOptions = {
  type: "mongodb",
  url: environmentConfig.db.host,
  database: environmentConfig.db.name,
  useUnifiedTopology: true,
  logging: "all",
  entities: ["src/**/*.entity.ts"],
  synchronize: true,
  migrations: [],
};
