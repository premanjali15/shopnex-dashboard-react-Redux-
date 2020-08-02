import NewDashboard from './NewDashboard';
import TotalOrders from './components/TotalOrders';
import ConversionRate from './components/ConversionRate';
import OrdersGraph from './components/OrdersGraph';

export const NewDashboardConfig = {
	settings: {
		layout: {
			config: {}
		}
	},
	routes: [
		{
			path: '/app/dashboard/total-orders',
			component: TotalOrders
		},
		{
			path: '/app/dashboard/conversation',
			component: ConversionRate
		},
		{
			path: '/app/dashboard/orders-graph',
			component: OrdersGraph
		},
		{
			path: '/app/dashboard',
			component: NewDashboard
		}
	]
};
