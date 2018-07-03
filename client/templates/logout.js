import {Template} from 'meteor/templating';
import './logout.html';

Router.route('/logout', {
	template: 'logout'
})

Template.logout.rendered=function(){
  $('.message .close')
  .on('click', function() {
    $(this)
      .closest('.message')
      .transition('fade')
    ;
  })
;
};

