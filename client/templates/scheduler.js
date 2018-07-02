import {Meteor} from 'meteor/meteor';
import { Template } from 'meteor/templating';
import 'dhtmlx-scheduler/codebase/dhtmlxscheduler.js';
import 'dhtmlx-scheduler/codebase/dhtmlxscheduler.css';
import './scheduler.html';
import {Events} from '../../imports/api/events.js';


$('.ui.dropdown')
  .dropdown()
;//initialise dropdown

Router.route('/scheduling', {
    template: 'scheduler'
    })

Template.scheduler.onCreated(function() { //to disable convening from attaching events
scheduler.config.dblclick_create = false;
scheduler.config.drag_create = false;
});

Template.scheduler.onRendered(function () {
    let container = this.$(".dhx_cal_container")[0];
    scheduler.init(container, new Date(), "week"); //display week view
});

