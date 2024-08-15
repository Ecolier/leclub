export interface IError<PayloadType = any> {
  readonly status: number;
  readonly payload?: PayloadType;
  readonly type: string;
}

export abstract class BaseError<PayloadType = any> extends Error implements IError<PayloadType> {
  constructor(public readonly status: number, public readonly type: string, message: string, public readonly payload?: PayloadType) {
    super(message);
  }
}