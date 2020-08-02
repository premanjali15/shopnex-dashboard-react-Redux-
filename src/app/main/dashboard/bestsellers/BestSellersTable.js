import React, { Component } from 'react';
import { Table, TableBody, TableCell, TableRow, withStyles } from '@material-ui/core';
import { FuseScrollbars } from '@fuse';
import BestSellersTableHead from './BestSellersTableHead';
import classNames from 'classnames';

const styles = (theme) => ({
	tableBorder: {
		border: '1px solid rgba(0, 0, 0, 0.12)'
	}
});

class BestSellersTable extends Component {
	state = {};

	render() {
		const { classes } = this.props;
		const data = [
			{
				id: 1,
				product: 'Product1',
				price: '1000.00',
				quantity: 5
			},
			{
				id: 2,
				product: 'Product2',
				price: '2000.00',
				quantity: 3
			},
			{
				id: 3,
				product: 'Product3',
				price: '1500.00',
				quantity: 0
			},
			{
				id: 4,
				product: 'Product4',
				price: '3200.00',
				quantity: 5
			},
			{
				id: 5,
				product: 'Product5',
				price: '1300.00',
				quantity: 9
			}
		];
		return (
			<div className={classNames('w-full flex flex-col', classes.tableBorder)}>
				<div>
					<FuseScrollbars className="flex-grow overflow-x-auto">
						<Table className="min-w-xl" aria-labelledby="tableTitle">
							<BestSellersTableHead />

							<TableBody>
								{data.map((n) => {
									return (
										<TableRow
											className="h-64 cursor-pointer"
											role="checkbox"
											tabIndex={-1}
											key={n.id}
										>
											<TableCell component="th" scope="row">
												{n.id}
											</TableCell>

											<TableCell className="truncate" component="th" scope="row">
												{n.product}
											</TableCell>

											<TableCell component="th" scope="row" align="right">
												<span>₹</span>
												{n.price}
											</TableCell>

											<TableCell component="th" scope="row" align="right">
												{n.quantity}
											</TableCell>
										</TableRow>
									);
								})}
							</TableBody>
						</Table>
					</FuseScrollbars>
				</div>
			</div>
		);
	}
}
export default withStyles(styles, { withTheme: true })(BestSellersTable);
