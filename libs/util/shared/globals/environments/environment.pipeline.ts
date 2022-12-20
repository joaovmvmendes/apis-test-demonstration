export const environment = {
  production: false,
  baseUrl: `https://api.${process.env.STAGE}.br.demonstration.com.br`,
  legacyUrl: `https://legacy.${process.env.STAGE}.br.demonstration.com.br`,
  dbConnection: {
    user: "postgres",
    host: "host",
    database: "postgres",
    password: "pass",
    port: 5432,
  },
};
