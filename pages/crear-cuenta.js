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
import validarCrearCuenta from '../validacion/validarCrearCuenta';

const STATE_INICIAL = {
	nombre: '',
	email: '',
	password: '',
};

const CrearCuenta = () => {
	const [error, setError] = useState(false);

	const {
		valores,
		errores,
		handleChange,
		handleSubmit,
		handleBlur,
	} = useValidacion(STATE_INICIAL, validarCrearCuenta, crearCuenta);

	const { nombre, email, password } = valores;

	async function crearCuenta() {
		try {
			await firebase.registrar(nombre, email, password);
			Router.push('/');
		} catch (error) {
			console.error('Hubo un error al crear el usuario ', error.message);
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
						Crear Cuenta
					</h1>
					<Formulario onSubmit={handleSubmit} noValidate>
						<Campo>
							<label htmlFor='nombre'>Nombre</label>
							<input
								type='text'
								id='nombre'
								placeholder='Tu nombre'
								name='nombre'
								value={nombre}
								onChange={handleChange}
								onBlur={handleBlur}
							/>
						</Campo>

						{errores.nombre && <Error>{errores.nombre}</Error>}

						{error && <Error>{error}</Error>}

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

						<ButtonSubmit type='submit'>Crear Cuenta</ButtonSubmit>
					</Formulario>
				</>
			</Layout>
		</div>
	);
};

export default CrearCuenta;
