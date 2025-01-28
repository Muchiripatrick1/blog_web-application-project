class HttpError extends Error {
    constructor (message? : string){
        super(message);
        this.name = this.constructor.name;
    }
}


/**
 * statusCode: 400
 */
export class BadRequestError extends HttpError { }


/**
 * statusCode: 401. The user is not logged in
 */
export class UnAuthorizedError extends HttpError { }


/**
 * statusCode: 404
 */
export class NotFoundError extends HttpError { }


/**
 * statusCode: 409. for example using username already taken
 */
export class ConflictError extends HttpError { }


/**
 * statusCode: 429
 */
export class TooManyRequestsError extends HttpError { }