import axios from "axios";
import React,{ createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";

export const AuthContext = createContext();
 
export const AuthProvider = ({children}) => {
    const [user, setUser] = useState();
    const [hasUser, sethasUser] = useState(false);
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState(localStorage.getItem("User_id")||0);
    const navigate = useNavigate();
   

    let register=( userEmail, userPassword, userPhone, userName ) => {
        var raw={
            email: userEmail,
            password: userPassword,
            phone: userPhone,
            name: userName
        };
        console.log(raw);

        axios
        .post("http://localhost:8081/signup", raw)
        .then((response) => {
            console.log(response);
         })
        .catch((error) => {
             console.log(error);
         });
    };

    let login = async ( userEmail, userPassword) => {
        var raw={
            email: userEmail,
            password: userPassword,
        };
        console.log(raw);

        axios
        .post("http://localhost:8081/login", raw)
        .then((response) => {
            console.log(response);
            setUser(response.data.user);
            sethasUser(true);
            
            localStorage.setItem("User_id", response.data.user.id);
            navigate("/home");
         })
        .catch((error) => {
             console.log(error);
         });
    };

    let logout = () => {
        setUserId(0);
        sethasUser(false);
        localStorage.removeItem("User_id");
    }
    let getUserById = async ()=>{
        console.log(userId);
        axios
        .get("http://localhost:8081/user/" +userId)
        .then((response) => {
            console.log(response.data);
            setUser(response.data.user);
            sethasUser(true);
               
        })
        .catch((error) => {
            console.log(error);
        })
        .finally(()=>{
            setLoading(false);
        });
    
    };

    useEffect(() => {
            getUserById();
    }, []);

    let contextData = {
        registerUser: register,
        loginUser: login,
        logoutUser: logout,
        hasUser: hasUser,
        user: user
    };

    return( <AuthContext.Provider value={contextData}>
        {loading ? <p>Loading...</p> : children}
        </AuthContext.Provider>
    );

};