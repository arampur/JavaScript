var mail = require('partial.js/mail');

exports.install = function(framework) {
    framework.route('/', view_homepage);
    framework.route('/xhr/order/', json_order, ['post', 'xhr']);
    framework.route('/usage/', plain_usage);
};

function plain_usage() {
	var self = this;
	self.plain(self.framework.usage(true));
}

function view_homepage() {
    var self = this;
    self.view('homepage', { Email: '@', Phone: '+421' });
}

function json_order() {

	var self = this;
	var model = self.post;

	// parse products
	model.Products = JSON.parse(model.Products);
	model = builders.prepare('order', model);

	// definitions/schema.js
	// definitions/validation.js
	var validation = self.validation(model, 'order', 'form-');

	if (validation.hasError()) {
		self.json(validation)
		return;
	}

	var db = self.database('orders');

	// insert order into the database
	db.insert(model);

	// send e-mail

	var template = self.resource('template-order');
	var products = '';
	var price = 0;

	model.Products.forEach(function(product) {
		products += self.resource('template-order-product').params(product);
		price += product.Price;
	});

	model.created = new Date();
	model.url = self.host();
	model.Products = products;
	model.Sumarize = price;

	template = template.params(model);

	var message = new mail.Message('Thanks for order!', template);

	message.to(model.Email);
	message.bcc(self.config['gmail-email']);
	message.from(self.config['gmail-email'], self.config.name);	
	message.send('smtp.gmail.com', { port: 465, secure: true, user: self.config['gmail-email'], password: self.config['gmail-password'] });

	// return response
	self.json({ r: true });

}