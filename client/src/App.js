import logo from './logo.svg';
import './App.css';
import {BrowserRouter, Routes, Route} from "react-router-dom";
//util
import PrivateRoute from "./utils/PrivateRoute";
//components
import NavBar from './components/NavBar';
import MetaWallet from './components/MetaWallet';
//pages
import UploadFile from './pages/UploadFile';
import Home from './pages/Home';
import MyFiles from './pages/MyFiles';
import Profile from './pages/AccountPg';
import UserProvider from './contexts/UserContext';

function App() {
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
      <Route exact path="/profile" element={<Profile/>}/>
      <Route exact path="/myfiles" element={<MyFiles/>}/>
    </Route>
    </Routes>
    </UserProvider>
    </BrowserRouter>
    </>
  );
}

export default App;
