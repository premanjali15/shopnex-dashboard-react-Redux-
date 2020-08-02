import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@material-ui/core';

export const ShowDialog = (props) => {
	return (
		<Dialog open={props.open} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
			<DialogTitle id="alert-dialog-title">Are you sure! you want to delete it?</DialogTitle>
			<DialogContent>
				<DialogContentText id="alert-dialog-description">
					{props.message ? props.message : 'After delete you may not get this back.'}
				</DialogContentText>
			</DialogContent>
			<DialogActions>
				<Button onClick={props.closeDeleteDialog} color="primary">
					CANCEL
				</Button>
				<Button
					onClick={props.deleteDialogFunction}
					color="primary"
					autoFocus
					disabled={props.deleting !== 'deleted' && props.deleting}
				>
					{props.deleting ? 'Deleting...' : 'Delete'}
				</Button>
			</DialogActions>
		</Dialog>
	);
};
