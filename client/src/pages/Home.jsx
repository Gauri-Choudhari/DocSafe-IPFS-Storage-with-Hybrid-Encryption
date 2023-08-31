import React, { useState, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
// import { MdAccountCircle } from "react-icons/md";
// import { IoLogIn } from "react-icons/io5";
import "../styles/style.css";
// import "../styles/common.css";


const Home=()=>
{
    return(
       
        <div className="home">
        <h1>Welcome to DocSafe</h1>
        <p>Your Secure Document Vault powered by IPFS</p>
        </div>
       
    )
        
}
export default Home;