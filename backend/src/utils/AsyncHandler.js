const asyncHandler = (func) => {
    return (req, res, next) => {
        Promise
        .resolve(func(req, res, next))
        .catch((error) => next(error))
    }
}

export { asyncHandler }

/*
1. use async handler only where the function is async (req, res, next) type. for ex: middlewares and controllers. 
2. asyncHandler is specifically designed for Express Route Handlers not for database or server issues.
3. all the 'throw error', 'throw new ApiError()', etc are handled by asyncHandlder.
*/