import { Context, Next } from "koa";
import { BaseError } from "./error";

async function errorController (ctx: Context, next: Next) {
  try {
    await next();
  } catch(error) {
    const err = error as BaseError;
    ctx.status = err.status || 500;
    ctx.body = {
      type: err.type,
      message: err.message,
      ...err.payload 
    }
  }
}

export default errorController;