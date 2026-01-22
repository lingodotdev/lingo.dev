module.exports = fn =>{
    return async (req, res, next) => {
        fn(req, res, next).catch(next);
    }
}