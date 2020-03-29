import React, { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { css } from '@emotion/core';
import styled from '@emotion/styled';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import { es } from 'date-fns/locale';

import { FirebaseContext } from '../../firebase';
import Error404 from '../../components/layout/404';
import Layout from '../../components/layout/Layout';
import { Campo, ButtonSubmit } from '../../components/ui/Formulario';
import Boton from '../../components/ui/Boton';

const ContenedorProducto = styled.div`
	@media (min-width: 768px) {
		display: grid;
		grid-template-columns: 2fr 1fr;
		column-gap: 2rem;
	}
`;

const Producto = () => {
	// State del componente
	const [producto, setProducto] = useState({});
	const [error, setError] = useState(false);

	// Routing para obtener el id actual
	const router = useRouter();
	const {
		query: { id },
	} = router;

	// Context de firebae
	const { firebase, usuario } = useContext(FirebaseContext);

	useEffect(() => {
		if (id) {
			const obtenerProducto = async () => {
				const productoQuery = await firebase.db
					.collection('productos')
					.doc(id);
				const producto = await productoQuery.get();
				if (producto.exists) {
					setProducto(producto.data());
				} else {
					setError(true);
				}
				setProducto(producto.data());
			};
			obtenerProducto();
		}
	}, [id]);

	if (Object.keys(producto).length === 0) return 'Cargando...';

	const {
		comentarios,
		creado,
		creador,
		descripcion,
		empresa,
		nombre,
		url,
		urlImagen,
		votos,
	} = producto;

	return (
		<Layout>
			<>
				{error && <Error404 />}

				<div className='contenedor'>
					<h1
						css={css`
							text-align: center;
							margin-top: 5rem;
						`}>
						{nombre}
					</h1>

					<ContenedorProducto>
						<div>
							<p>
								Publicado hace:{' '}
								{formatDistanceToNow(new Date(creado), { locale: es })}
							</p>

							<p>
								Publicado por: {creador.nombre} de {empresa}
							</p>

							<img src={urlImagen} alt='' />
							<p>{descripcion}</p>

							{usuario && (
								<>
									<h2>Agrega tu comentario</h2>
									<form>
										<Campo>
											<input type='text' name='mensaje' />
										</Campo>
										<ButtonSubmit type='submit'>
											Agregar Comentario
										</ButtonSubmit>
									</form>
								</>
							)}

							<h2
								css={css`
									margin: 2rem 0;
								`}>
								Comentarios
							</h2>
							{comentarios.map(comentario => (
								<li>
									<p>{comentario.nombre}</p>
									<p>Escrito por: {comentario.usuarioNombre}</p>
								</li>
							))}
						</div>

						<aside>
							<Boton target='_blank' bgColor='true' href={url}>
								Visitar URL
							</Boton>

							<div
								css={css`
									margin-top: 5rem;
								`}>
								<p
									css={css`
										text-align: center;
									`}>
									{votos} Votos
								</p>
								{usuario && <Boton>Votar</Boton>}
							</div>
						</aside>
					</ContenedorProducto>
				</div>
			</>
		</Layout>
	);
};

export default Producto;
