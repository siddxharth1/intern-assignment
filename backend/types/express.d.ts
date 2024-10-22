import * as express from "express";

declare namespace Express {
  export interface Request {
    user?: {
      _id: string;
      name: string;
      email: string;
    };
  }
}
