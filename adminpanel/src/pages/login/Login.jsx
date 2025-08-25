import { useContext, useState } from "react"
import { useNavigate } from "react-router-dom";

import "./login.scss"
import axios from "../../utils/axios";
import { AuthContext } from "../../context/AuthContext";
const Login = () => {
    const[credentials,setCredentials] = useState({
        username : undefined,
        password : undefined
    })

    const {loading,error,dispatch} = useContext(AuthContext)

    const handleChange = (e) => {
        setCredentials(prev => ({...prev,[e.target.id] : e.target.value}))
    }
    const handleClick = async (e) => {
        e.preventDefault() // it prevents referesh page
        dispatch({ type : "LOGIN_START" })
        try {
                        const res = await axios.post("/api/auth/login", credentials)
                        console.log(res.data.data.user);
                        // set Authorization header as fallback for subsequent requests
                        if (res.data?.data?.accessToken) {
                            axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.data.accessToken}`;
                        }
                        if(res.data.data.user.isAdmin){
                            dispatch( { type : "LOGIN_SUCCESS", payload: res.data.data.user})
                            navigate("/")
                        }
            else{
              dispatch({type : "LOGIN_FAILURE", message: "You are not allowed !"})
            }
            
        } catch (error) {
            dispatch({type : "LOGIN_FAILURE", payload : error.response.data})
        }
    }
    const navigate = useNavigate()
    return (
        <div className="login">
            <div className="lContainer">
                <input type="text" placeholder="username" id="username" onChange={handleChange} className="username"></input>
                <input type="password" placeholder="password" id="password" onChange={handleChange} className="password"></input>
                <button disabled={loading} onClick={handleClick} className="lButton">Login</button>
                {error && <span>{error.message}</span>}
            </div>
        </div>
    )
}

export default Login
