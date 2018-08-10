import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import './availability.html';
import '../../both/availabilityTable.js';
import { $ } from 'meteor/jquery';
import dataTablesBootstrap from 'datatables.net-bs';
import 'datatables.net-bs/css/dataTables.bootstrap.css';
dataTablesBootstrap(window, $);

Template.appointments.onCreated(function() {
  this.autorun(() => {
    this.subscribe('availability');
  });
});

Template.appointments.rendered = function() {
	if (Meteor.user().submitConfirmation) {
  		console.log('confirm');
  		var table = $('#atable').DataTable();
  		console.log(table);
  		table.columns(3).visible( false );
	}
}

