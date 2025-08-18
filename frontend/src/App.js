

import { useMediaQuery } from '@mui/material';
import React, { useEffect } from 'react';
import toast, { Toaster } from "react-hot-toast";
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/auth/ProtectedRoute';
import ChatLayout from './components/layout/ChatLayout';
import ChatHome from './pages/ChatHome';
import ChatWindow from './pages/ChatWindow';
import Chats from './pages/ChatWindow';
import Home from './pages/Home';
import Login from './pages/Login';
import Meet from './pages/Meet';
import PageNotFound from './pages/PageNotFound';
import Profile from './pages/Profile';
import TempDrawer from './pages/TempDrawer';
import { setIsMobileScreen } from './redux/reducers/misc';
import { userExists, userNotExists } from './redux/reducers/auth';
import { SocketProvider } from './socket';
import axios from 'axios';
import { server } from './constants/config';
import MeetRequestDialog from './dialogs/MeetRequestDialog';
import MeetConfirmDialog from './dialogs/MeetConfirmDialog';
import MeetZEGO from './pages/MeetZEGO';





const App = () => {
  const dispatch = useDispatch();

  const { user, loader } = useSelector((state) => state.auth);

  const mobileScreen = useMediaQuery('(max-width: 599px)');
  dispatch(setIsMobileScreen(mobileScreen));

  useEffect(() => {

    // axios request to get if user is logged in or not
    axios.get(`${server}/api/v1/user/me`, { withCredentials: true })
      .then((data) => {
        toast.success(data.data.message)
        dispatch(userExists(data.data.user));
      })
      .catch((err) => {
        toast.error(err?.response?.data?.message || "Something went wrong");
        dispatch(userNotExists());
      });
      
    // just make function async but had to write try catch to catch error
    // const { data } = await axios.get(`${server}/api/v1/user/me`, { withCredentials: true });
    // console.log(data);

  }, [dispatch]);


  return (
    <>
      <Router>

          
        {/* todo => shown the meet req here  */}
        <MeetRequestDialog />
        <MeetConfirmDialog />


        <Routes>

          {/* Main Home Page => anyone can access */}
          {/* <Route path='/' element={ <Home /> } /> */}
          <Route path='/' element={ <Home /> } />
          <Route path="/profile/:username" element={ <Profile /> } />

          {/* Protected Routes => showed only if the user is logged in */}
          <Route
            element={
              <SocketProvider>
                <ProtectedRoute user={user} />
              </SocketProvider>
            }
          >
        
            <Route path='/chats' element={ <ChatLayout /> } />
            <Route path='/chats/:chatId' element={ <ChatWindow /> } />
            <Route path='/meet' element={ <MeetZEGO /> } />
          </Route>

          {/*  */}
          <Route 
            path='/login'
            element={
              <ProtectedRoute user={!user} redirect={"/"} >
                <Login />
              </ProtectedRoute>
            }
          />

          <Route path='*' element={ <PageNotFound /> } />
        </Routes>

        <Toaster position="bottom-center"  style={{ fontFamily: 'Nunito' }} />
      </Router>
    </>
  )
}

export default App;
