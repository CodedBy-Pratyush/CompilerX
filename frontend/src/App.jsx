import React from 'react'
import "./App.css";
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import NoPage from './pages/NoPage';
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import Editor from './pages/Editor';
import { AuthProvider, useAuth } from './context/AuthContext';

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <RouteHandler />
      </BrowserRouter>
    </AuthProvider>
  )
};


const RouteHandler = () => {
  const { isLoggedIn, isLoading } = useAuth();

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <>
      <Routes>
        <Route path="/" element={isLoggedIn ? <Home /> : <Navigate to={"/login"} />} />
        <Route path="/signUp" element={isLoggedIn ? <Navigate to={"/"} /> : <SignUp />} />
        <Route path="/login" element={isLoggedIn ? <Navigate to={"/"} /> : <Login />} />
        <Route path="/editor/:id" element={isLoggedIn ? <Editor /> : <Navigate to={"/login"} />} />
        <Route path="*" element={<NoPage />} />
      </Routes>
    </>
  )
}

export default App
