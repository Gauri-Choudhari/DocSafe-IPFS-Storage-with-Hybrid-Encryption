import React, { useState, useEffect, useContext } from 'react';
import Web3 from 'web3';
import { useNavigate } from 'react-router-dom';
import UserDep from "../contracts/UserDep.json";
import contract from "../contracts/contract-address.json";
import { UserContext } from '../contexts/UserContext';
const web3 = new Web3(window.ethereum);
const usercon = new web3.eth.Contract(UserDep.abi, contract.userdep);


const SelectRole = () => {
  const [selectedRole, setSelectedRole] = useState('');
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const handleRoleChange = (event) => {
    setSelectedRole(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (selectedRole === 'Student') {
      navigate('/student/profile');
    } else if (selectedRole === 'Faculty') {
      navigate('/faculty/profile');
    }
  };

  useEffect(() => {
    const fetchUserRole = async () => {
      
  
        try {
          const userRole = await usercon.methods.getUserRole().call({ from: user});
          if (userRole === 'Student') {
            navigate('/student/profile');
          } else if (userRole === 'Faculty') {
            navigate('/faculty/profile');
          } 
       
        
      
      } catch (error) {
        console.error('Error fetching user info:', error.message);
      }
    
    };

    fetchUserRole();
  }, [user]);

  return (
    <div>
      <h2>Please choose your role</h2>
      <form onSubmit={handleSubmit}>
        <label>
          <input
            type="radio"
            value="Student"
            checked={selectedRole === 'Student'}
            onChange={handleRoleChange}
          />
          Student
        </label>
        <label>
          <input
            type="radio"
            value="Faculty"
            checked={selectedRole === 'Faculty'}
            onChange={handleRoleChange}
          />
          Faculty
        </label>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default SelectRole;
