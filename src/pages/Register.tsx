import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { register } from '../helpers/fetch';
import { LoginResponse } from '../interfaces/api';
import { errorAlert, succesAlert } from '../helpers/alerts';
import { Link, useNavigate } from 'react-router-dom';
import { useContext, useState } from 'react';
import { AuthContext } from '../context/userContext';
import Header from '../components/Header';
import Loader from '../components/Loader';

const Register = () => {

	const authContext = useContext(AuthContext)
	const [loading, setLoading] = useState(false);

	const navigate = useNavigate();

	const initialValues: {} = {
		email: '',
        username: '',
		password: '',
        confirmPassword: ''
	};

	const validationSchema = Yup.object({
		email: Yup.string().min(4).max(50).required('Campo requerido').email('Ingrese un email válido'),
		password: Yup.string().required('Campo requerido'),
        confirmPassword: Yup.string().required('Campo requerido').oneOf([Yup.ref('password')], 'Las contraseñas no coinciden'),
        username: Yup.string().min(4).max(20).required('Campo requerido')
	});

	const onSubmit = async (values: any) => {
		setLoading(true)
        const { email, password, username } = values;
		const response = await register({email, username, password}) as LoginResponse;
		if (response.status === 200) {
			authContext?.setToken(response.message);
			authContext?.setIsAuthenticated(true);
			localStorage.setItem('token', response.message);
			succesAlert("Te has registrado correctamente!", "Bienvenido", () => { navigate('/blog')});
			setLoading(false)
		} else {
			errorAlert("Error en el registro", response.message);
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
						<h1 className='title font-light text-center'>Regístrate</h1>
						<div className='input-container'>
							<label className='input-label' htmlFor="email">Email</label>
							<Field className="input-form" type="text" id="email" name="email" />
							<ErrorMessage className='input-helper' name="email" component="div" />
						</div>
						<div className='input-container'>
							<label className='input-label' htmlFor="username">Username</label>
							<Field className="input-form" type="text" id="username" name="username" />
							<ErrorMessage className='input-helper' name="username" component="div" />
						</div>
						<div className='input-container'>
							<label className='input-label' htmlFor="password">Contraseña</label>
							<Field className="input-form" type="password" id="password" name="password" />
							<ErrorMessage className='input-helper' name="password" component="div" />
						</div>
						<div className='input-container'>
							<label className='input-label' htmlFor="confirmPassword">Confirmar contraseña</label>
							<Field className="input-form" type="password" id="confirmPassword" name="confirmPassword" />
							<ErrorMessage className='input-helper' name="confirmPassword" component="div" />
						</div>

						<button className='btn-primary' type="submit">Regístrate</button>
						<p className='normal-font'>Ya tienes una cuenta? <Link className='link' to="/login">Inicia sesión</Link></p>
					</Form>
				</Formik>

			</div>
		</div>
	);
};

export default Register;