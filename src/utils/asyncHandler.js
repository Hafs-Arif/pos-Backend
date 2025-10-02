const asyncHandler = (fn) => async (req, res, next) => {
    try{
        await fn(req, res, next);
    }
    catch (err) {
        res.status(err.code || 500).json({
            success: false,
            message: err.message
        })
    }
}

export {asyncHandler};

/** Promise technique
 * const asyncHandler = (reqHandler) => {
 *  (req, res, next) => {
 *      return (resolve(reqHandler).reject(err) = > next(err))
 *  }
 * }
 */