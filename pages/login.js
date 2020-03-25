import React, { useState } from 'react';
import { css } from '@emotion/core';
import Router from 'next/router';

import firebase from '../firebase';

import Layout from '../components/layout/Layout';
import {
	ButtonSubmit,
	Campo,
	Error,
	Formulario,
} from '../components/ui/Formulario';

// Validaciones
import useValidacion from '../hooks/useValidacion';
import validarIniciarSesion from '../validacion/validarIniciarSesion';

const STATE_INICIAL = {
	email: '',
	password: '',
};

const Login = () => {
	const [error, setError] = useState(false);

	const {
		valores,
		errores,
		handleChange,
		handleSubmit,
		handleBlur,
	} = useValidacion(STATE_INICIAL, validarIniciarSesion, iniciarSesion);

	const { email, password } = valores;

	async function iniciarSesion() {
		try {
			await firebase.login(email, password);
			Router.push('/');
		} catch (error) {
			console.error(
				'Hubo un error al autenticar el usuario ',
				error.message,
			);
			setError(error.message);
		}
	}

	return (
		<div>
			<Layout>
				<>
					<h1
						css={css`
							text-align: center;
							margin-top: 5rem;
						`}>
						Iniciar Sesión
					</h1>
					<Formulario onSubmit={handleSubmit} noValidate>
						<Campo>
							<label htmlFor='email'>Email</label>
							<input
								type='email'
								id='email'
								placeholder='Tu email'
								name='email'
								value={email}
								onChange={handleChange}
								onBlur={handleBlur}
							/>
						</Campo>

						{errores.email && <Error>{errores.email}</Error>}

						<Campo>
							<label htmlFor='password'>Contraseña</label>
							<input
								type='password'
								id='password'
								placeholder='Tu contraseña'
								name='password'
								value={password}
								onChange={handleChange}
								onBlur={handleBlur}
							/>
						</Campo>

						{errores.password && <Error>{errores.password}</Error>}

						{error && <Error>{error}</Error>}

						<ButtonSubmit type='submit'>Iniciar Sesión</ButtonSubmit>
					</Formulario>
				</>
			</Layout>
		</div>
	);
};

export default Login;
