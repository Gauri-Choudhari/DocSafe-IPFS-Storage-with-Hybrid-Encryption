//web
import './App.css';
import React, { useEffect, useState } from "react";
import {BrowserRouter, Routes, Route} from "react-router-dom";
//blockchain
import contractAddress from "./contracts/contract-address.json";
import UserArtifact from "./contracts/UserDep.json";
import { ethers } from "ethers";
//util
import PrivateRoute from "./utils/PrivateRoute";
//components
import NavBar from './components/NavBar';
import MetaWallet from './components/MetaWallet';
//pages
import UploadFile from './pages/UploadFile';
import Home from './pages/Home';
import MyFiles from './pages/MyFiles';
import UserProvider from './contexts/UserContext';
import SelectRole from './pages/SelectRole';
import StudentProfile from './pages/StudentProfile';
import FacultyProfile from './pages/FacultyProfile';
import ViewFile from './pages/ViewFile';
import ShareDoc from './pages/ShareDoc';
import FilesSharedWithMe from './pages/FilesSharedWithMe';
import GetKey from './pages/GetKey';
//const provider = new ethers.providers.Web3Provider(window.ethereum);

function App() {

  // const usercon = new ethers.Contract(
  //   contractAddress.userdep, // contract address
  //   UserArtifact.abi, // contract abi (meta-data)
  //   provider.getSigner(0) // Signer object signs and sends transactions
  // );
  // const getDetails= async ()=>{
  
  //   const acc1 = await provider.getSigner();
  //   const acc2 = await acc1.getAddress();
  //   prof = await usercon.getPatientDetails(acc2);
  // };
  // // Window.onload = async ()=>{await getDetails()};

  return (
    <>
    
    <BrowserRouter>
    <UserProvider>
    <NavBar/>
    <Routes>
    <Route exact path="/" element={<Home />}/>
    <Route exact path="/metamaskauth" element={<MetaWallet/>}/>
    <Route element={<PrivateRoute />}>
      <Route exact path="/fileupload" element={<UploadFile />} />
      <Route exact path="/student/profile" element={<StudentProfile/>}/>
      <Route exact path="/faculty/profile" element={<FacultyProfile/>}/>
      <Route exact path="/view/:ext/:hash/:key" element={<ViewFile/>}/>
      <Route exact path="/share/:hash/:key" element={<ShareDoc/>}/>
      <Route exact path="/getkey" element={<GetKey/>}/>
      <Route exact path="/myfiles" element={<MyFiles/>}/>
      <Route exact path="/sharedfiles" element={<FilesSharedWithMe/>}/>
      <Route exact path="/roles" element={<SelectRole/>}/>
    </Route>
    </Routes>
    </UserProvider>
    </BrowserRouter>
    </>

  );
}

export default App;
