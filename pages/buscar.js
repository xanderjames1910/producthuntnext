import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import Layout from '../components/layout/Layout';
import DetallesProdcuto from '../components/layout/DetallesProducto';
import useProductos from '../hooks/useProductos';

const Buscar = () => {
	const router = useRouter();
	const {
		query: { q },
	} = router;

	// Todos los productos
	const { productos } = useProductos('creado');
	const [resultado, setResultado] = useState([]);

	useEffect(() => {
		const busqueda = q.toLowerCase();
		const filtro = productos.filter(producto => {
			return (
				producto.nombre.toLowerCase().includes(busqueda) ||
				producto.descripcion.toLowerCase().includes(busqueda)
			);
		});

		setResultado(filtro);
	}, [q, productos]);

	return (
		<div>
			<Layout>
				<div className='listado-productos'>
					<div className='contenedor'>
						<ul className='bg-white'>
							{resultado.map(producto => (
								<DetallesProdcuto
									key={producto.id}
									producto={producto}
								/>
							))}
						</ul>
					</div>
				</div>
			</Layout>
		</div>
	);
};

export default Buscar;
