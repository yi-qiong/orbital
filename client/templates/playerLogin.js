import { Template } from 'meteor/templating';
import './playerLogin.html';

Router.route('/playerLogin', {
	template: 'playerLogin'
});

Template.playerLogin.helpers({
 atDisabled: function() {
  return AccountsTemplates.disabled();
 },
 atClass: function() {
  return AccountsTemplates.disabled() ? 'disabled' : 'active';
 }
});
