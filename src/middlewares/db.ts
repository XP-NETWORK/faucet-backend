import { MikroORM, RequestContext } from '@mikro-orm/core';
import { NextFunction, Request, Response } from 'express';

export function requestDbCtx(
    orm: MikroORM,
    _req: Request,
    _res: Response,
    next: NextFunction
) {
    RequestContext.create(orm.em, next);
}
