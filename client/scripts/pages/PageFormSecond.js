'use strict';

define('PageFormSecond', ['PageBase'], function(pb){

	var _sgd = (window.sgd) ? window.sgd : {};

	return pb.extend({
		beforeShow: function(page){
			if($('#otherUserID').val() && $('#otherUserID').val().indexOf('-') === -1){
				$('.debtType .right').html('<img src=\"http://graph.facebook.com/' + $('#otherUserID').val() + '/picture\" alt=\"\" />');
			} else if($('#otherUserName').val()){
				$('.debtType .right').html('<span>' + $('#otherUserName').val() + '</span>');
			} else {
				_sgd.framework7.alert('Please enter a name / select a wooishui user', function(){
					_sgd.changeSection('form');
				});
			}
		},
		onShow: function(pParam, next){
			if($('#otherUserID').val() === '' && $('#otherUserName').val() === ''){
				_sgd.framework7.alert('Please enter a name / select a wooishui user', ['Name missing']);
				return false;
			}
			next();
		}
	});

});
