import React from 'react'
import { Link } from 'react-router-dom'
import alreadylogged from '../images/alreadylogged.svg'

const AlreadyLogged = () => {
  return (
    <div className='container flex justify-center items-center flex-col h-screen p-4'>
        <p className='title'>Ya has iniciado sesión</p>
        <img className='max-w-xl' src={alreadylogged} alt='Ya has iniciado sesión'/>
        <Link className='subtitle' to='/blog'>Ir al blog</Link>
    </div>

  )
}

export default AlreadyLogged