import {Meteor} from 'meteor/meteor';

Router.route('/', {
	template: 'mainpage'
})

Template.mainpage.events({
	'click .playerUse': function() {
		Router.go('/playerLogin');
	},

	'click .conveningUse': function() {
		Router.go('/conveningLogin');
	}
})
