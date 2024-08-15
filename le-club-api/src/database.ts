import mongoose from "mongoose";
import { Logger } from "winston";
import { getEnvironment } from "@leclub/shared";

export const connect = (logger?: Logger) => {

  const endpoint = getEnvironment('LCB_API_DATABASE_ENDPOINT');
  const user = getEnvironment('LCB_API_DATABASE_USERNAME');
  const password = getEnvironment('LCB_API_DATABASE_PASSWORD');
  const name = getEnvironment('LCB_API_DATABASE_NAME');

  return mongoose.connect(`mongodb://${endpoint}`, {
    dbName: name,
    authSource: 'admin',
    auth: {
      username: user,
      password: password,
    },
  });

};