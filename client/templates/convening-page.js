import {Template} from 'meteor/templating';
import './convening-page.html';


Router.route('/scheduling', {
	template: 'conveningPage'
})


Template.conveningPage.onCreated(function() {
  Template.currentTab = new ReactiveVar("overview"); //new attribute created and ref
});

Template.conveningPage.helpers({
  tab: function() {
    //console.log(Template.currentTab.get()); //getter method for current active tab
    return Template.currentTab.get();
  },
});


Template.conveningPage.events({
  'click .overview': function(event, template) {
    $('.item').removeClass('active');
    $('.overview').addClass('active');
    Template.currentTab.set("overview");
  },
  'click .edit': function(event, template) {
    $('.item').removeClass('active');
    $('.edit').addClass('active');
    Template.currentTab.set("edit");
  },
  'click #at-nav-button': function(){
    Meteor.logout();
    Router.go('/logout');
  },
})
