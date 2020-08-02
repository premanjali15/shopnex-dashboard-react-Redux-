import React, { Component } from 'react';
import { TableHead, TableSortLabel, TableCell, TableRow, Tooltip, withStyles } from '@material-ui/core';

const rows = [
	{
		id: 'id',
		align: 'left',
		disablePadding: false,
		label: 'ID',
		sort: true
	},
	{
		id: 'status',
		align: 'center',
		disablePadding: false,
		label: 'Status',
		sort: true
	},
	{
		id: 'customer',
		align: 'center',
		disablePadding: false,
		label: 'Customer',
		sort: true
	},
	{
		id: 'placed-on',
		align: 'center',
		disablePadding: false,
		label: 'Placed On',
		sort: true
	},
	{
		id: 'paid',
		align: 'center',
		disablePadding: false,
		label: 'Paid',
		sort: true
	},
	{
		id: 'total',
		align: 'center',
		disablePadding: false,
		label: 'Total',
		sort: true
	}
];

const styles = (theme) => ({
	actionsButtonWrapper: {
		background: theme.palette.background.paper
	}
});

class OrdersTableHead extends Component {
	createSortHandler = (property) => (event) => {
		this.props.onRequestSort(event, property);
	};

	render() {
		const { order, orderBy } = this.props;

		return (
			<TableHead>
				<TableRow className="h-64">
					{rows.map((row) => {
						return (
							<TableCell
								key={row.id}
								align={row.align}
								padding={row.disablePadding ? 'none' : 'default'}
								sortDirection={orderBy === row.id ? order : false}
							>
								{row.sort && (
									<Tooltip
										title="Sort"
										placement={row.align === 'right' ? 'bottom-end' : 'bottom-start'}
										enterDelay={300}
									>
										<TableSortLabel
											active={orderBy === row.id}
											direction={order}
											onClick={this.createSortHandler(row.id)}
										>
											{row.label}
										</TableSortLabel>
									</Tooltip>
								)}
							</TableCell>
						);
					}, this)}
				</TableRow>
			</TableHead>
		);
	}
}

export default withStyles(styles, { withTheme: true })(OrdersTableHead);
