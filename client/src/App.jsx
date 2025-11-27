import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Layout from "./pages/Layout";
import Dashboard from "./pages/Dashboard.jsx";
import ResumeBuilder from "./pages/ResumeBuilder";
import Preview from "./pages/Preview";
import Login from "./pages/Login";
import { useDispatch } from "react-redux";
import api from "./configs/api";
import { login,setLoading } from "./app/features/authSlice.js";
import {Toaster} from 'react-hot-toast'


export default function App() {

  const dispatch=useDispatch();

  async function getUserData() {
    const token=localStorage.getItem('token');

    try {
      if(token){
        const {data}=await api.get('/api/users/data',{
          headers:{
            Authorization:token
          }
        })
        


        if(data.user){
          dispatch(login({token,user:data.user}))
          // setLoading(false);
         dispatch(setLoading(false))
        }

        
      }
      else{
        dispatch(setLoading(false))
      }
    } catch (error) {
      dispatch(setLoading(false))
      console.log(error.message);
      
    }
  }

  useEffect(()=>{
    getUserData();
  },[])


  return (
    <>
    <Toaster/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/app" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="builder/:resumeId" element={<ResumeBuilder />} />
        </Route>

        <Route path="view/:resumeId" element={<Preview />} />
        {/* <Route path="login" element={<Login />} /> */}
      </Routes>
    </>
  );
}
