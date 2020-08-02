import React from 'react';
import { TableHead, TableSortLabel, TableCell, TableRow, withStyles } from '@material-ui/core';

const rows = [
	{
		id: 'id',
		align: 'left',
		disablePadding: false,
		label: 'ID',
		sort: false
	},
	{
		id: 'name',
		align: 'center',
		disablePadding: false,
		label: 'Name',
		sort: false
	},
	{
		id: 'available-products',
		align: 'center',
		disablePadding: false,
		label: 'Available Products',
		sort: false
	},
	{
		id: 'total-products',
		align: 'center',
		disablePadding: false,
		label: 'Total Products',
		sort: false
	},
	{
		id: 'actions',
		align: 'center',
		disablePadding: false,
		label: 'Actions',
		sort: false
	}
];

const styles = (theme) => ({
	actionsButtonWrapper: {
		background: theme.palette.background.paper
	}
});

class CategoriesTableHead extends React.Component {
	state = {
		selectedProductsMenu: null
	};

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

export default withStyles(styles, { withTheme: true })(CategoriesTableHead);
