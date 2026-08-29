import React from 'react'
import { Link } from 'react-router-dom'

const NoPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-bg text-center px-4">
      <h1 className="text-6xl font-bold text-brand">404</h1>
      <p className="text-muted mt-2">This page doesn't exist.</p>
      <Link to="/" className="btnNormal btn-primary !w-fit px-[20px] mt-5">Go Home</Link>
    </div>
  )
}

export default NoPage
