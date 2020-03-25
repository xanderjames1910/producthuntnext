export default function validarCrearProducto(valores) {
	let errores = {};

	// Validar el nombre del producto
	if (!valores.nombre) {
		errores.nombre = 'El nombre es obligatorio';
	}

	// Validar empresa
	if (!valores.empresa) {
		errores.empresa = 'El nombre de la empresa es obligatorio';
	}

	// Validar el url
	if (!valores.url) {
		errores.url = 'La url del producto es obligatoria';
	} else if (!/^(ftp|http|https):\/\/[^ "]+$/.test(valores.url)) {
		errores.url = 'URL mal formateada o no válida';
	}

	// Validar descripción
	if (!valores.descripcion) {
		errores.descripcion = 'Agraga una descripción de tu producto';
	}

	return errores;
}
