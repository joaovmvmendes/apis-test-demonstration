import { Client } from "pg";

export async function connect(dbConnectionConfig) {
  console.log(dbConnectionConfig);
  const client = new Client(dbConnectionConfig);
  await client.connect();
  return client;
}
