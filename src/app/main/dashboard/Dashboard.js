import React, { Component } from 'react';
import { withStyles, Tab, Tabs, Typography } from '@material-ui/core';
import { FuseAnimate, FusePageCarded } from '@fuse';
// import classNames from 'classnames';

import Statisticks from './statisticks/Statisticks';
import BestSellers from './bestsellers/BestSellers';
import MostViewed from './mostviewed/MostViewed';
import NewCustomers from './newcustomers/NewCustomers';
import TopCustomers from './topcustomers/TopCustomers';
import LastOrders from './lastorders/LastOrders';

const styles = (theme) => ({
	tableBottomBorder: {
		borderBottom: '1px solid rgba(0, 0, 0, 0.12)'
	}
});

class Dashboard extends Component {
	state = {
		tabValue: 0
	};

	handleChangeTab = (event, tabValue) => {
		this.setState({ tabValue });
	};

	render() {
		const { tabValue } = this.state;
		// const { classes } = this.props;

		return (
			<FusePageCarded
				classes={{
					toolbar: 'p-0',
					header: 'min-h-72 h-72 sm:h-136 sm:min-h-136'
				}}
				header={
					<div className="flex flex-1 w-full items-center justify-between">
						<div className="flex flex-col items-start max-w-full">
							<FuseAnimate animation="transition.slideRightIn" delay={300}>
								<Typography className="hidden sm:flex" variant="h6">
									Dashboard
								</Typography>
							</FuseAnimate>
						</div>
					</div>
				}
				// contentToolbar={
				// 	<div className="flex w-full items-center">
				// 		<Tabs
				// 			value={tabValue}
				// 			onChange={this.handleChangeTab}
				// 			indicatorColor="secondary"
				// 			textColor="secondary"
				// 			variant="scrollable"
				// 			scrollButtons="auto"
				// 			classes={{ root: 'w-full h-64' }}
				// 		>
				// 			<Tab className="h-64 normal-case" label="Best Sellers" />
				// 			<Tab className="h-64 normal-case" label="Most Viewed Products" />
				// 			<Tab className="h-64 normal-case" label="New Customers" />
				// 			<Tab className="h-64 normal-case" label="Top Customers" />
				// 		</Tabs>
				// 	</div>
				// }
				content={
					<div>
						<Statisticks />
						<div className="px-20">
							<div className="flex w-full items-center border-1">
								<Tabs
									value={tabValue}
									onChange={this.handleChangeTab}
									indicatorColor="secondary"
									textColor="secondary"
									variant="scrollable"
									scrollButtons="auto"
									classes={{ root: 'w-full h-64' }}
								>
									<Tab className="h-64 normal-case" label="Best Sellers" />
									<Tab className="h-64 normal-case" label="Most Viewed Products" />
									<Tab className="h-64 normal-case" label="New Customers" />
									<Tab className="h-64 normal-case" label="Top Customers" />
								</Tabs>
							</div>
							<div className="mb-20">
								{tabValue === 0 && <BestSellers />}
								{tabValue === 1 && <MostViewed />}
								{tabValue === 2 && <NewCustomers />}
								{tabValue === 3 && <TopCustomers />}
							</div>
						</div>
						<LastOrders />
					</div>
				}
				innerScroll
			/>
		);
	}
}
export default withStyles(styles, { withTheme: true })(Dashboard);
