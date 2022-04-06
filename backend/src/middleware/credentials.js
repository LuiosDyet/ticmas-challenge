const credentials = (req, res, next) => {
    if (req.headers.origin === 'http://localhost:3000') {
        res.header('Access-Control-Allow-Credentials', true);
        // res.header('Access-Control-Allow-Origin', "http://localhost:3000");
        res.header('Access-Control-Allow-Origin', '*');
        res.header(
            'Access-Control-Allow-Methods',
            'OPTIONS, POST, GET, PUT, DELETE'
        );
        res.header('Access-Control-Allow-Headers', '*');
        res.header(
            'Access-Control-Allow-Headers',
            'Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With'
        );
    }
    next();
};

module.exports = credentials;
