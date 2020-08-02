import { combineReducers } from 'redux';
import carousels from './carousels.reducer';
import carousel from './carousel.reducer';
import navbarlinks from './navbarlinks.reducer';
import swipers from './swipers.reducer';
import highlights from './highlights.reducer';
import highlight from './highlight.reducer';
import videosections from './videosections.reducer';
import videosection from './videosection.reducer';
import home from './home.reducer';
import instagramsections from './instagramsections.reducer';
import instagramsection from './instagramsection.reducer';
import instagrampost from './instagrampost.reducer';
import flatpages from './flatpages.reducer';
import flatpage from './flatpage.reducer';

const reducer = combineReducers({
	carousels,
	carousel,
	navbarlinks,
	swipers,
	highlights,
	highlight,
	videosections,
	videosection,
	home,
	instagramsections,
	instagramsection,
	instagrampost,
	flatpages,
	flatpage
});

export default reducer;
