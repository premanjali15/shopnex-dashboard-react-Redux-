import React, { Component } from 'react';
import { Table, TableBody, TableCell, TableRow, withStyles } from '@material-ui/core';
import { FuseScrollbars } from '@fuse';
import TopCustomersTableHead from './TopCustomersTableHead';
import classNames from 'classnames';

const styles = (theme) => ({
	tableBorder: {
		border: '1px solid rgba(0, 0, 0, 0.12)'
	}
});

class TopCustomersTable extends Component {
	state = {};

	render() {
		const { classes } = this.props;
		const data = [
			{
				id: 1,
				name: 'Name 1',
				date: '2013/09/27',
				total: 57898
			},
			{
				id: 2,
				name: 'Name 2',
				date: '2013/09/27',
				total: 37890
			},
			{
				id: 3,
				name: 'Name 3',
				date: '2013/09/27',
				total: 20090
			},
			{
				id: 4,
				name: 'Name 4',
				date: '2013/09/27',
				total: 9000
			},
			{
				id: 5,
				name: 'Name 5',
				date: '2013/09/27',
				total: 4500
			}
		];
		return (
			<div className={classNames('w-full flex flex-col', classes.tableBorder)}>
				<div>
					<FuseScrollbars className="flex-grow overflow-x-auto">
						<Table className="min-w-xl" aria-labelledby="tableTitle">
							<TopCustomersTableHead />

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
												{n.name}
											</TableCell>

											<TableCell component="th" scope="row" align="right">
												{n.date}
											</TableCell>

											<TableCell component="th" scope="row" align="right">
												<span>₹</span>
												{n.total}
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
export default withStyles(styles, { withTheme: true })(TopCustomersTable);
