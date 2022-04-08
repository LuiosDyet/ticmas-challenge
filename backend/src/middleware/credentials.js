const credentials = (req, res, next) => {
    if (
        req.headers.origin === process.env.CLIENT_ORIGIN
        || req.headers.origin === 'http://localhost:3000'
    ) {
        res.header('Access-Control-Allow-Credentials', true);
        res.header('Access-Control-Allow-Origin', [
            process.env.CLIENT_ORIGIN,
            'http://localhost:3000',
        ]);
    }
    next();
};

module.exports = credentials;
