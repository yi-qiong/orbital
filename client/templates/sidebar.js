import {Template} from 'meteor/templating';
import './sidebar.html';


Router.route('/sports', {
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
  'click .teams': function(event, template) {
    $('.availability').removeClass('active');
    $('.teams').addClass('active');
    Template.currentTab.set("teams");
  },
  'click .availability': function(event, template) {
    $('.teams').removeClass('active');
    $('.availability').addClass('active');
    Template.currentTab.set("availability");
    Router.go('/availability')
  },

})
