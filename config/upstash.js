//this part came from upstash docs
import { Client } from "@upstash/workflow";
import { QSTASH_URL, QSTASH_TOKEN } from "./env";

const client = new Client({
  baseUrl: QSTASH_URL,
  token: QSTASH_TOKEN,
});

export default client;
