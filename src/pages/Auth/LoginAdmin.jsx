import React, { useState } from 'react';
import { login } from '../../Utils/api';
import { useNavigate } from 'react-router-dom';
import './LoginAdmin.css';

const LoginAdmin = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (event) => {
        event.preventDefault();

        try {
            const response = await login(username, password);
            console.log('Login success:', response);
            // navigate('/');
            navigate('/admin/manage-movies');
        } catch (error) {
            console.error('Login error:', error);
            setError('Đăng nhập thất bại. Vui lòng thử lại.');
        }
    };

    return (
        <div className="login-wrapper" id="login-content">
            <div className="login-content">
                <h3>Đăng nhập</h3>
                {error && <p className="error">{error}</p>}

                    <form onSubmit={handleLogin}>
                        <div className="row">
                            <label htmlFor="username">Tên người dùng:</label>
                            <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} />
                        </div>
                        <div className="row">
                            <label htmlFor="password">Mật khẩu:</label>
                            <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                        </div>
                        
                        <div className="row">
                            <button type="submit">Đăng nhập</button>
                        </div>
                    </form>

            </div>
        </div>
    );
}

export default LoginAdmin;



