import React, { Component } from 'react';
import classNames from 'classnames';
import { Card, Typography, withStyles } from '@material-ui/core';

const styles = {
	circle: {
		width: '12px',
		height: '12px',
		borderRadius: '50%'
	},
	bgGreen: {
		background: '#4DC2B9'
	},
	bgOrange: {
		background: '#FDC998'
	},
	bgRed: {
		background: '#ED617A'
	},
	tableBorder: {
		borderBottom: 'none !important'
	},
	borderNone: {
		border: 'none !important'
	}
};

class CategoryProducts extends Component {
	render() {
		const { classes } = this.props;
		const topCategories = [
			{
				id: 1,
				name: 'Bansari',
				code: 'UXBD123',
				count: 29
			},
			{
				id: 2,
				name: 'Saree',
				code: 'B7890SD',
				count: 14
			},
			{
				id: 3,
				name: 'Lahenga Choli',
				code: 'CF098TY',
				count: 10
			},
			{
				id: 4,
				name: 'Kurti',
				code: 'DR29SEP',
				count: 4
			},
			{
				id: 5,
				name: 'Western',
				code: 'UXBD123',
				count: 16
			}
		];
		return (
			<div className="flex flex-row">
				<div className="widget w-full p-16 pb-32">
					<Card className="w-full rounded-8 shadow-none border-1">
						<div className="relative p-24 flex flex-row justify-between">
							<div className="flex items-center">
								<div className="flex flex-col">
									<Typography className="h1 sm:h2">Category Products Availability</Typography>
								</div>
							</div>
						</div>
						<div className="px-24 flex flex-row mt-4">
							<div className="flex flex-row items-center mr-20">
								<div className={classNames(classes.circle, classes.bgGreen)} />
								<p className="ml-6">Available</p>
							</div>
							<div className="flex flex-row items-center mr-20">
								<div className={classNames(classes.circle, classes.bgOrange)} />
								<p className="ml-6">Stock Limited</p>
							</div>
							<div className="flex flex-row items-center mr-20">
								<div className={classNames(classes.circle, classes.bgRed)} />
								<p className="ml-6">Unvailable</p>
							</div>
						</div>
						<table className="simple mt-16">
							<thead>
								<tr>
									<th className={classNames('text-left text-18', classes.borderNone)}>Categories</th>
									<th className={classNames('text-center text-18', classes.borderNone)}>Code</th>
									<th className={classNames('text-right text-18', classes.borderNone)}>Status</th>
								</tr>
							</thead>
							<tbody>
								{topCategories.map((category) => (
									<tr key={category.id}>
										<td className={classNames('text-left', classes.tableBorder)}>
											{category.name}
										</td>
										<td className={classNames('text-center', classes.tableBorder)}>
											{category.code}
										</td>
										<td className={classNames('text-right', classes.tableBorder)}>
											<div className="flex items-center justify-end mr-24">
												<div
													className={classNames(
														classes.circle,
														category.count <= 5
															? classes.bgRed
															: category.count <= 15 ? classes.bgOrange : classes.bgGreen
													)}
												/>
											</div>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</Card>
				</div>
			</div>
		);
	}
}

export default withStyles(styles, {})(CategoryProducts);
