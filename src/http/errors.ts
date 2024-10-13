class CustomError extends Error {
    code: string
    statusCode: number
    constructor(code:string, statusCode: number, message?: string){
        super(message)
        this.code = code
        this.statusCode = statusCode
    }
}


export class UnauthorizedError extends CustomError {
    constructor(message:string) {
        super('UNAUTHORIZED', 401, message)
    }
}

export class ForbiddenError extends CustomError {
    constructor(message:string) {
        super('FORBIDDEN', 403, message)
    }
}

export class BadRequestError extends CustomError {
    constructor(message:string) {
        super('BAD_REQUEST', 400, message)
    }
}

export class NotFoundError extends CustomError {
    constructor(message:string) {
        super('NOT_FOUND', 404, message)
    }
}

export class UknownError extends CustomError {
    constructor(message:string = 'Something went wrong!') {
        super('UKNOWN', 500, message)
    }
}