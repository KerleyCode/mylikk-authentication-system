import React, { useEffect, useContext } from 'react';
import { Context } from '../store/appContext';
import { useNavigate } from 'react-router-dom';

export const Private = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();

    useEffect(() => {
        actions.getInvoices();
    }, [actions]);

    const handleLogout = () => {
        actions.logout();
        navigate('/login');
      };

    return (
        <div>
            {

            }
    <button onClick=
    {handleLogout}>Logout</button>
        </div>
       
        
    );
};