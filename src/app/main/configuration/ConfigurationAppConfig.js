import { FuseLoadable } from '@fuse';

export const ConfigurationAppConfig = {
	settings: {
		layout: {
			config: {}
		}
	},
	routes: [
		{
			path: '/app/shippingzones/:zoneId',
			component: FuseLoadable({
				loader: () => import('./shipping/shippingzone/ShippingZone')
			})
		},
		{
			path: '/app/shippingzones',
			component: FuseLoadable({
				loader: () => import('./shipping/shippingzones/ShippingZones')
			})
		},
		{
			path: '/app/taxes',
			component: FuseLoadable({
				loader: () => import('./taxes/Taxes')
			})
		},
		{
			path: '/app/generalsettings',
			component: FuseLoadable({
				loader: () => import('./generalsettings/GeneralSettings')
			})
		}
	]
};

/**
 * Lazy load Example
 */
/*
import FuseLoadable from '@fuse/components/FuseLoadable/FuseLoadable';

export const ExampleConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    routes  : [
        {
            path     : '/example',
            component: FuseLoadable({
                loader: () => import('./Example')
            })
        }
    ]
};
*/
