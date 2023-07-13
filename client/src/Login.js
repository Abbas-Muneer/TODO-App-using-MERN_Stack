import { useState, useContext, useEffect } from "react";
import axios from "axios";
import UserContext from "./UserContext";
import './login.css';

import { useNavigate } from 'react-router-dom';

function Login(){
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const user = useContext(UserContext);
    const [redirect, setRedirect] = useState(false);
    const [loginError, setLoginError] = useState(false);

    function loginUser(e){
        e.preventDefault();

        const data = {email, password};
        axios.post('http://localhost:4000/login', data, {withCredentials:true})
        .then(response => {
            user.setEmail(response.data.email);
            setEmail('');
            setPassword('');
            setLoginError(false);
            setRedirect(true);
        }).catch(() => {
            setLoginError(true);
        })
    }

        const navigate = useNavigate();

      

        useEffect(() => {
            if (redirect) {
            navigate('/');
            }
        }, [navigate, redirect]);

    

   return(
    <form action="" onSubmit={e => loginUser(e)}>
        {loginError && (
            <div className="para">Login Error! Wrong Email or Password, Please try again!!: </div>
        )}
        <input className="llll" type="email" placeholder="email" value={email} onChange={e => setEmail(e.target.value)}/><br />
        <input className="llll" type="password" placeholder="password" value={password} onChange={e => setPassword(e.target.value)}/><br />
        <button type="submit">Login</button><br />

    </form>
   ) 
}

export default Login;