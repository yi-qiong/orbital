import {Template} from 'meteor/templating';
import './logout.html';

Router.route('/logout', {
	template: 'logout'
})

Template.logout.events({
'click #login': function() {
    Router.go('/playerLogin')
  },
  'click #home': function() {
  	Router.go('/')
  }
});
