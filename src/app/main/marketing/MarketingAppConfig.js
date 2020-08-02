import Seo from './seo/Seo';
import SeoDetails from './seo/SeoDetails';
import SeoProduct from './seo/SeoProduct';
import Discounts from './discounts/Discounts';
import DiscountDetails from './discounts/DiscountDetails';

export const MarketingAppConfig = {
	settings: {
		layout: {
			config: {}
		}
	},
	routes: [
		{
			path: '/app/seo',
			component: Seo
		},
		{
			path: '/app/seoproduct/:productId',
			component: SeoProduct
		},
		{
			path: '/app/seodetails',
			component: SeoDetails
		},
		{
			path: '/app/discounts/:id',
			component: DiscountDetails
		},
		{
			path: '/app/discounts',
			component: Discounts
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
