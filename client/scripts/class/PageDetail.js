'use strict';

define('PageDetail', ['PageBase'], function(pb){

	var _sgd = (window.sgd) ? window.sgd : {};

	return pb.extend({
		initialize: function(){
			$('#connectUser').on('click', function(){
				var fromUID = $(this).data('uid');
				_sgd.popupFriendList.loadUserPicker(function(pToUID){
					if(fromUID && pToUID){
						$.ajax({
							url: _sgd.apiPrefix + '/api/connectUser',
							dataType: 'jsonp',
							data: { from: fromUID, to:pToUID, uid: sgd.userUID },
							success: function (data) {
								if(data.status){
									_sgd.changeSection('home');
								}
							}
						});
					}
				});
			});
			$("#dataListDetailWrap .icon-share").on('click', function(){
				var _this = this;
				var getMessage = function(pSum){
					if(pSum > 0)
						return "Hello, you own me $" + Math.abs(pSum);
					else 
						return "Hello, I own you $" + Math.abs(pSum);
				};
				var buttons = [
					{
						text: 'Line',
						onClick: function () {
							var sum = _sgd.debtsCredits.getSumByUID($(_this).data('uid'));
							console.log("line://msg/text/" + getMessage(sum));
							window.location.href = "line://msg/text/" + getMessage(sum);
						}
					},
					{
						text: 'Whatsapp',
						onClick: function () {
							var sum = _sgd.debtsCredits.getSumByUID($(_this).data('uid'));
							console.log("line://msg/text/" + getMessage(sum));
							window.location.href = "whatsapp://send?text=" + getMessage(sum);
						}
					}
				];
				_sgd.framework7.actions(buttons);
			});
		},
		beforeShow: function(page){
			if(page.query.uid.indexOf('-') > -1){
				$('#connectUser').show().data('uid', page.query.uid);
			} else{
				$('#connectUser').hide().data('uid', '');
			}
		},
		afterShow: function(page){
			if(page.query.uid){
				if(page.query.uid.indexOf('-') > -1){
					$('#connectUser').show().data('uid', page.query.uid);
				} else{
					$('#connectUser').hide().data('uid', '');
				}
				$("#dataListDetailWrap .icon-plus").data('uid', page.query.uid);
				$("#dataListDetailWrap .icon-share").data('uid', page.query.uid);
				_sgd.debtsCredits.loadDetailByUID(page.query.uid);
			} else {
				_sgd.changeSection('home');
			}
		},
		onShow: function(pParam, next){
			_sgd.resetForm();
			_sgd.debtsCredits.credits.fetchDatas();

			next();
		}
	});

});
