class BaseError extends Error {
    constructor(message, name, statusCode) {
        super(message);
        this.name = name;
        this.statusCode = statusCode;
    }
}

class DatabaseConnectionError extends BaseError {
    constructor(message = 'Failed to connect to the database') {
        super(message, 'DatabaseConnectionError', 500);
    }
}

class ValidationError extends BaseError {
    constructor(message = 'Validation failed') {
        super(message, 'ValidationError', 400);
    }
}

class AuthenticationError extends BaseError {
    constructor(message = 'Authentication failed') {
        super(message, 'AuthenticationError', 401);
    }
}

class NotFoundError extends BaseError {
    constructor(resource = 'Resource') {
        super(`${resource} not found`, 'NotFoundError', 404);
    }
}

class DuplicateEntryError extends BaseError {
    constructor(field = 'Entry') {
        super(`${field} already exists`, 'DuplicateEntryError', 409);
    }
}

class UnauthorizedError extends BaseError {
    constructor(message = 'Unauthorized access') {
        super(message, 'UnauthorizedError', 403);
    }
}

class UserExistsError extends BaseError {
    constructor(message = 'User with this email already exists') {
        super(message, 'UserExistsError', 409);
    }
}

module.exports = {
    BaseError,
    DatabaseConnectionError,
    ValidationError,
    AuthenticationError,
    NotFoundError,
    DuplicateEntryError,
    UnauthorizedError,
    UserExistsError
};