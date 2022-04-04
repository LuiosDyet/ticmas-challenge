import { Route, Routes } from 'react-router-dom';
import Login from './Login';
import Register from './Register';

function UserRegLogin(props) {
    return (
        <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
        </Routes>
    );
}

export default UserRegLogin;
