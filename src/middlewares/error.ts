import { NextFunction, Request, Response } from 'express';
import { HttpError } from '../errors/http';

function errorMiddleware(
    err: HttpError,
    _req: Request,
    res: Response,
    _next: NextFunction
) {
    const code = err.status || 500;

    res.status(code).send({
        status: code,
        message: err.message || 'Internal Server Error',
    });
}

export default errorMiddleware;
