const navigationConfig = [
	// {
	// 	id: 'dashboard-component',
	// 	title: 'Dashboard',
	// 	type: 'item',
	// 	icon: 'dashboard',
	// 	url: '/app/dashboard'
	// },
	{
		id: 'app-products',
		title: 'Catalogue',
		type: 'collapse',
		icon: 'shopping_basket',
		url: '/app/products',
		children: [
			{
				id: 'e-commerce-products',
				title: 'All Products',
				type: 'item',
				url: '/app/products',
				exact: true
			},
			{
				id: 'e-commerce-categories',
				title: 'Categories',
				type: 'item',
				url: '/app/categories',
				exact: true
			},
			{
				id: 'e-commerce-collections',
				title: 'Collections',
				type: 'item',
				url: '/app/collections',
				exact: true
			},
			{
				id: 'e-commerce-catalogue-configuration',
				title: 'Configuration',
				type: 'collapse',
				url: '/app/configuration/producttypes',
				children: [
					{
						id: 'e-commerce-catalogue-configuration-producttype',
						title: 'Product Types',
						type: 'item',
						url: '/app/configuration/producttypes',
						exact: true
					},
					{
						id: 'e-commerce-catalogue-configuration-attribute',
						title: 'Attributes',
						type: 'item',
						url: '/app/configuration/attributes',
						exact: true
					}
				]
			}
		]
	}
	// {
	// 	id: 'app-orders',
	// 	title: 'Orders',
	// 	type: 'collapse',
	// 	icon: 'shopping_cart',
	// 	url: '/app/orders',
	// 	children: [
	// 		{
	// 			id: 'e-commerce-orders',
	// 			url: '/app/orders',
	// 			exact: true
	// 		},
	// 		{
	// 			id: 'e-commerce-created-orders',
	// 			title: 'Creaed Orders',
	// 			type: 'item',
	// 			url: '/app/orders/created',
	// 			exact: true
	// 		},
	// 		{
	// 			id: 'e-commerce-placed-orders',
	// 			title: 'Placed Orders',
	// 			type: 'item',
	// 			url: '/app/orders/placed',
	// 			exact: true
	// 		},
	// 		{
	// 			id: 'e-commerce-confirmed-orders',
	// 			title: 'Confirmed Orders',
	// 			type: 'item',
	// 			url: '/app/orders/confirmed',
	// 			exact: true
	// 		},
	// 		{
	// 			id: 'e-commerce-shipped-orders',
	// 			title: 'Shipped Orders',
	// 			type: 'item',
	// 			url: '/app/orders/shipped',
	// 			exact: true
	// 		},
	// 		{
	// 			id: 'e-commerce-delivered-orders',
	// 			title: 'Delivered Orders',
	// 			type: 'item',
	// 			url: '/app/orders/delivered',
	// 			exact: true
	// 		},
	// 		{
	// 			id: 'e-commerce-canceled-orders',
	// 			title: 'Canceled Orders',
	// 			type: 'item',
	// 			url: '/app/orders/canceled',
	// 			exact: true
	// 		},
	// 		{
	// 			id: 'e-commerce-pending-orders',
	// 			title: 'Pending Orders',
	// 			type: 'item',
	// 			url: '/app/orders/pending',
	// 			exact: true
	// 		}
	// 	]
	// }
	// {
	// 	id: 'app-navbar',
	// 	title: 'Navigation',
	// 	type: 'collapse',
	// 	icon: 'navigation',
	// 	url: '/app/carousel',
	// 	children: [
	// 		{
	// 			id: 'e-commerce-navbar',
	// 			title: 'Navbar',
	// 			type: 'item',
	// 			url: '/app/navbar',
	// 			exact: true
	// 		},
	// 		{
	// 			id: 'e-commerce-navbar-home',
	// 			title: 'Home',
	// 			type: 'item',
	// 			url: '/app/home',
	// 			exact: true
	// 		},
	// 		{
	// 			id: 'e-commerce-flatpages',
	// 			title: 'Pages',
	// 			type: 'item',
	// 			url: '/app/flatpages',
	// 			exact: true
	// 		},
	// 		{
	// 			id: 'e-commerce-navbar-components',
	// 			title: 'Components',
	// 			type: 'group',
	// 			icon: 'apps',
	// 			children: [
	// 				{
	// 					id: 'e-commerce-carousel',
	// 					title: 'Carousel',
	// 					type: 'item',
	// 					url: '/app/carousel',
	// 					exact: true
	// 				},
	// 				{
	// 					id: 'e-commerce-highlights',
	// 					title: 'Highlights',
	// 					type: 'item',
	// 					url: '/app/highlights',
	// 					exact: true
	// 				},
	// 				{
	// 					id: 'e-commerce-swipers',
	// 					title: 'Swipers',
	// 					type: 'item',
	// 					url: '/app/swipers',
	// 					exact: true
	// 				},
	// 				{
	// 					id: 'videos-section',
	// 					title: 'Videos Section',
	// 					type: 'item',
	// 					url: '/app/videos',
	// 					exact: true
	// 				},
	// 				{
	// 					id: 'instagram-section',
	// 					title: 'Instagram Section',
	// 					type: 'item',
	// 					url: '/app/instagram',
	// 					exact: true
	// 				}
	// 			]
	// 		}
	// 	]
	// },
	// {
	// 	id: 'app-configuration',
	// 	title: 'Configuration',
	// 	type: 'collapse',
	// 	icon: 'settings',
	// 	url: '/app/shipping',
	// 	children: [
	// 		{
	// 			id: 'e-commerce-shipping',
	// 			title: 'Shipping Zones',
	// 			type: 'item',
	// 			url: '/app/shippingzones',
	// 			exact: true
	// 		},
	// 		{
	// 			id: 'e-commerce-taxes',
	// 			title: 'Taxes',
	// 			type: 'item',
	// 			url: '/app/taxes',
	// 			exact: true
	// 		},
	// 		{
	// 			id: 'e-commerce-generalsettings',
	// 			title: 'General Settings',
	// 			type: 'item',
	// 			url: '/app/generalsettings',
	// 			exact: true
	// 		}
	// 	]
	// },
	// {
	// 	id: 'app-marketing',
	// 	title: 'Marketing',
	// 	type: 'collapse',
	// 	icon: 'emoji_people',
	// 	url: '/app/marketing',
	// 	children: [
	// 		{
	// 			id: 'e-commerce-seo',
	// 			title: 'SEO',
	// 			type: 'item',
	// 			url: '/app/seo',
	// 			exact: true
	// 		}
	// 		// {
	// 		// 	id: 'e-commerce-discount',
	// 		// 	title: 'Discounts',
	// 		// 	type: 'item',
	// 		// 	url: '/app/discounts',
	// 		// 	exact: true
	// 		// }
	// 	]
	// }
];

export default navigationConfig;
