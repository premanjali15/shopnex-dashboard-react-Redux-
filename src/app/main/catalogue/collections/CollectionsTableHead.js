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
		align: 'left',
		disablePadding: false,
		label: 'Name',
		sort: false
	},
	{
		id: 'ap/tp',
		align: 'center',
		disablePadding: false,
		label: 'Available Products / Total Products',
		sort: false
	},
	{
		id: 'active',
		align: 'center',
		disablePadding: false,
		label: 'Active',
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

class CollectionsTableHead extends React.Component {
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

export default withStyles(styles, { withTheme: true })(CollectionsTableHead);
