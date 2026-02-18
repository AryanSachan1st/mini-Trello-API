class ApiError extends Error {
    constructor (
        code,
        message = "Something went wrong, please try after some time",
        data = null,
        stack = "",
        errors = []
    ) {
        super(message)
        this.message = message
        this.code = code,
        this.errors = errors
        this.stack = Error.captureStackTrace(this, this.constructor)
    }
}

export { ApiError }