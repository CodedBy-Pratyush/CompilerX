import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiFetch } from '../helper';
import { toast } from 'react-toastify';
import Logo from '../components/Logo';

const SignUp = () => {

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  const submitForm = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const { data } = await apiFetch("/auth/signUp", {
        method: "POST",
        body: JSON.stringify({ fullName, email, pwd }),
      });
      if (data.success) {
        toast.success(data.msg);
        navigate("/login");
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
        <p className="text-muted text-[14px] mt-2 mb-1">Create an account to get started</p>

        <div className="inputBox">
          <input onChange={(e) => { setFullName(e.target.value) }} value={fullName} type="text" placeholder='Full Name' required />
        </div>

        <div className="inputBox">
          <input onChange={(e) => { setEmail(e.target.value) }} value={email} type="email" placeholder='Email' required />
        </div>

        <div className="inputBox">
          <input onChange={(e) => { setPwd(e.target.value) }} value={pwd} type="password" placeholder='Password' required minLength={6} />
        </div>

        <p className='text-muted text-[14px] mt-3 self-start'>Already have an account? <Link to="/login" className='text-accent font-medium'>Login</Link></p>

        <button disabled={isSubmitting} className="btnNormal btn-primary mt-3">
          {isSubmitting ? "Signing up..." : "Sign Up"}
        </button>
      </form>
    </div>
  )
}

export default SignUp
