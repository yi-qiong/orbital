import {Template} from 'meteor/templating';
import './sidebar.html';


Router.route('/playerPage', {
  template: 'sidebar'
});


Template.sidebar.onCreated(function() {
  Template.currentTab = new ReactiveVar("teams"); //new attribute created and ref
});

Template.sidebar.helpers({
  tab: function() {
    console.log(Template.currentTab.get()); //getter method for current active tab
    return Template.currentTab.get();
  },
});


Template.sidebar.events({
  'click .sports': function(event, template) {
    $('.item').removeClass('active');
    $('.sports').addClass('active');
    Template.currentTab.set("teams");
  },
  'click .availability': function(event, template) {
    $('.item').removeClass('active');
    $('.availability').addClass('active');
    Template.currentTab.set("appointments");
  },
  'click .confirm': function(event, template) {
    $('.item').removeClass('active');
    $('.confirm').addClass('active');
    Template.currentTab.set("confirm");
  },
  'click #at-nav-button': function(){
    Meteor.logout();
    Router.go('/logout');
  },
})
