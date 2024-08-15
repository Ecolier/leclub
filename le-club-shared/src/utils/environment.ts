import { debug } from '../debug';

export class EnvironmentNotFound extends Error {
  constructor(key: string) {
    super(`Environment variable ${key} not set with no default value.`)
  }
}

export const getEnvironment = (key: string, defaultValue?: any) => { 
  const value = process.env[key];
  if (value) return value;
  else if (defaultValue) {
    process.env[key] = defaultValue;
    debug(`Environment variable ${key} not set, defaulting to ${defaultValue}`);
    return defaultValue;
  }
  else {
    throw new EnvironmentNotFound(key);
  }
}