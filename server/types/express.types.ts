import { Request, Response, NextFunction } from 'express';

export interface TypedRequest<T = unknown> extends Request {
  body: T;
}

export interface TypedResponse<T = unknown> extends Response {
  json: (body: T) => this;
}

export type AsyncRequestHandler<T = unknown, R = unknown> = (
  req: TypedRequest<T>,
  res: TypedResponse<R>,
  next: NextFunction
) => Promise<void>;

export type RequestHandler<T = unknown, R = unknown> = (
  req: TypedRequest<T>,
  res: TypedResponse<R>,
  next: NextFunction
) => void;
