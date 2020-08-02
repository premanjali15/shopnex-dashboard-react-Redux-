import React from 'react';
import { Redirect } from 'react-router-dom';
import { FuseUtils } from '@fuse/index';
import { DashboardConfig } from 'app/main/dashboard/DashboardConfig';
import { CatalogueAppConfig } from 'app/main/catalogue/CatalogueAppConfig';
import { LoginConfig } from 'app/main/login/LoginConfig';
import { OrdersAppConfig } from 'app/main/orders/OrdersAppConfig';
import { NavigationAppConfig } from 'app/main/navigation/NavigationAppConfig';
import { ConfigurationAppConfig } from 'app/main/configuration/ConfigurationAppConfig';
import { NewDashboardConfig } from 'app/main/newdashboard/NewDashboardConfig';
import { MarketingAppConfig } from 'app/main/marketing/MarketingAppConfig';

const routeConfigs = [
	DashboardConfig,
	LoginConfig,
	CatalogueAppConfig,
	OrdersAppConfig,
	NavigationAppConfig,
	ConfigurationAppConfig,
	NewDashboardConfig,
	MarketingAppConfig
];

const routes = [
	...FuseUtils.generateRoutesFromConfigs(routeConfigs),
	{
		path: '/',
		component: () => <Redirect to="/app/products" />
	}
];

export default routes;
