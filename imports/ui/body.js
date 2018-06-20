import { Template } from 'meteor/templating';

import { Teams } from '../api/teams.js';

import './body.html';

Template.body.onCreated( function() {	
  	Template.currentTab = new ReactiveVar( "sportslist" ); //new attribute created and ref
    isConfirmed = new ReactiveVar (false);
    console.log(isConfirmed);
});

Template.body.helpers({
  	tab: function() {
    	console.log(Template.currentTab.get()); //getter method for current active tab
  		return Template.currentTab.get();
  	},
});

Template.sportslist.helpers({
  	sports: function() {
  		return Teams.find();
  	},
});

Template.body.events({
	'click .sportslist':function(event, template){
    	$('.availability').removeClass('active');
        $('.sportslist').addClass('active');
        Template.currentTab.set( "sportslist" );
    },
    'click .availability':function(event, template){
    	$('.sportslist').removeClass('active');
        $('.availability').addClass('active');
        Template.currentTab.set( "availability" );
    },
	
})

Template.sport.helpers({
  confirmed: function(){
    console.log(isConfirmed);
    return isConfirmed;
  }
})

Template.sport.events({
	'click .item':function(){
		Teams.update(this._id, {
      		$set: { active: ! this.active },
    });

		//currentItem = event.target;
    	//$(currentItem).toggleClass('active');
    	//if ($(currentItem).hasClass('active')){
    		//Teams.insert({
    			//name: $(currentItem).text(),
    		//})		//add to Teams collection 
    	//};
    	//console.log(Teams.find().fetch());
  },
})

Template.sportslist.events({
	'click .button':function(event, instance){
 		isConfirmed.set(true);
    console.log(isConfirmed);
  },
})

