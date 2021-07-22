import { RequestContext } from "@mikro-orm/core";
import { NextFunction, Request, Response } from "express";
import { orm } from '../db/mikro';

export function requestDbCtx(_req: Request, _res: Response, next: NextFunction) {
    RequestContext.create(orm.em, next);
}