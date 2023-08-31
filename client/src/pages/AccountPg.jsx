import React, { useState, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
// import { MdAccountCircle } from "react-icons/md";
// import { IoLogIn } from "react-icons/io5";
import "../styles/style.css";
import "../styles/uploadstyle.css";
// import "../styles/common.css";


const Profile=()=>
{

return(

    <body className="Main">
      <h1 className="Title">Profile</h1>
        <div className="container">

        <form className="form">
		<ul>
			<li>
				<label for="studentID">Student ID:</label>
				<input type="text" id="studentID" name="studentID"/>
			</li>
			<li>
				<label for="name">Name:</label>
				<input type="text" id="name" name="name"/>
			</li>
			<li>
				<label for="email">Email:</label>
				<input type="email" id="email" name="email"/>
			</li>
			<li>
				<label for="phone">Phone:</label>
				<input type="tel" id="phone" name="phone"/>
			</li>
            <li>
				<label for="class">Class:</label>
				<input type="text" id="class" name="class"/>
			</li>
			<li>
				<label for="rollNo">Roll Number:</label>
				<input type="text" id="rollNo" name="rollNo"/>
			</li>
		</ul>
		<input type="submit" class="uploadfilebutton" value="Submit"/>


                </form>

            </div>
        </body>
 
  )
        
}
export default Profile;