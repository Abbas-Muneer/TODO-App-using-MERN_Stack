import { useState, useContext, useEffect } from "react";
import axios from "axios";
import UserContext from "./UserContext";
import { useNavigate } from "react-router-dom";


function Register(){
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [redirect, setRedirect] = useState(false);





    const user = useContext(UserContext);

    function registerUser(e){
        e.preventDefault();

        const data = {email, password};
        axios.post('http://localhost:4000/Register', data, {withCredentials:true})
        .then(response => {
            user.setEmail(response.data.email);
            setEmail('');
            setPassword('');
            setRedirect(true);
        });
    }

    const navigate = useNavigate();

      

    useEffect(() => {
        if (redirect) {
        navigate('/');
        }
    }, [navigate, redirect]);

   return(
    <form action="" onSubmit={e => registerUser(e)}>
        <input className="llll" type="email" placeholder="email" value={email} onChange={e => setEmail(e.target.value)}/><br />
        <input className="llll" type="password" placeholder="password" value={password} onChange={e => setPassword(e.target.value)}/><br />
        <button type="submit">Register</button><br />

    </form>
   ) 
}

export default Register;