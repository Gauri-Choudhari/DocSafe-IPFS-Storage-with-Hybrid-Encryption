import React, { useState , useEffect, useContext, createContext, Children} from 'react';
import { Link, useLocation, useNavigate } from "react-router-dom";
import { UserContext } from '../contexts/UserContext';
import "../styles/style.css";
import "../styles/metamaskstyle.css";
import metaimg from "../assets/images/MetaMask_Fox.svg.png"

const MetaWallet = () => {

    const navigate = useNavigate();
    const location = useLocation();
    const { user, setUser, connectwalletHandler, accountChangedHandler, disconnectWallet } = useContext(UserContext);
   
    return (
        <body className='Main'>
        <div className="metacontainer">
            
           <div>
            <h1 className="MetaTitle">
                Connect to MetaMask
            </h1>
            <br/>
            <button className='metamaskconnect'
                // style={{ background: user ? "green" : "white", 
                //          color: user ? "white" : "green"}}
                onClick={connectwalletHandler}>
                {user ? "Connected" : "Connect"}
            </button>
            <button className='metamaskdisconnect'
                onClick={disconnectWallet}>Disconnect
            </button>
            <div className="displayAccount"><br/>
                <p className="walletAddress">Your Address : {user}</p>
            </div>
            </div>
            <img src={metaimg} className="metaimg"></img>
            



        
        </div>
        </body>
        
    )
}
export default MetaWallet;


 

 
