/* eslint-disable react/jsx-one-expression-per-line */
import { React, useContext } from 'react';
import UserRegLogin from './components/UserRegLogin';
import TodosList from './components/TodosList';
import AuthContext from './context/AuthProvider';

function App() {
    const { auth } = useContext(AuthContext);
    return (
        <>
            <h1>Todo list</h1>
            {auth?.userId ? <TodosList /> : <UserRegLogin />};
        </>
    );
}

export default App;
