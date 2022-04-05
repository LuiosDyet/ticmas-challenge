import axios from 'axios';
import './TodosList.css';
import { faCheck, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useContext, useEffect, useRef, useState } from 'react';
import AuthContext from '../context/AuthProvider';
import { useNavigate } from 'react-router-dom';

function TodosList() {
    const baseUrl = 'http://localhost:3001';

    const { auth, setAuth, userName } = useContext(AuthContext);
    const navigate = useNavigate();

    const todoRef = useRef();

    const [todos, setTodos] = useState([]);
    const [todo, setTodo] = useState('');
    const [refresh, setRefresh] = useState({
        done: false,
        method: '',
        todoId: '',
    });

    useEffect(() => {
        readTodos(); // eslint-disable-next-line react-hooks/exhaustive-deps
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
        } // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [refresh]);

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

    const redirectToLogin = () => {
        navigate('/');
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
            await axios.get(`${baseUrl}/user/logout`, {
                withCredentials: true,
            });
            setAuth({});
            redirectToLogin();
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <section className="px-5">
            <div className="box">
                <div className="d-flex justify-content-end mb-3">
                    <button
                        className="btn btn-secondary "
                        onClick={() => logout()}
                    >
                        Salir
                    </button>
                </div>
                <h2 className="fs-3 mb-3">Lista de tareas de {userName}</h2>
                <ul data-testid="todoList">
                    {todos.map((todo) => (
                        <li
                            className="mb-3 d-flex justify-content-end"
                            key={todo.id}
                        >
                            <span className="flex-grow-1">
                                <span
                                    className={
                                        todo.completed ? 'crossed' : null
                                    }
                                >
                                    {todo.description}
                                </span>
                            </span>
                            {!todo.completed ? (
                                <button
                                    onClick={() => updateTodo(todo.id)}
                                    className="btn btn-sm"
                                    style={{
                                        color: 'green',
                                    }}
                                >
                                    <FontAwesomeIcon icon={faCheck} />
                                </button>
                            ) : (
                                <button
                                    onClick={() => removeTodo(todo.id)}
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
