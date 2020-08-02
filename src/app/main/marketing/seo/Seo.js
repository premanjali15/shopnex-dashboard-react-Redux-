import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { FusePageSimple } from '@fuse';
import { Link } from 'react-router-dom';

const styles = () => ({
	link: {
		textDecoration: 'none',
		'&:hover': {
			textDecoration: 'none !important'
		}
	}
});

class SeoDetail extends Component {
	render() {
		const { classes } = this.props;
		return (
			<FusePageSimple
				classes={{
					root: classes.layoutRoot,
					header: 'min-h-64 d-flex items-center',
					content: 'bg-white'
				}}
				header={
					<div className="ml-72">
						<h1 className="text-20 font-600">Marketing</h1>
					</div>
				}
				content={
					<div className="px-72 py-92">
						<h6 className="font-600 text-grey-dark text-13 mb-40">DISCOVERY</h6>
						<Link to="/app/seodetails" className={classes.link}>
							<h4 className="font-600 border-b-1 pb-8 text-18 text-black">SEO</h4>
						</Link>
						<div className="mt-40">
							<h6 className="font-600 text-grey-dark text-13 mb-4">ENGAGEMENT</h6>
							<h4 className="font-600 mt-16">Promotional Pop-Up</h4>
							<h4 className="font-600 mt-16">Announcement Bar</h4>
						</div>
					</div>
				}
			/>
		);
	}
}

export default withStyles(styles, { withTheme: true })(SeoDetail);
