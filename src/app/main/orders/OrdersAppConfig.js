import { FuseLoadable } from '@fuse';

export const OrdersAppConfig = {
	settings: {
		layout: {}
	},
	routes: [
		{
			path: '/app/orders/txrn/:txrnId',
			component: FuseLoadable({
				loader: () => import('./transaction/Transaction')
			})
		},
		{
			path: '/app/orders/order/:orderId',
			component: FuseLoadable({
				loader: () => import('./order/Order')
			})
		},
		{
			path: '/app/orders/:type?',
			component: FuseLoadable({
				loader: () => import('./orders/Orders')
			})
		}
	]
};
