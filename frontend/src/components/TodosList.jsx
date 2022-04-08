/* eslint-disable indent */
/* eslint-disable operator-linebreak */
// eslint-disable-next-line object-curly-newline
import { React, useContext, useEffect, useRef, useState } from 'react';
import axios from 'axios';
import './TodosList.css';
import { faCheck, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthProvider';

function TodosList() {
    const baseUrl =
        process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';

    const { auth, setAuth, userName } = useContext(AuthContext);
    const navigate = useNavigate();

    const todoRef = useRef();
    // const errorRef = useRef();

    const [todos, setTodos] = useState([]);
    const [todo, setTodo] = useState('');
    const [refresh, setRefresh] = useState({
        done: false,
        method: '',
        todoId: '',
    });
    // const [errorMessage, setErrorMessage] = useState('');

    const redirectToLogin = () => {
        navigate('/');
    };

    const refreshToken = async () => {
        try {
            const response = await axios.get(`${baseUrl}/user/refreshToken`, {
                withCredentials: true,
            });
            const accessToken = response?.data?.accessToken;
            const userId = response?.data?.userId;
            setAuth({ userId, accessToken });
        } catch (error) {
            if (error.response.status === 401) {
                setAuth(null);
                redirectToLogin();
            } else {
                console.log(error);
            }
        }
    };

    const readTodos = async () => {
        try {
            const response = await axios.get(
                `${baseUrl}/todos/read/${auth.userId}`,
                {
                    withCredentials: true,
                    headers: {
                        authorization: `Bearer ${auth?.accessToken}`,
                    },
                }
            );
            setTodos(response.data.todos);
            todoRef.current.focus();
        } catch (error) {
            if (error.response.status === 403) {
                refreshToken();
                setRefresh({ done: true, method: 'readTodos', todoId: '' });
            } else {
                console.log(error);
            }
        }
    };

    const addTodo = async (e) => {
        if (e.key === 'Enter' && todo !== '') {
            try {
                await axios.post(
                    `${baseUrl}/todos/create`,
                    JSON.stringify({
                        description: todo,
                        userId: auth?.userId,
                    }),
                    {
                        withCredentials: true,
                        headers: {
                            'Content-Type': 'application/json',
                            authorization: `Bearer ${auth?.accessToken}`,
                        },
                    }
                );
                readTodos();
                setTodo('');
            } catch (error) {
                if (error.response.status === 403) {
                    refreshToken();
                    setRefresh({ done: true, method: 'addTodo', todoId: '' });
                } else {
                    console.log(error);
                }
            }
        }
    };

    const updateTodo = async (id) => {
        try {
            await axios.put(
                `${baseUrl}/todos/update/${id}`,
                {},
                {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json',
                        authorization: `Bearer ${auth?.accessToken}`,
                    },
                }
            );
            readTodos();
        } catch (error) {
            if (error.response.status === 403) {
                refreshToken();
                setRefresh({ done: true, method: 'updateTodo', todoId: id });
            } else {
                console.log(error);
            }
        }
    };

    const removeTodo = async (id) => {
        try {
            await axios.delete(`${baseUrl}/todos/delete/${id}`, {
                withCredentials: true,
                headers: {
                    authorization: `Bearer ${auth?.accessToken}`,
                },
            });
            readTodos();
        } catch (error) {
            if (error.response.status === 403) {
                refreshToken();
                setRefresh({ done: true, method: 'removeTodo', todoId: id });
            } else {
                console.log(error);
            }
        }
    };

    const logout = async () => {
        try {
            await axios.get(`${baseUrl}/user/logout/${auth.userId}`, {
                withCredentials: true,
            });
            setAuth({});
            redirectToLogin();
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        readTodos();
    }, []);

    useEffect(() => {
        if (refresh.done) {
            switch (refresh.method) {
                case 'addTodo':
                    addTodo();
                    break;
                case 'readTodo':
                    readTodos();
                    break;
                case 'updateTodo':
                    updateTodo(refresh.todoId);
                    break;
                case 'removeTodo':
                    removeTodo(refresh.todoId);
                    break;
                default:
                    break;
            }
            setRefresh({ done: false, method: '', todoId: '' });
        }
    }, [refresh]);

    // useEffect(() => {
    //     const validTodoRegex = /^\w+$/;
    //     if (!validTodoRegex.test(todo)) {
    //         setErrorMessage('Usa sólo caracteres alfanuméricos');
    //     } else {
    //         setErrorMessage('');
    //     }
    // }, [todo]);

    return (
        <section className="px-5">
            <div className="box">
                {/* <p
                    ref={errorRef}
                    className={errorMessage ? 'errorMessage' : 'hidden'}
                    aria-live="assertive"
                >
                    {errorMessage}
                </p> */}
                <div className="d-flex justify-content-end mb-3">
                    <button
                        className="btn btn-secondary "
                        onClick={() => logout()}
                    >
                        Salir
                    </button>
                </div>
                <h2 className="fs-3 mb-3">
                    {`Lista de tareas de ${userName}`}
                </h2>
                <ul data-testid="todoList">
                    {todos.map((todoItem) => (
                        <li
                            className="mb-3 d-flex justify-content-end"
                            key={todoItem._id}
                        >
                            <span className="flex-grow-1">
                                <span
                                    className={
                                        todoItem.completed ? 'crossed' : null
                                    }
                                >
                                    {todoItem.description}
                                </span>
                            </span>
                            {!todoItem.completed ? (
                                <button
                                    onClick={() => updateTodo(todoItem._id)}
                                    className="btn btn-sm"
                                    style={{
                                        color: 'green',
                                    }}
                                >
                                    <FontAwesomeIcon icon={faCheck} />
                                </button>
                            ) : (
                                <button
                                    onClick={() => removeTodo(todoItem._id)}
                                    className="btn  btn-sm"
                                >
                                    <FontAwesomeIcon
                                        icon={faTrash}
                                        style={{ color: 'darkred' }}
                                    />
                                </button>
                            )}
                        </li>
                    ))}
                </ul>
                <input
                    type="text"
                    className="form-control mb-3"
                    data-testid="todoInput"
                    placeholder="Agregar tarea"
                    ref={todoRef}
                    value={todo}
                    onChange={(e) => setTodo(e.target.value)}
                    onKeyDown={(e) => {
                        addTodo(e);
                    }}
                />
                {/* <button className="btn btn-secondary" onClick={() => addTodo()}>
                        Agregar
                    </button> */}
            </div>
        </section>
    );
}
export default TodosList;
