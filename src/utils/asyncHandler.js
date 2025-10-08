const asyncHandler = (fn) => async (req, res, next) => {
    try{
        await fn(req, res, next);
    }
    catch (err) {
        // err.code can be a Postgres error code like '42P01' (string).
        // Express expects a numeric HTTP status code. Try common properties
        // (status, statusCode) first, then accept numeric-only err.code.
        // Otherwise default to 500.
        console.error('Unhandled error in asyncHandler:', err);

        let status = 500;

        // Prefer explicit HTTP status properties.
        if (typeof err.status === 'number' && Number.isInteger(err.status)) {
            status = err.status;
        } else if (typeof err.statusCode === 'number' && Number.isInteger(err.statusCode)) {
            status = err.statusCode;
        } else {
            // Map some common Postgres error codes to sensible HTTP statuses.
            const pgCodeToStatus = {
                // unique_violation
                '23505': 409,
                // foreign_key_violation
                '23503': 409,
                // not_null_violation
                '23502': 400,
                // undefined_column
                '42703': 400,
                // invalid_text_representation (e.g., bad UUID)
                '22P02': 400
            };

            if (err.code && pgCodeToStatus[String(err.code)]) {
                status = pgCodeToStatus[String(err.code)];
            } else if (err.code && /^\d+$/.test(String(err.code))) {
                // If err.code is numeric, ensure it's a valid HTTP status (100-999).
                const numeric = parseInt(String(err.code), 10);
                if (numeric >= 100 && numeric < 1000) {
                    status = numeric;
                }
            }
        }

        res.status(status).json({
            success: false,
            message: err.message || 'Internal Server Error'
        });
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