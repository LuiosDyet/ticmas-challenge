const { User } = require('../database/models');

const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');

const userController = {
    register: async (req, res) => {
        const { username, password } = req.body;
        if (!username || !password)
            return res
                .status(400)
                .json({ message: 'Es necesario un usuario y contraseña' });

        const user = await User.findOne({
            where: { username },
            raw: true,
            nest: true,
        });
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

            newUser.refreshToken = refreshToken;

            await User.create(newUser);

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
    login: async (req, res) => {
        console.log('req.body', req.body);
        const { username, password } = req.body;
        if (!username || !password)
            return res
                .status(400)
                .json({ message: 'Es necesario un usuario y contraseña' });

        const user = await User.findOne({
            where: { username },
            raw: true,
            nest: true,
        });
        console.log('user', user);
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
                User.update({ refreshToken }, { where: { id: user.id } });
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

    logout: async (req, res) => {
        res.clearCookie('refreshToken');
        await User.update(
            { refreshToken: null },
            { where: { id: req.params.id } }
        );

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
                res.status(200).json({
                    message: 'Token renovado',
                    accessToken,
                });
            }
        );
    },
};

module.exports = userController;
