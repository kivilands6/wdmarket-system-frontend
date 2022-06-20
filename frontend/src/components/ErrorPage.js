import React from 'react'
import { Link } from "react-router-dom"

function ErrorPage() {
  return (
    <div>
        Error Page 404
        <Link to='/'>Back to home</Link>
    </div>
  )
}

export default ErrorPage