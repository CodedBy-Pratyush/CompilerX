import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { apiFetch } from '../helper';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/Logo';

const Login = () => {

  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();
  const { refreshUser } = useAuth();

  const submitForm = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const { data } = await apiFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, pwd }),
      });
if (data.success) {
    await refreshUser();
    navigate("/");
} else {
        toast.error(data.msg);
      }
    } catch (err) {
      toast.error("Could not reach the server. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-bg px-4">
      <form onSubmit={submitForm} className='w-full max-w-[400px] flex flex-col items-center card p-[28px] shadow-soft'>
        <Logo size="text-2xl" />
        <p className="text-muted text-[14px] mt-2 mb-1">Welcome back, log in to continue</p>

        <div className="inputBox">
          <input onChange={(e) => { setEmail(e.target.value) }} value={email} type="email" placeholder='Email' required />
        </div>

        <div className="inputBox">
          <input onChange={(e) => { setPwd(e.target.value) }} value={pwd} type="password" placeholder='Password' required />
        </div>

        <p className='text-muted text-[14px] mt-3 self-start'>Don't have an account? <Link to="/signUp" className='text-accent font-medium'>Sign Up</Link></p>

        <button disabled={isSubmitting} className="btnNormal btn-primary mt-3">
          {isSubmitting ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  )
}

export default Login
