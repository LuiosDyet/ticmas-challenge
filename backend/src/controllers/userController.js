const { Users } = require('../model/data');

const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');

const userController = {
    register: (req, res) => {
        const { username, password } = req.body;
        if (!username || !password)
            return res
                .status(400)
                .json({ message: 'Es necesario un usuario y contraseña' });

        const user = Users.find((user) => user.username === username);
        if (user) {
            res.status(409).json({
                message: 'El usuario ya existe',
            });
        } else {
            const salt = bcrypt.genSaltSync(10);
            const hashPassword = bcrypt.hashSync(password, salt);
            const newUser = {
                id: uuidv4(),
                username,
                password: hashPassword,
            };
            Users.push(newUser);

            const accessToken = jwt.sign(
                { userId: newUser.id },
                process.env.ACCESS_TOKEN_SECRET,
                {
                    expiresIn: '6h',
                }
            );
            const refreshToken = jwt.sign(
                { userId: newUser.id },
                process.env.REFRESH_TOKEN_SECRET,
                {
                    expiresIn: '7d',
                }
            );

            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                SameSite: 'None',
                secure: true,
                maxAge: 60 * 1000 * 60 * 24 * 7,
            });
            res.status(201).json({
                message: `Usuario ${username} creado y autenticado`,
                userId: newUser.id,
                accessToken,
            });
        }
    },
    login: (req, res) => {
        const { username, password } = req.body;
        if (!username || !password)
            return res
                .status(400)
                .json({ message: 'Es necesario un usuario y contraseña' });

        const user = Users.find((user) => user.username === username);
        if (!user) {
            res.status(400).json({
                message: 'El usuario no existe',
            });
        } else {
            const validPassword = bcrypt.compareSync(password, user.password);
            if (!validPassword) {
                res.status(400).json({
                    message: 'La contraseña es incorrecta',
                });
            } else {
                const accessToken = jwt.sign(
                    { userId: user.id },
                    process.env.ACCESS_TOKEN_SECRET,
                    {
                        expiresIn: '6h',
                    }
                );
                const refreshToken = jwt.sign(
                    { userId: user.id },
                    process.env.REFRESH_TOKEN_SECRET,
                    {
                        expiresIn: '7d',
                    }
                );
                res.cookie('refreshToken', refreshToken, {
                    httpOnly: true,
                    SameSite: 'None',
                    secure: true,
                    maxAge: 60 * 1000 * 60 * 24 * 7,
                });
                res.status(200).json({
                    message: 'Usuario autenticado',
                    userId: user.id,
                    accessToken,
                });
            }
        }
    },

    logout: (req, res) => {
        res.clearCookie('refreshToken');
        res.status(200).json({
            message: 'Usuario deslogueado',
        });
    },
    refreshToken: (req, res) => {
        const cookies = req.cookies;
        const refreshToken = cookies.refreshToken;
        if (!refreshToken) {
            return res.sendStatus(401);
        }
        jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET,
            (err, user) => {
                if (err) {
                    return res.sendStatus(403);
                }
                const accessToken = jwt.sign(
                    { userId: user.userId },
                    process.env.ACCESS_TOKEN_SECRET,
                    {
                        expiresIn: '15s',
                    }
                );
                console.log('user', user);
                res.status(200).json({
                    message: 'Token renovado',
                    accessToken,
                });
            }
        );
    },
};

module.exports = userController;
