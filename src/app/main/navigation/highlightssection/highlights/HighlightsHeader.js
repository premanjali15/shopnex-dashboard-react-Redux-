import React from 'react';
import { Button, Icon, Typography } from '@material-ui/core';
import { FuseAnimate } from '@fuse';

const HighlightsHeader = (props) => {
	return (
		<div className="flex flex-1 w-full items-center justify-between">
			<div className="flex items-center">
				<FuseAnimate animation="transition.expandIn" delay={300}>
					<Icon className="text-32 mr-0 sm:mr-12">shopping_basket</Icon>
				</FuseAnimate>
				<FuseAnimate animation="transition.slideLeftIn" delay={300}>
					<Typography className="hidden sm:flex" variant="h6">
						Highlights
					</Typography>
				</FuseAnimate>
			</div>

			<div className="flex flex-1" />

			<FuseAnimate animation="transition.slideRightIn" delay={300}>
				<Button className="whitespace-no-wrap" variant="contained" onClick={props.handleOpen}>
					<span className="hidden sm:flex">Add New Highlight</span>
					<span className="flex sm:hidden">New</span>
				</Button>
			</FuseAnimate>

			<div className="flex items-center pl-24">
				<Button className="whitespace-no-wrap" variant="contained" onClick={props.refreshData}>
					<Icon className="text-24 mr-4">refresh</Icon>
					<span className="hidden sm:flex">Refresh</span>
				</Button>
			</div>
		</div>
	);
};
export default HighlightsHeader;
