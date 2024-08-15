import mongoose from 'mongoose';

export interface ConnectOptions {
  scheme: 'mongodb' | 'mongodb+srv';
  endpoint: string;
  databaseName?: string;
  username?: string;
  password?: string;
}

function connect (options: ConnectOptions) {
  return mongoose.connect(`${options.endpoint}`, {
    dbName: options.databaseName,
    authSource: 'admin',
    auth: {
      username: options.username,
      password: options.password,
    },
  });
}

export default connect;