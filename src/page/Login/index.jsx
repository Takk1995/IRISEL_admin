import React, { useState } from 'react';
import axios from 'axios';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Message } from 'primereact/message';
import { useNavigate } from 'react-router-dom';
import './Login.css'


const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate()

    const test = {username: 'test123', password: '1234'}

    const handleLogin = async() => {
        if (username === '' && password === '') {
            setError('請輸入帳號密碼');
        } else if (username === '') {
            setError('請輸入帳號')
        } else if (password === '') {
            setError('請輸入密碼')
        } else {
            // try{
            //     const response = await axios.post('http://localhost:5173/', {
            //         username,
            //         password
            //     })

            //     navigate('/admin')

            // } catch (error) {
            //     if (error.response) {
            //         setError(error.response.data.message || '登入失敗')
            //     } else {
            //         setError('連線錯誤，請稍後再試');
            //     }
            // }

            if (username === test.username && password === test.password) {
                navigate('/admin')
            } else {
                setError('帳號或密碼錯誤')
            }
        }
        setTimeout(() => setError(''), 3000);
    };
    return (
        <div>
            <div className="flex justify-content-center align-items-center" style={{ flexGrow: 1 }}>
                <img src="/Img/logo.png" alt="Logo" style={{ height: '60px', objectFit: 'contain' }} />
            </div>
            <div className='flex justify-content-center align-items-center' style={{ minHeight: '70vh' }}>
                <div className="login-container">
                    <Card title="後台" className='loginCard' style={{ width: '300px'}}>
                        <div style={{height:'40px'}}>
                            {error && <Message severity="error" text={error} />}
                        </div>
                        <InputText
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="帳號"
                            style={{ margin: '10px 0px'}}
                        />
                        <Password
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="密碼"
                            feedback={false}
                            style={{ margin: '10px 0px' }}
                        />
                        <div style={{ textAlign: 'center' }}>
                            <Button label="登入" onClick={handleLogin} style={{margin: '10px 0px'}} />
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    )
}

export default Login