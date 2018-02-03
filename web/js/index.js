mdc.ripple.MDCRipple.attachTo(document.querySelector('.mdc-need-ripple'));

new mdc.textField.MDCTextField(document.getElementById('tf-box-example'));
new mdc.textField.MDCTextField(document.querySelector('.description-of-new-goal'));

var newGoalDialog = new mdc.dialog.MDCDialog(document.querySelector('#new-goal-dialog'));


var snackbar = mdc.snackbar.MDCSnackbar.attachTo(document.querySelector('#mdc-align-start-js-snackbar'));

var MDCDialog = mdc.dialog.MDCDialog;
var MDCDialogFoundation = mdc.dialog.MDCDialogFoundation;
var util = mdc.dialog.util;

$('.new-goal-button').on('click', function() {
	newGoalDialog.show();
});


var submitNewGoal = function() {
	var name = document.getElementById('tf-box');
	var description = document.getElementById('textarea');
	var where = document.querySelector('.mdc-select__surface');
	console.log(name.value);
	console.log(description.value);
	console.log(where.value);
	name.value = '';
	description.value = '';
	where.value = '';
	snackbar.show({
		message: 'Goal Created',
		actionText: 'Close',
		actionHandler: function() {
		}
	});
}