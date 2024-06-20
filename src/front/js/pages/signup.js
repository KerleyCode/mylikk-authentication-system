import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from "react-router-dom"
import { Context } from '../store/appContext';

export const SignUp = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate() ;
    const {store, action} = useContext(Context);

    const handleClick = async () => {
        try {
       await action.signup(email, password);
            navigate('/login');
        } catch (error) {
            console.error('Signup error:', error);
        }
    }
    

useEffect(() => {
    if (store.toke) {
        navigate("/private");
    }
}, [store.token, navigate]);


    return (
        <div className="signup-page">
            <div>
                <h1>Sign Up</h1>
            </div>
            {store.signupMessage  && <div>{store.signupMessage} 
                </div>}
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
            <button onClick={handleClick}>SignUp</button>
        </div>

       </div>
       
       
    );
}