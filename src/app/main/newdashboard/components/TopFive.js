import React, { Component } from 'react';
import classNames from 'classnames';
import { Card, Typography, withStyles } from '@material-ui/core';

const styles = {
	tableBorder: {
		borderBottom: 'none !important'
	},
	borderNone: {
		border: 'none !important'
	}
};

class TopFive extends Component {
	render() {
		const { classes, top5Data } = this.props;

		return (
			<React.Fragment>
				{top5Data && (
					<div className="flex flex-row">
						{/* top five categories */}
						{top5Data.category &&
						top5Data.category.length > 0 && (
							<div className="widget w-full p-16 pb-32 sm:w-1/2">
								<Card className="shadow-none border-1">
									<table className="simple">
										<thead>
											<tr>
												<th className={classNames('text-left text-18', classes.borderNone)}>
													<div className="flex flex-row items-center">
														<Typography className="h1">
															Top {top5Data.category.length} Categories |
														</Typography>
														<Typography className="text-18 ml-8">This Month</Typography>
													</div>
												</th>
												<th className={classNames('text-right text-18', classes.borderNone)}>
													Total
												</th>
											</tr>
										</thead>
										<tbody>
											{top5Data.category.map((category, index) => (
												<tr key={index}>
													<td className={classNames('text-left', classes.tableBorder)}>
														{category[0]}
													</td>
													<td className={classNames('text-right', classes.tableBorder)}>
														{category[1]}
													</td>
												</tr>
											))}
										</tbody>
									</table>
								</Card>
							</div>
						)}

						{/* top five products */}
						{top5Data.products &&
						top5Data.products.length > 0 && (
							<div className="widget w-full p-16 pb-32 sm:w-1/2">
								<Card className="shadow-none border-1">
									<table className="simple">
										<thead>
											<tr>
												<th className={classNames('text-left text-18', classes.borderNone)}>
													<div className="flex flex-row items-center">
														<Typography className="h1">
															Top {top5Data.products.length} Products |
														</Typography>
														<Typography className="text-18 ml-8">This Month</Typography>
													</div>
												</th>
												<th className={classNames('text-right text-18', classes.borderNone)}>
													Total
												</th>
											</tr>
										</thead>
										<tbody>
											{top5Data.products.map((product, index) => (
												<tr key={index}>
													<td className={classNames('text-left', classes.tableBorder)}>
														{product[0]}
													</td>
													<td className={classNames('text-right', classes.tableBorder)}>
														{product[1]}
													</td>
												</tr>
											))}
										</tbody>
									</table>
								</Card>
							</div>
						)}
					</div>
				)}
			</React.Fragment>
		);
	}
}

export default withStyles(styles, { withTheme: true })(TopFive);
