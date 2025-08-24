import { useContext, useState } from "react"
import { useNavigate } from "react-router-dom";

import "./login.css"
import { AuthContext } from "../../context/AuthContext"
import api from "../../utils/axios"
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
            const res = await api.post("/auth/login", credentials)
            dispatch( { type : "LOGIN_SUCCESS", payload: res.data.data.user})
            navigate("/")
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
