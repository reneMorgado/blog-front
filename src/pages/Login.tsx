import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { login } from '../helpers/fetch';
import { LoginResponse } from '../interfaces/api';
import { errorAlert, succesAlert } from '../helpers/alerts';
import { Link, useNavigate } from 'react-router-dom';
import { useContext, useState } from 'react';
import { AuthContext } from '../context/userContext';
import Header from '../components/Header';
import Loader from '../components/Loader';

const Login = () => {

	const [loading, setLoading] = useState(false);

	const authContext = useContext(AuthContext)

	const navigate = useNavigate();

	const initialValues: {} = {
		email: '',
		password: ''
	};

	const validationSchema = Yup.object({
		email: Yup.string().min(4).max(50).required('Campo requerido'),
		password: Yup.string().required('Campo requerido')
	});

	const onSubmit = async (values: any) => {
		setLoading(true)
		const response = await login(values) as LoginResponse;
		if (response.status === 200) {
			authContext?.setToken(response.message);
			authContext?.setIsAuthenticated(true);
			localStorage.setItem('token', response.message);
			succesAlert("Has iniciado sesión correctamente!", "Bienvenido", () => { navigate('/blog')});
			setLoading(false)
		} else {
			errorAlert("Error al iniciar sesión", response.message);
			setLoading(false)
		}
	};

	if(loading) return <Loader />

	return (
		<div className='container'>
			<Header/>
			<div className="w-100 flex justify-center flex-col items-center background-login-register">
				<Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
					<Form className='form mt-6'>
						<h1 className='title text-center font-light'>Iniciar sesión</h1>
						<div className='input-container'>
							<label className='input-label' htmlFor="email">Username o Email</label>
							<Field className="input-form" type="text" id="email" name="email" />
							<ErrorMessage className='input-helper' name="email" component="div" />
						</div>
						<div className='input-container'>
							<label className='input-label' htmlFor="password">Contraseña</label>
							<Field className="input-form" type="password" id="password" name="password" />
							<ErrorMessage className='input-helper' name="password" component="div" />
						</div>
						<button className='btn-primary' type="submit">Login</button>
						<p className='normal-font'>¿No tienes una cuenta? <Link className='link' to="/register">Regístrate</Link></p>
					</Form>
				</Formik>

			</div>
		</div>
	);
};

export default Login;