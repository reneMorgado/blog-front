import React from 'react'
import { Link } from 'react-router-dom'
import stop from '../images/stop.svg'

const Unauthorized = () => {
  return (
    <div className='container flex justify-center items-center flex-col h-screen p-4'>
        <p className='title font-light'>No estás autorizado para ver este contenido</p>
        <img className='max-w-xl' src={stop} alt='Ya has iniciado sesión'/>
        <Link className='subtitle' to='/blog'>Ir al blog</Link>
    </div>
  )
}

export default Unauthorized