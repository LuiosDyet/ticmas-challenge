import { useRef, useEffect, useState, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthProvider';
import { Link } from 'react-router-dom';

const baseUrl = 'http://localhost:3001';

const Login = () => {
    const { setAuth, setUserName } = useContext(AuthContext);

    const userRef = useRef();
    const passwordRef = useRef();
    const errorRef = useRef();

    const [user, setUser] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        userRef.current.focus();
    }, []);

    useEffect(() => {
        setErrorMessage('');
    }, [user, password]);

    const submit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(
                `${baseUrl}/user/login`,
                JSON.stringify({
                    username: user,
                    password,
                }),
                {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
            const accessToken = response?.data?.accessToken;
            const userId = response?.data?.userId;
            setAuth({ userId, accessToken });
            setUserName(user);
            setUser('');
            setPassword('');
        } catch (error) {
            setErrorMessage('Usuario o contraseña invalidas');
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
                <h2 className="fs-3 mb-3">Ingresá</h2>
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
                        />
                        <label htmlFor="username">nombre de usuario</label>
                    </div>
                    <div className="form-floating mb-3">
                        <input
                            type="password"
                            id="password"
                            data-testid="password"
                            className="form-control"
                            placeholder="Contraseña"
                            ref={passwordRef}
                            value={password}
                            onChange={() =>
                                setPassword(passwordRef.current.value)
                            }
                        />
                        <label htmlFor="password">contraseña</label>
                    </div>
                    <div className="d-flex justify-content-end mb-3">
                        <button
                            className="btn btn-secondary "
                            data-testid="button"
                            disabled={!user || !password}
                        >
                            Iniciar sesión
                        </button>
                    </div>
                    <p>
                        ¿No tenés cuenta? <Link to="/register">Registrate</Link>
                    </p>
                </form>
            </div>
        </section>
    );
};

export default Login;
