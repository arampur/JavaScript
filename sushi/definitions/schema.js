// Define schema

builders.schema('order', { Name: 'string(50)', Email: 'string(120)', Phone: 'string(30)', Locality: 'string(30)', Street: 'string(50)', DiscountCode: 'string(20)', Note: 'string(100)', Products: '[product]' });
builders.schema('product', { Name: 'string(50)', Count: 'number', Price: 'number' });

// Define validation of schema

builders.validation('order', ['Name', 'Email', 'Phone', 'Locality', 'Street', 'Products']);
builders.validation('product', ['Name', 'Count', 'Price']);