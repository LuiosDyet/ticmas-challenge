/* eslint-disable operator-linebreak */
/* eslint-disable jsx-a11y/label-has-associated-control */
// eslint-disable-next-line object-curly-newline
import { React, useRef, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthProvider';
import './Register.css';

const baseUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';
const validUserRegex = /^[a-zA-Z0-9]{3,20}$/;
const validPasswordRegex = /^[a-zA-Z0-9]{6,20}$/;

function Register() {
    const userRef = useRef();
    const passwordRef = useRef();
    const confirmPasswordRef = useRef();
    const errorRef = useRef();

    const { setAuth, setUserName } = useContext(AuthContext);
    const navigate = useNavigate();

    const [user, setUser] = useState('');
    const [validUser, setValidUser] = useState(false);
    const [userFocused, setUserFocused] = useState(false);

    const [password, setPassword] = useState('');
    const [validPassword, setValidPassword] = useState(false);
    const [passwordFocused, setPasswordFocused] = useState(false);

    const [confirmPassword, setConfirmPassword] = useState('');
    const [validConfirmPassword, setValidConfirmPassword] = useState(false);
    const [confirmPasswordFocused, setConfirmPasswordFocused] = useState(false);

    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        userRef.current.focus();
    }, []);

    useEffect(() => {
        setValidUser(validUserRegex.test(user));
    }, [user]);

    useEffect(() => {
        setValidPassword(validPasswordRegex.test(password));
        setValidConfirmPassword(password === confirmPassword);
    }, [password, confirmPassword]);

    useEffect(() => {
        setErrorMessage('');
    }, [user, password, confirmPassword]);

    const submit = async (e) => {
        e.preventDefault();
        const reVerifyUser = validUserRegex.test(user);
        const reVerifyPassword = validPasswordRegex.test(password);
        if (!reVerifyUser || !reVerifyPassword) {
            setErrorMessage('Usuario o contraseña invalida');
            return;
        }
        try {
            const response = await axios.post(
                `${baseUrl}/user/register`,
                JSON.stringify({
                    username: user,
                    password,
                }),
                {
                    headers: {
                        'Content-Type': 'application/json',
                        withCredentials: true,
                    },
                }
            );
            const accessToken = response?.data?.accessToken;
            const userId = response?.data?.userId;
            setAuth({ userId, accessToken });
            setUserName(user);
            setUser('');
            setPassword('');
            setConfirmPassword('');
            navigate('/');
        } catch (err) {
            if (err.response.status === 409) {
                setErrorMessage('El usuario ya existe');
            } else {
                setErrorMessage('Unknown error');
            }
            errorRef.current.focus();
        }
    };

    return (
        <section className="px-5">
            <div className="box">
                <p
                    ref={errorRef}
                    className={errorMessage ? 'errorMessage' : 'hidden'}
                    aria-live="assertive"
                >
                    {errorMessage}
                </p>
                <h2 className="fs-3 mb-3">Registrate</h2>
                <form onSubmit={submit}>
                    <div className="form-floating mb-3">
                        <input
                            type="text"
                            id="username"
                            data-testid="username"
                            className="form-control"
                            placeholder="Usuario"
                            ref={userRef}
                            value={user}
                            onChange={() => setUser(userRef.current.value)}
                            onFocus={() => setUserFocused(true)}
                            onBlur={() => setUserFocused(false)}
                            aria-invalid={validUser ? 'false' : 'true'}
                            aria-describedby="usernameHints"
                        />
                        <label htmlFor="username">nombre de usuario</label>
                        <p
                            id="usernameHints"
                            data-testid="usernameHints"
                            className={
                                userFocused || !validUser ? 'focused' : 'hidden'
                            }
                        >
                            El nombre de usuario debe tener entre 3 y 20
                            caracteres alfanuméricos.
                        </p>
                    </div>
                    <div className="form-floating mb-3">
                        <input
                            type="password"
                            id="password"
                            data-testid="password"
                            className="form-control"
                            placeholder="contraseña"
                            ref={passwordRef}
                            value={password}
                            /* prettier-ignore */
                            onChange={() => setPassword(passwordRef.current.value)}
                            onFocus={() => setPasswordFocused(true)}
                            onBlur={() => setPasswordFocused(false)}
                            aria-invalid={validPassword ? 'false' : 'true'}
                            aria-describedby="passwordHints"
                        />
                        <label htmlFor="password">contraseña</label>
                        <p
                            id="passwordHints"
                            data-testid="passwordHints"
                            className={
                                passwordFocused || !validPassword
                                    ? 'focused'
                                    : 'hidden'
                            }
                        >
                            La contraseña debe tener entre 6 y 20 caracteres
                            alfanuméricos.
                        </p>
                    </div>
                    <div className="form-floating mb-3">
                        <input
                            type="password"
                            id="confirmPassword"
                            data-testid="confirmPassword"
                            className="form-control"
                            placeholder="confirmar contraseña"
                            ref={confirmPasswordRef}
                            value={confirmPassword}
                            /* prettier-ignore */
                            onChange={() => setConfirmPassword(confirmPasswordRef.current.value)}
                            onFocus={() => setConfirmPasswordFocused(true)}
                            onBlur={() => setConfirmPasswordFocused(false)}
                            aria-invalid={
                                validConfirmPassword ? 'false' : 'true'
                            }
                            aria-describedby="confirmPasswordHints"
                        />
                        <label htmlFor="confirmPassword">
                            confirmar contraseña
                        </label>
                        <p
                            id="confirmPasswordHints"
                            data-testid="confirmPasswordHints"
                            className={
                                confirmPasswordFocused || !validConfirmPassword
                                    ? 'focused'
                                    : 'hidden'
                            }
                        >
                            La contraseña debe coincidir con la anterior.
                        </p>
                    </div>
                    <div className="d-flex justify-content-end mb-3">
                        <button
                            className="btn btn-secondary "
                            data-testid="button"
                            disabled={
                                !validUser ||
                                !validPassword ||
                                !validConfirmPassword
                            }
                        >
                            Registrarse
                        </button>
                    </div>
                </form>
                <p>
                    ¿Ya tienes una cuenta?
                    <Link to="/">Inicia sesión</Link>
                </p>
            </div>
        </section>
    );
}

export default Register;
