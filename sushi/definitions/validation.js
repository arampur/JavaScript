
framework.onValidation = function (name, value) {

	switch (name) {

		case 'Name':
		case 'Street':
		case 'Locality':
			return value.length > 0;

		case 'Phone':
			return value.length > 6;

		case 'Products':
			return value.isJSON();

		case 'Email':
			return value.isEmail();

	}
	
};