import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Logo from './Logo'

const Navbar = () => {
  const navigate = useNavigate();
  const { logout: logoutFromContext } = useAuth();

  const logout = async () => {
    await logoutFromContext();
    navigate("/login");
  };

  return (
    <div className="flex px-[6vw] items-center justify-between h-[80px] bg-surface border-b border-border">
      <Link to="/">
        <Logo size="text-xl" />
      </Link>

      <div className="flex items-center gap-[15px]">
        <Link to="/" className="text-muted transition-all hover:text-white">Home</Link>
        <button onClick={logout} className="btnNormal btn-danger !w-fit px-[20px]">Logout</button>
      </div>
    </div>
  )
}

export default Navbar
