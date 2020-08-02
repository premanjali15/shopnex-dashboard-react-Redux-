import React, { Component } from 'react';
import { withStyles, Typography, Card } from '@material-ui/core';
import classNames from 'classnames';

const styles = (theme) => ({
	card: {
		width: '90%',
		margin: '2.5rem',
		marginTop: '6rem',
		[theme.breakpoints.up('md')]: {
			width: '50%'
		}
	}
});

class LastOrders extends Component {
	render() {
		const { classes } = this.props;

		const data = [
			{
				title: 'Title 1',
				items: 5,
				total: 15000
			},
			{
				title: 'Title 2',
				items: 2,
				total: 5000
			},
			{
				title: 'Title 3',
				items: 1,
				total: 3400
			},
			{
				title: 'Title 4',
				items: 4,
				total: 4500
			},
			{
				title: 'Title 5',
				items: 2,
				total: 1200
			}
		];
		return (
			<Card className={classNames('shadow-none border-1', classes.card)}>
				<div className="p-16 pr-4 flex flex-row items-center justify-between">
					<Typography className="h1 pr-16">Last Orders</Typography>
				</div>

				<table className="simple clickable">
					<thead>
						<tr>
							<th className="text-left">Customers</th>
							<th className="text-left">Items</th>
							<th className="text-left">Total</th>
						</tr>
					</thead>
					<tbody>
						{data.map((row) => (
							<tr key={row.title}>
								<td className="text-left">{row.title}</td>
								<td className="text-left">{row.items}</td>
								<td className="text-left">{row.total}</td>
							</tr>
						))}
					</tbody>
				</table>
			</Card>
		);
	}
}
export default withStyles(styles, { withTheme: true })(LastOrders);
