'use strict';

define('PageForm', ['PageBase'], function(pb){

	var _sgd = (window.sgd) ? window.sgd : {};

	return pb.extend({
		initialize: function(){
			$('.debtType .left').on('click', function(){
				$('.debtType .middle').addClass('creatorDebt');
			});
			$('.debtType .right').on('click', function(){
				$('.debtType .middle').removeClass('creatorDebt');
			});
			$('.debtType .middle').on('click', function(){
				if($(this).hasClass('creatorDebt'))
					$(this).removeClass('creatorDebt');
				else 
					$(this).addClass('creatorDebt');
			});
		}
	});
});
