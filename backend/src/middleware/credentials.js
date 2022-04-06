const credentials = (req, res, next) => {
    if (req.headers.origin === process.env.CLIENT_ORIGIN) {
        res.header('Access-Control-Allow-Credentials', true);
        res.header('Access-Control-Allow-Origin', process.env.CLIENT_ORIGIN);
    }
    next();
};

module.exports = credentials;
