const credentials = (req, res, next) => {
    if (req.headers.origin === process.env.FRONTEND_URL) {
        res.header('Access-Control-Allow-Credentials', true);
        res.header('Access-Control-Allow-Origin', process.env.FRONTEND_URL);
    }
    next();
};

module.exports = credentials;
