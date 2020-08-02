import React from 'react';
import { TableHead, TableSortLabel, TableCell, TableRow, withStyles } from '@material-ui/core';

const rows = [
	{
		id: 'id',
		align: 'left',
		disablePadding: false,
		label: 'ID',
		sort: true
	},
	{
		id: 'product',
		align: 'left',
		disablePadding: false,
		label: 'Product',
		sort: true
	},
	{
		id: 'price',
		align: 'right',
		disablePadding: false,
		label: 'Price',
		sort: true
	},
	{
		id: 'views',
		align: 'right',
		disablePadding: false,
		label: 'Views',
		sort: true
	}
];

const styles = (theme) => ({
	actionsButtonWrapper: {
		background: theme.palette.background.paper
	}
});

class MostViewedTableHead extends React.Component {
	render() {
		return (
			<TableHead>
				<TableRow className="h-64">
					{rows.map((row) => {
						return (
							<TableCell key={row.id} align={row.align} padding={row.disablePadding ? 'none' : 'default'}>
								<TableSortLabel>{row.label}</TableSortLabel>
							</TableCell>
						);
					}, this)}
				</TableRow>
			</TableHead>
		);
	}
}

export default withStyles(styles, { withTheme: true })(MostViewedTableHead);
