const credentials = (req, res, next) => {
    if (req.headers.origin === process.env.FRONTEND_URL) {
        res.header('Access-Control-Allow-Credentials', true);
        // res.header(
        //     'Access-Control-Allow-Headers',
        //     'Origin, X-Requested-With, Content-Type, Accept'
        // );
    }
    next();
};

module.exports = credentials;
