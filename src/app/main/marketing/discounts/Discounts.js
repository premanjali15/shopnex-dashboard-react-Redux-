import React, { Component } from 'react';
import {
	Paper,
	Button,
	Tabs,
	Tab,
	TextField,
	Icon,
	IconButton,
	Table,
	TableBody,
	TableRow,
	TableCell,
	Switch,
	Checkbox
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { FusePageCarded } from '@fuse';
import { Link } from 'react-router-dom';
import classNames from 'classnames';

const styles = () => ({
	link: {
		textDecoration: 'none',
		'&:hover': {
			textDecoration: 'none !important'
		}
	},
	discountCode: {
		fontSize: 17
	},
	summary: {
		fontSize: 12,
		marginTop: 2
	},
	statusBtn: {
		border: '1px solid #70707053',
		borderRadius: 3,
		width: 100,
		height: 28
	},
	active: {
		background: '#E8FFF2'
	},
	scheduled: {
		background: '#f5dbab'
	},
	expired: {
		background: '#f9a8a8'
	},
	usersDate: {
		fontSize: 16,
		fontWeight: '500'
	},
	pr0: {
		paddingRight: '0px !important'
	},
	tableRow: {
		height: '84px',
		cursor: 'pointer',
		'& td': {
			borderBottom: 'none !important'
		}
	}
});

class Discounts extends Component {
	constructor(props) {
		super(props);
		this.state = {
			tabValue: 0,
			discountCodes: [
				{
					id: 1,
					code: 'WX05MFY9E9RH',
					status: 'active',
					used: 1,
					totalUsers: 10,
					date: 'From Mar 7'
				},
				{
					id: 2,
					code: 'CF05MFY9E9ERT',
					status: 'scheduled',
					used: 3,
					totalUsers: 18,
					date: 'From Jun 12'
				},
				{
					id: 3,
					code: 'SD05MFY9E9TYO',
					status: 'expired',
					used: 0,
					totalUsers: 13,
					date: 'From Aug 18'
				},
				{
					id: 4,
					code: 'SD05MFY9E9TYO',
					status: 'expired',
					used: 11,
					totalUsers: 25,
					date: 'From Dec 18'
				},
				{
					id: 5,
					code: 'YUTIXFY9E9TBN',
					status: 'active',
					used: 78,
					totalUsers: 100,
					date: 'From Aug 6'
				}
			],
			discounts: []
		};
	}

	componentDidMount() {
		this.setState({ discounts: this.state.discountCodes });
	}

	handleTabChange = (e, value) => {
		this.setState({ tabValue: value });

		let { discountCodes } = this.state;
		let data;
		if (value === 0) {
			data = discountCodes;
		} else {
			let key = 'active';
			if (value === 1) key = 'active';
			if (value === 2) key = 'scheduled';
			if (value === 3) key = 'expired';
			let filtered = discountCodes.filter((item) => {
				return item.status === key;
			});
			data = filtered;
		}
		this.setState({ discounts: data });
	};
	handleDiscountClick = (id) => {
		this.props.history.push('/app/discounts/' + id);
	};
	render() {
		const { classes } = this.props;
		const { tabValue, discounts } = this.state;
		return (
			<FusePageCarded
				classes={{
					toolbar: 'p-0',
					header: 'min-h-52'
				}}
				header={
					<div className="w-full p-24 flex items-center justify-between">
						<h1 className="text-20 font-600">Discounts</h1>
						<Button
							className="whitespace-no-wrap"
							variant="contained"
							component={Link}
							to="/app/discounts/new"
						>
							Create Discount
						</Button>
					</div>
				}
				content={
					<div className="px-60 py-32">
						<Paper className="w-full">
							<Tabs
								value={tabValue}
								onChange={this.handleTabChange}
								style={{ borderBottom: '1px solid #f1f1f1' }}
							>
								<Tab label="All" className="py-12" />
								<Tab label="Active" className="py-12" />
								<Tab label="Scheduled" className="py-12" />
								<Tab label="Expired" className="py-12" />
							</Tabs>
							<div className="px-28 py-16">
								<TextField
									id="outlined-name"
									placeholder="Search Discount codes"
									className="w-full"
									margin="normal"
									variant="outlined"
									InputProps={{
										startAdornment: (
											<IconButton>
												<Icon>search</Icon>
											</IconButton>
										),
										style: {
											height: 50
										}
									}}
								/>

								{discounts &&
								discounts.length > 0 && (
									<div className="py-20">
										<Table>
											<TableBody>
												{discounts.map((discount, index) => (
													<TableRow
														className={classes.tableRow}
														key={index}
														onClick={() => this.handleDiscountClick(discount.id)}
													>
														<TableCell align="left" className="pl-0">
															<div className="flex flex-row items-start">
																<Checkbox value="checkbox" className="p-0 mr-12" />
																<div>
																	<p className={classes.discountCode}>
																		{discount.code}
																	</p>
																	<p className={classes.summary}>
																		5% off entire order • For 3 groups of customers
																	</p>
																</div>
															</div>
														</TableCell>
														<TableCell>
															<div
																className={classNames(
																	'flex items-center justify-center font-600 capitalize',
																	classes.statusBtn,
																	discount.status === 'active' && classes.active,
																	discount.status === 'scheduled' &&
																		classes.scheduled,
																	discount.status === 'expired' && classes.expired
																)}
															>
																{discount.status}
															</div>
														</TableCell>
														<TableCell>
															<p className={classes.usersDate}>
																{discount.used}/{discount.totalUsers} used
															</p>
														</TableCell>
														<TableCell>
															<p className={classes.usersDate}>{discount.date}</p>
														</TableCell>
														<TableCell align="right" className={classes.pr0}>
															<Switch value="check" color="secondary" />
														</TableCell>
													</TableRow>
												))}
											</TableBody>
										</Table>
									</div>
								)}
							</div>
						</Paper>
					</div>
				}
				innerScroll
			/>
		);
	}
}

export default withStyles(styles, { withTheme: true })(Discounts);
