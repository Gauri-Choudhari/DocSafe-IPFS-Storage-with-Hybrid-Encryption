import React, { useState, useEffect, useContext, createContext, Children } from 'react';
import Web3 from 'web3';
import { useNavigate } from 'react-router-dom';
import UserDep from "../contracts/UserDep.json";
import contract from "../contracts/contract-address.json";
const web3 = new Web3(window.ethereum);
const usercon = new web3.eth.Contract(UserDep.abi, contract.userdep);

export const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [errorMessage, setErrorMessage] = useState(null);
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const navigate = useNavigate();

  const connectwalletHandler = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        const web3 = new Web3(window.ethereum); // Create Web3 instance here
        setUser(accounts[0]);
        await checkUserRole();
      } catch (err) {
        console.error(err.message);
      }
    } else {
      alert("Please install MetaMask");
    }
  };
  




const accountChangedHandler = async () => {
  if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
    window.ethereum.on("accountsChanged", async (accounts) => {
      setUser(accounts[0]);
      console.log(accounts[0]);
      await checkUserRole();
    });
  } else {
    /* MetaMask is not installed */
    setUser("");
    alert("Please install MetaMask");
  }
};


const checkUserRole = async () => {
  try {
    console.log('Calling getUserRole function...');
    //console.log(user);
    //console.log( await usercon.methods.userRoles(user).call({from: user }));
    const userRole = await usercon.methods.getUserRole().call({ from: user});
  
    console.log('getUserRole response:', userRole);

    setUserRole(userRole);
    console.log(userRole);

    // Redirect the user based on their role
    if (userRole === 'Student') {
      //navigate('/student/profile');
    } else if (userRole === 'Faculty') {
      //navigate('/faculty/profile');
    } else {
      // The user has no role, ask them to choose
      navigate('/roles');
    }
  } catch (error) {
    console.error('Error checking user role:', error.message);
    setErrorMessage('Error checking user role.');
    navigate('/roles');
  }
};




  // const getuserBalance = async (address) => {
  //     const balance = await provider.getBalance(address, "latest")
  //     setUserBalance(balance);
  // }

  const disconnectWallet = () => {
    setUser(null);
  }

  return (
    <UserContext.Provider value={{ user, userRole, setUser, connectwalletHandler, accountChangedHandler, disconnectWallet }}>
      {children}
    </UserContext.Provider>

  )
}
export default UserProvider;
