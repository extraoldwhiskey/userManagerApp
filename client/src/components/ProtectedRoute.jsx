import { Navigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true)
  const [token, setToken] = useState(null)

  useEffect(() => {
    const t = localStorage.getItem('token')
    setToken(t)
    setLoading(false)
  }, [])

  if (loading) return <div>Loading...</div>
  if (!token) return <Navigate to="/login" />
  return children
}
