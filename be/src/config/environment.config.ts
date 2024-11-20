import "dotenv/config";

export default {
  app: {
    port: Number(process.env.APP_PORT) || 8080,
    appUrl: process.env.APP_URL,
  },
  db: {
    host: process.env.DB_HOST,
    name: process.env.DB_NAME,
  },
};
