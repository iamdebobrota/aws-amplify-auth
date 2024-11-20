import "reflect-metadata";
import app from "./app";
import { AppDataSource } from "./config/data-source";
import env from "./config/environment.config";

AppDataSource.initialize()
  .then(() => {
    console.log("Data Source has been initialized!");
    app.listen(env.app.port, () => {
      console.log(`Server is running on port: ${env.app.port}...`);
    });
  })
  .catch((err) => {
    console.error(err);
    console.error(
      "Error during Data Source initialization:",
      (err as Error)?.message
    );
    process.exit(1);
  });
