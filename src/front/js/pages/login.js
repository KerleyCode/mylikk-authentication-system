import React, { useState, useContext } from 'react';
import { useNavigate, Link } from "react-router-dom"
import { Context } from '../store/appContext';

export const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const { store, actions } = useContext(Context);

    const handleClick = async () => {
        const response = await actions.login(email, password);
        if (response.access_token) {
            navigate("/private");
        } else {
            console.error('Login error:', response.error);
        }
    }

    return (
        <div className="login-page">
            {store.token ? (   
                <>
                    <h1>You are logged in</h1>
                    <Link to='/private'>
                        <button>Go to your invoices</button>
                    </Link>
                </>
            ) : (
                <>
                    <h1>Log In</h1>
                    {store.loginMessage && <div>{store.loginMessage}</div>}

                    <div>
                        <input
                            type ="email"
                            placeholder="Enter email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                        />
                        <input
                            type ="password"
                            placeholder="Enter password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <button onClick={handleClick}>Log in</button>
                    </div>
                </>
            )}
        </div>
    );
}
