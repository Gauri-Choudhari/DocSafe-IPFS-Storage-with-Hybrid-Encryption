import React, { useState, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
// import { MdAccountCircle } from "react-icons/md";
// import { IoLogIn } from "react-icons/io5";
import "../styles/style.css";
import metaimg from "../assets/images/MetaMask_Fox.svg.png";
import fileimg from "../assets/images/file.png";
import { UserContext } from '../contexts/UserContext';
// import "../styles/common.css";


function Navbar() {

  let location = useLocation();
  const { userRole } = useContext(UserContext);

  return (

    <nav className="nav">
  

        <a href="/" className="navlogo">DocSafe</a>
          <ul className="navbarlist">

            <li className="navbar-item">
            <Link to="/" style={{ color: 'inherit', textDecoration: 'inherit'}}>Home</Link>
            </li>

            {/* <li className="navbar-item">
            <Link to="/profile" style={{ color: 'inherit', textDecoration: 'inherit'}}>Profile</Link>
            </li> */}

            <li className="navbar-item">
            <Link to="/fileupload" style={{ color: 'inherit', textDecoration: 'inherit'}}>
              Upload</Link>
            </li>

            <li className="navbar-item">
            <Link to="/myfiles" style={{ color: 'inherit', textDecoration: 'inherit'}}>
              My Docs</Link>
            </li>

            <li className="navbar-item">
            <Link to="/sharedfiles" style={{ color: 'inherit', textDecoration: 'inherit'}}>
              Shared Docs</Link>
            </li>

            <li className="navbar-item">
            <Link to={userRole=="Student"?"student/profile":
            userRole=="Faculty"?"faculty/profile":
            "roles"} style={{ color: 'inherit', textDecoration: 'inherit'}}>
              Profile</Link>
            </li>

            {/* <li className="navbar-item">
            <Link to="/myfiles" style={{ color: 'inherit', textDecoration: 'inherit'}}>MyFiles</Link>
            </li> */}

            {/* <li className="navbar-item">
              <a href="/about" className="navbar-link" data-nav-link>About Us </a>
            </li> */}

        

       
          </ul>
          <div className="metamasknav">
          <Link to="/metamaskauth" style={{ color: 'inherit', textDecoration: 'inherit'}}>
            <button className="metabutton"><p>Metamask</p>
            <img src={metaimg} ></img>
            </button>
          </Link>
          </div>
       


  
    </nav>
  )

}

export default Navbar;