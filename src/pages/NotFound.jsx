import React from 'react'
import { Link } from 'react-router-dom'
export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-surface px-6">
      <div className="text-center max-w-md">
        <div className="text-8xl font-black text-teal-deep mb-4">404</div>
        <h1 className="text-2xl font-black text-navy mb-3">Page Not Found</h1>
        <p className="text-gray-500 text-sm mb-8">The page you're looking for doesn't exist or has been moved.</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/" className="btn-primary">Go Home</Link>
          <Link to="/training-categories" className="btn-secondary">Browse Courses</Link>
        </div>
      </div>
    </div>
  )
}
