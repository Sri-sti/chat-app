import React, { useContext, useEffect } from 'react'
import { Route, Routes, useNavigate } from 'react-router-dom'
import Login from './pages/login/Login'
import Chat from './pages/Chat/Chat'
import ProfileUpdate from './pages/ProfileUpdate/ProfileUpdate'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from './config/firebase'
import { AppContext } from './context/AppContext'
const App = () => {

  const navigate=useNavigate();
  const {loadUserData}= useContext(AppContext)

  useEffect(()=>{
    onAuthStateChanged(auth,async (user)=>{
      if (user) {
        navigate('/chat');
        await loadUserData(user.uid)
      }
      else{
        navigate('/')
      }
    })
  },[])
  return (
    <>
    <ToastContainer/>
      <Routes>
        //Route for login page
        <Route path='/' element={<Login/>}/>
        //Route for chat app
        <Route path='/chat' element={<Chat/>}/>
        //Route for Profile
        <Route path='/Profile' element={<ProfileUpdate/>}/>
      </Routes>
    </>
  )
}

export default App
