import { Template } from 'meteor/templating';
import './login.html';


Template.myLogin.helpers({
 atDisabled: function() {
  return AccountsTemplates.disabled();
 },
 atClass: function() {
  return AccountsTemplates.disabled() ? 'disabled' : 'active';
 }
});