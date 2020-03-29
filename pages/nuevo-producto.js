import React, { useContext, useState } from 'react';
import { css } from '@emotion/core';
import Router, { useRouter } from 'next/router';
import FileUploader from 'react-firebase-file-uploader';

import { FirebaseContext } from '../firebase';

import Layout from '../components/layout/Layout';
import {
	ButtonSubmit,
	Campo,
	Error,
	Formulario,
} from '../components/ui/Formulario';

// Validaciones
import useValidacion from '../hooks/useValidacion';
import validarCrearProducto from '../validacion/validarCrearProducto';
import fireabse from '../firebase/firebase';

import Error404 from '../components/layout/404';

const STATE_INICIAL = {
	nombre: '',
	empresa: '',
	// imagen: '',
	url: '',
	descripcion: '',
};

const NuevoProducto = () => {
	// State de las imagenes
	const [nombreImagen, setNombreImagen] = useState('');
	const [subiendo, setSubiendo] = useState(false);
	const [progreso, setProgreso] = useState(0);
	const [urlImagen, setUrlImagen] = useState('');

	const [error, setError] = useState(false);

	const {
		valores,
		errores,
		handleChange,
		handleSubmit,
		handleBlur,
	} = useValidacion(STATE_INICIAL, validarCrearProducto, crearProducto);

	const { nombre, empresa, imagen, url, descripcion } = valores;

	// Hook de routing para redureccionar
	const router = useRouter();

	// Context com las operaciones de CRUD de firebase
	const { usuario, firebase } = useContext(FirebaseContext);

	console.log(usuario);

	async function crearProducto() {
		// Si el usuario no está autenticado llegar al login
		if (!usuario) {
			return router.push('/login');
		}

		// Crear el objeto de nuevo producto
		const producto = {
			nombre,
			empresa,
			url,
			urlImagen,
			descripcion,
			votos: 0,
			comentarios: [],
			creado: Date.now(),
			creador: {
				id: usuario.uid,
				nombre: usuario.displayName,
			},
		};

		// Insertar producto en la base de datos
		firebase.db.collection('productos').add(producto);

		return router.push('/');
	}

	const handleUploadStart = () => {
		setProgreso(0);
		setSubiendo(true);
	};

	const handleProgress = progreso => setProgreso({ progreso });

	const handleUploadError = error => {
		setSubiendo(error);
		console.error(error);
	};

	const handleUploadSuccess = nombre => {
		setProgreso(100);
		setSubiendo(false);
		setNombreImagen(nombre);
		fireabse.storage
			.ref('productos')
			.child(nombre)
			.getDownloadURL()
			.then(url => {
				console.log(url);
				setUrlImagen(url);
			});
	};

	return (
		<div>
			<Layout>
				{!usuario ? (
					<Error404 />
				) : (
					<>
						<h1
							css={css`
								text-align: center;
								margin-top: 5rem;
							`}>
							Nuevo Producto
						</h1>
						<Formulario onSubmit={handleSubmit} noValidate>
							<fieldset>
								<legend>Información General</legend>

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

								<Campo>
									<label htmlFor='empresa'>Empresa</label>
									<input
										type='text'
										id='empresa'
										placeholder='Nombre empresa o compañía'
										name='empresa'
										value={empresa}
										onChange={handleChange}
										onBlur={handleBlur}
									/>
								</Campo>

								{errores.empresa && <Error>{errores.empresa}</Error>}

								<Campo>
									<label htmlFor='imagen'>Imagen</label>
									<FileUploader
										accept='image/*'
										id='imagen'
										name='imagen'
										value={imagen}
										storageRef={firebase.storage.ref('productos')}
										onUploadStart={handleUploadStart}
										onUploadError={handleUploadError}
										onUploadSuccess={handleUploadSuccess}
										onProgress={handleProgress}
									/>
								</Campo>

								<Campo>
									<label htmlFor='url'>URL</label>
									<input
										type='url'
										id='url'
										placeholder='URL de tu producto'
										name='url'
										value={url}
										onChange={handleChange}
										onBlur={handleBlur}
									/>
								</Campo>

								{errores.url && <Error>{errores.url}</Error>}
							</fieldset>

							<fieldset>
								<legend>Sobre tu producto</legend>
								<Campo>
									<label htmlFor='descripcion'>Descripción</label>
									<textarea
										id='descripcion'
										name='descripcion'
										value={descripcion}
										onChange={handleChange}
										onBlur={handleBlur}
									/>
								</Campo>

								{errores.descripcion && (
									<Error>{errores.descripcion}</Error>
								)}
							</fieldset>

							<ButtonSubmit type='submit'>Crear Producto</ButtonSubmit>
						</Formulario>
					</>
				)}
			</Layout>
		</div>
	);
};

export default NuevoProducto;
