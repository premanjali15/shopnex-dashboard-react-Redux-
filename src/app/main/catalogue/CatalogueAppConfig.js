import { FuseLoadable } from '@fuse';

export const CatalogueAppConfig = {
	settings: {
		layout: {}
	},
	routes: [
		{
			path: '/app/configuration/producttypes/:id',
			component: FuseLoadable({
				loader: () => import('./configuration/producttype/ProductType')
			})
		},
		{
			path: '/app/configuration/producttypes',
			component: FuseLoadable({
				loader: () => import('./configuration/producttypes/ProductTypes')
			})
		},
		{
			path: '/app/configuration/attributes/:id',
			component: FuseLoadable({
				loader: () => import('./configuration/attribute/Attribute')
			})
		},
		{
			path: '/app/configuration/attributes',
			component: FuseLoadable({
				loader: () => import('./configuration/attributeslist/AttributesList')
			})
		},
		{
			path: '/app/products/product/:typeId/:productId',
			component: FuseLoadable({
				loader: () => import('./product/Product')
			})
		},
		{
			path: '/app/products/productinfo/:productId',
			component: FuseLoadable({
				loader: () => import('./productinfo/ProductInfo')
			})
		},
		{
			path: '/app/products/images/:productId',
			component: FuseLoadable({
				loader: () => import('./productimages/ProductImages')
			})
		},
		{
			path: '/app/products/variant/:productId/:variantId',
			component: FuseLoadable({
				loader: () => import('./variant/Variant')
			})
		},
		{
			path: '/app/products',
			component: FuseLoadable({
				loader: () => import('./products/Products')
			})
		},
		// {
		// 	path: '/app/product/details',
		// 	component: FuseLoadable({
		// 		loader: () => import('./productdetails/ProductDetails')
		// 	})
		// },
		{
			path: '/app/categories',
			component: FuseLoadable({
				loader: () => import('./categories/Categories')
			})
		},
		{
			path: '/app/collections/:collectionId/:collectionHandle?',
			component: FuseLoadable({
				loader: () => import('./collections/Collection')
			})
		},
		{
			path: '/app/collections',
			component: FuseLoadable({
				loader: () => import('./collections/Collections')
			})
		}
		// {
		// 	path: '/app/products',
		// 	component: () => <Redirect to="/app/products" />
		// }
	]
};
