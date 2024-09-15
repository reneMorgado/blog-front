import React, { useContext } from 'react'
import Header from '../components/Header'
import { Link } from 'react-router-dom'
import { AuthContext } from '../context/userContext';
import landing from '../images/landing.svg'

const Landing = () => {

  const authContext = useContext(AuthContext);

  return (
    <div className='container'>
      <Header />
      <div className="grid grid-cols-1 grid-rows-2 md:grid-cols-2 md:grid-rows-1 mx-auto">
        <div className="row-start-2 col-start-1 md:row-start-1 md:col-start-1 my-10 md:my-36 mx-6 md:mx-14 flex flex-col">
          {authContext?.isAuthenticated ?
            <p className='subtitle my-20'>Ya has iniciado sesión, <Link className='link' to="/blog">ir al blog</Link></p>
            
            : <>
              <div className="">
                <p className='title my-4'><span className='font-semibold'>Desbloquea tu Potencial:</span> Aprender Nunca Fue Tan Fácil</p>
                <p className='subtitle my-8'>Descubre estrategias efectivas y recursos gratuitos para llevar tu educación al siguiente nivel</p>
                <div className="my-4 w-100 flex">
                  <Link to="/login" className='btn-primary mr-4'>Inicia sesión</Link>
                  <Link to="/register" className='btn-secondary'>Regístrate</Link>
                </div>
                <p className='mt-8 normal-font'>O bien, puedes <Link className='link' to="/blog">Entrar como invitado</Link></p>
              </div>
            </>
          }

        </div>
        <div className="row-start-1 md:h-full col-start-1 md:col-start-2 background-landing flex items-center justify-center">
          <img src={landing} alt="Landing Page" className="max-w-72 object-cover" />
        </div>
      </div>
    </div>
  )
}

export default Landing