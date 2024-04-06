
export function localVariables(req, res, next) {
    res.app.locals = {
        resetSession: false,
        CODE: null
    };
    next();
}