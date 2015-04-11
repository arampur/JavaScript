var db = framework.database('products');
var category = {};

// Read all categories
db.each(function(doc) {
	var key = doc.category.removeDiacritics().toLowerCase().replace(/\s/g, '').replace(/\,/g, '');
	if (typeof(category[key]) === 'undefined')
		category[key] = [];
	category[key].push(doc);
}, function() {
	framework.global.category = category;
});

/*
db.insert([

	{ category: 'Urimaki', name: 'California Masago', count: '3 ks', price: 3.15, materials: ['surimi', 'avokádo', 'majonéza', 'obalené v kaviáre masago'] },
	{ category: 'Urimaki', name: 'California sezam', count: '3 ks', price: 3.30, materials: ['surimi', 'uhorka', 'majonéza', 'sézam'] },
	{ category: 'Urimaki', name: 'California Tobico', count: '3 ks', price: 3.90, materials: ['losos', 'avokádo', 'obalené v kaviáre Tobico'] },
	{ category: 'Urimaki', name: 'Spring chive', count: '3 ks', price: 3.15, materials: ['losos', 'jarná cibuľa', 'majonéza'] },

	{ category: 'Temaki', name: 'Ebi', count: '1 ks', price: 5.90, materials: ['kreveta', 'zelenina'] },
	{ category: 'Temaki', name: 'Kani Surimi', count: '1 ks', price: 3.80, materials: ['surimi krab', 'zelenina'] },
	{ category: 'Temaki', name: 'Maguro', count: '1 ks', price: 4.50, materials: ['tuniak', 'zelenina'] },
	{ category: 'Temaki', name: 'Sake', count: '1 ks', price: 3.60, materials: ['losos', 'zelenina'] },

	{ category: 'Sushi Fresh Set', name: 'Set Big Eat', count: '1 ks', price: 19.90, materials: [] },
	{ category: 'Sushi Fresh Set', name: 'Set California', count: '1 ks', price: 9.90, materials: [] },
	{ category: 'Sushi Fresh Set', name: 'Set Dinner', count: '1 ks', price: 7.40, materials: [] },
	{ category: 'Sushi Fresh Set', name: 'Set Ebi', count: '1 ks', price: 7.20, materials: [] },

	{ category: 'Sushi Fresh Set', name: 'Set Lunch', count: '1 ks', price: 6.70, materials: [] },
	{ category: 'Sushi Fresh Set', name: 'Set Maguro', count: '1 ks', price: 6.80, materials: [] },
	{ category: 'Sushi Fresh Set', name: 'Set Maki L', count: '1 ks', price: 5.60, materials: [] },
	{ category: 'Sushi Fresh Set', name: 'Set Maki S', count: '1 ks', price: 4.45, materials: [] },

	{ category: 'Sushi Fresh Set', name: 'Set Maki XL', count: '1 ks', price: 6.60, materials: [] },
	{ category: 'Sushi Fresh Set', name: 'Set Maki XXL', count: '1 ks', price: 9.20, materials: [] },
	{ category: 'Sushi Fresh Set', name: 'Set Maxi', count: '1 ks', price: 9.90, materials: [] },
	{ category: 'Sushi Fresh Set', name: 'Set Mini', count: '1 ks', price: 5.90, materials: [] },

	{ category: 'Sushi Fresh Set', name: 'Set Nigiri mix L', count: '1 ks', price: 8.90, materials: [] },
	{ category: 'Sushi Fresh Set', name: 'Set Nigiri mix XL', count: '1 ks', price: 10.90, materials: [] },
	{ category: 'Sushi Fresh Set', name: 'Set Nigiri mix XXL', count: '1 ks', price: 12.90, materials: [] },
	{ category: 'Sushi Fresh Set', name: 'Set Sake', count: '1 ks', price: 6.20, materials: [] },

	{ category: 'Sushi Fresh Set', name: 'Set Temaki L', count: '1 ks', price: 10.90, materials: [] },
	{ category: 'Sushi Fresh Set', name: 'Set Temaki XL', count: '1 ks', price: 12.90, materials: [] },
	{ category: 'Sushi Fresh Set', name: 'Set Temaki XXL', count: '1 ks', price: 14.90, materials: [] },
	{ category: 'Sushi Fresh Set', name: 'Set Vegetarian', count: '1 ks', price: 4.90, materials: [] },

	{ category: 'Sashimi', name: 'Asur Sakana', count: '100g', price: 5.59, materials: ['maslová ryba'] },
	{ category: 'Sashimi', name: 'Ebi', count: '100g', price: 8.99, materials: ['kreveta'] },
	{ category: 'Sashimi', name: 'Maguro', count: '100g', price: 9.99, materials: ['tuniak'] },
	{ category: 'Sashimi', name: 'Sake', count: '100g', price: 6.99, materials: ['losos'] },

	{ category: 'Onigiri', name: 'Onigiri Hot', count: '1 ks', price: 1.89, materials: ['chilli', 'kreveta'] },
	{ category: 'Onigiri', name: 'Onigiri Ikura', count: '1 ks', price: 1.99, materials: ['kaviár'] },
	{ category: 'Onigiri', name: 'Onigiri Sake', count: '1 ks', price: 2.09, materials: ['losos', 'avokádo', 'sézam'] },
	{ category: 'Onigiri', name: 'Onigiri Sake', count: '1 ks', price: 1.59, materials: ['losos'] },

	{ category: 'Salads', name: 'Daikon', count: '180g', price: 1.75, materials: [] },
	{ category: 'Salads', name: 'Wakame', count: '180g', price: 2.90, materials: [] },

	{ category: 'Nigiri sushi', name: 'Asur Sakana', count: '1 ks', price: 1.99, materials: ['maslová ryba'] },
	{ category: 'Nigiri sushi', name: 'Avocado', count: '1 ks', price: 1.15, materials: ['avokádo'] },
	{ category: 'Nigiri sushi', name: 'Ebi', count: '1 ks', price: 2.09, materials: ['kreveta'] },
	{ category: 'Nigiri sushi', name: 'Hirame', count: '1 ks', price: 1.75, materials: ['halibut'] },

	{ category: 'Nigiri sushi', name: 'Ika', count: '1 ks', price: 1.75, materials: ['sépia'] },
	{ category: 'Nigiri sushi', name: 'Ikura', count: '1 ks', price: 2.59, materials: ['lososí kaviár'] },
	{ category: 'Nigiri sushi', name: 'Iwashi', count: '1 ks', price: 1.45, materials: ['sardinka'] },
	{ category: 'Nigiri sushi', name: 'Kani Surimi', count: '1 ks', price: 1.29, materials: ['surimi krab'] },

	{ category: 'Nigiri sushi', name: 'Kappa', count: '1 ks', price: 1.15, materials: ['uhorka'] },
	{ category: 'Nigiri sushi', name: 'Maguro', count: '1 ks', price: 2.73, materials: ['tuniak'] },
	{ category: 'Nigiri sushi', name: 'Masago', count: '1 ks', price: 1.15, materials: ['masago kaviár'] },
	{ category: 'Nigiri sushi', name: 'Saba', count: '1 ks', price: 1.65, materials: ['makrela'] },

	{ category: 'Nigiri sushi', name: 'Sake', count: '1 ks', price: 1.49, materials: ['losos'] },
	{ category: 'Nigiri sushi', name: 'Tako', count: '1 ks', price: 1.95, materials: ['chobotnica'] },
	{ category: 'Nigiri sushi', name: 'Takuan', count: '1 ks', price: 1.15, materials: ['japonská reďkovka'] },
	{ category: 'Nigiri sushi', name: 'Tamago', count: '1 ks', price: 1.16, materials: ['vaječná omeleta'] },

	{ category: 'Nigiri sushi', name: 'Tobico', count: '1 ks', price: 1.15, materials: ['tobico kaviár'] },
	{ category: 'Nigiri sushi', name: 'Unagi', count: '1 ks', price: 1.95, materials: ['grilovaný uhor'] },


	{ category: 'Maki, Hosomaki', name: 'Asur Sakana', count: '3 ks', price: 2.05, materials: ['maslová ryba'] },
	{ category: 'Maki, Hosomaki', name: 'Avocado sake', count: '3 ks', price: 2.25, materials: ['avokádo', 'losos'] },
	{ category: 'Maki, Hosomaki', name: 'Ikura', count: '3 ks', price: 3.18, materials: ['kaviár'] },
	{ category: 'Maki, Hosomaki', name: 'Kappa', count: '3 ks', price: 0.99, materials: ['uhorka'] },

	{ category: 'Maki, Hosomaki', name: 'Maguro', count: '3 ks', price: 2.19, materials: ['tuniak'] },
	{ category: 'Maki, Hosomaki', name: 'Maguro Takuan', count: '3 ks', price: 2.25, materials: ['tuniak', 'japonská reďkovka'] },
	{ category: 'Maki, Hosomaki', name: 'Sake', count: '3 ks', price: 1.80, materials: ['losos'] },
	{ category: 'Maki, Hosomaki', name: 'Sake Kappa', count: '3 ks', price: 2.25, materials: ['losos', 'uhorka'] },

	{ category: 'Maki, Hosomaki', name: 'Shitake', count: '3 ks', price: 0.99, materials: ['shitake hríb'] },
	{ category: 'Maki, Hosomaki', name: 'Surimi', count: '3 ks', price: 0.99, materials: ['surimi krab'] },
	{ category: 'Maki, Hosomaki', name: 'Špargla', count: '3 ks', price: 0.99, materials: ['špargľa'] },
	{ category: 'Maki, Hosomaki', name: 'Takuan', count: '3 ks', price: 1.20, materials: ['japonská reďkovka'] },
	{ category: 'Maki, Hosomaki', name: 'Astkt', count: '4 ks', price: 3.05, materials: ['avokádo', 'losos', 'vajíčko', 'uhorka', 'japonská reďkovka'] }

]);
*/