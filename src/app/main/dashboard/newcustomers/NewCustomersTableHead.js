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
		id: 'name',
		align: 'left',
		disablePadding: false,
		label: 'Name',
		sort: true
	},
	{
		id: 'date',
		align: 'right',
		disablePadding: false,
		label: 'Date',
		sort: true
	},
	{
		id: 'total',
		align: 'right',
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

class NewCustomersTableHead extends React.Component {
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

export default withStyles(styles, { withTheme: true })(NewCustomersTableHead);
