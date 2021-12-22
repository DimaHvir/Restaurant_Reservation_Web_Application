const methodNotAllowed = (req, res, next) => {
    next({status: 403, message : "This method is not allowed"});
};
module.exports = methodNotAllowed;


