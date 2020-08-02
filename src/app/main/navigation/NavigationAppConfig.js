import { FuseLoadable } from '@fuse';

export const NavigationAppConfig = {
	settings: {
		layout: {
			config: {}
		}
	},
	routes: [
		{
			path: '/app/navbar',
			component: FuseLoadable({
				loader: () => import('./navbarlinks/NavbarLinks')
			})
		},
		{
			path: '/app/home',
			component: FuseLoadable({
				loader: () => import('./home/Home')
			})
		},
		{
			path: '/app/carousel/:carouselId',
			component: FuseLoadable({
				loader: () => import('./carouselsection/carousel/Carousel')
			})
		},
		{
			path: '/app/carousel',
			component: FuseLoadable({
				loader: () => import('./carouselsection/carousels/Carousels')
			})
		},
		{
			path: '/app/highlights/:highlightId',
			component: FuseLoadable({
				loader: () => import('./highlightssection/highlight/Highlight')
			})
		},
		{
			path: '/app/highlights',
			component: FuseLoadable({
				loader: () => import('./highlightssection/highlights/Highlights')
			})
		},
		{
			path: '/app/swipers',
			component: FuseLoadable({
				loader: () => import('./swipers/Swipers')
			})
		},
		{
			path: '/app/videos/:videoSectionId',
			component: FuseLoadable({
				loader: () => import('./videossections/videosection/VideoSection')
			})
		},
		{
			path: '/app/videos',
			component: FuseLoadable({
				loader: () => import('./videossections/videosections/VideoSections')
			})
		},
		{
			path: '/app/instagram/:sectionId/post/:postId',
			component: FuseLoadable({
				loader: () => import('./instagramsections/instagramsection/InstagramPost')
			})
		},
		{
			path: '/app/instagram/:instaSectionId',
			component: FuseLoadable({
				loader: () => import('./instagramsections/instagramsection/InstagramSection')
			})
		},
		{
			path: '/app/instagram',
			component: FuseLoadable({
				loader: () => import('./instagramsections/instagramsections/InstagramSections')
			})
		},
		{
			path: '/app/flatpages/:pageId',
			component: FuseLoadable({
				loader: () => import('./flatpages/FlatPage')
			})
		},
		{
			path: '/app/flatpages',
			component: FuseLoadable({
				loader: () => import('./flatpages/FlatPages')
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
