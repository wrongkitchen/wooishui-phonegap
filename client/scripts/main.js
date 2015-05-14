/**
*   Main Configuration
*/

'use strict';




document.addEventListener('deviceready', function(){

	var pushNotification = cordova.require("com.pushwoosh.plugins.pushwoosh.PushNotification");
    
 
	document.addEventListener('push-notification', function(event) {
		var notification = event.notification;
		alert(notification.aps.alert);
		pushNotification.setApplicationIconBadgeNumber(0);
	});

    //initialize the plugin
    pushNotification.onDeviceReady({ pw_appid:"01C24-D0542" });
     
    // register for pushes
    pushNotification.registerDevice(
        function(status) {
            var deviceToken = status['deviceToken'];
            console.warn('registerDevice: ' + deviceToken);
        },
        function(status) {
            console.warn('failed to register : ' + JSON.stringify(status));
            alert(JSON.stringify(['failed to register ', status]));
        }
    );
     
    //reset badges on app start
    pushNotification.setApplicationIconBadgeNumber(0);
    
}, false);

require(['FacebookHelper', 'PopupFriendList', 'DebtsCredits'], function(fbh, pfl, dc){
	
	var $$ = Dom7;
	var _sgd = (window.sgd) ? window.sgd : {};
        _sgd.accessToken = window.localStorage.getItem('at');
        _sgd.userUID = window.localStorage.getItem('uid');
		_sgd.framework7 = new Framework7({ 
			pushState: false,
			swipeBackPage: false,
			router: false
		}); 
		var mainView = _sgd.framework7.addView('.view-main', {
			domCache: true
		});
		var route = Backbone.Router.extend({
			routes: {
				'detail/:query' : 'detail',
				'home' 			: 'home',
				'' 				: 'home',
				'form' 			: 'form'
			},
			detail: function(pQuery){
				mainView.router.load({ pageName: 'detail?uid='+pQuery });
			},
			home: function(){
				mainView.router.load({ pageName: 'home' });
			},
			form: function(){
				mainView.router.load({ pageName: 'form' });
			}
		});
		_sgd.route = new route();
		Backbone.history.start();

		_sgd.resetForm = function(){
			$('#otherUserID').val('');
			$('#otherUserName').val('');
			$("#debtForm input[name=itemid]").val('');
			$("#debtForm input[name=callback]").val('');
			$('#debtForm')[0].reset();
		};

		_sgd.changeSection = function(pPath, pParam, pSkipHash){
			if(pPath == 'form-second'){
				if($('#otherUserID').val() === '' && $('#otherUserName').val() === ''){
					_sgd.framework7.alert('Please enter a name / select a wooishui user', ['Name missing']);
					return false;
				}
			} else if(pPath == 'home'){
				_sgd.resetForm();
				_sgd.debtsCredits.credits.fetchDatas();
			}
			var path = pPath;
			if(Array.isArray(pParam)){
				$.each(pParam, function(pIndex, pVal){
					path += '/' + pVal;
				});
			}
			if(pSkipHash)
				mainView.router.load({ pageName: path });
			else
				window.location.hash = '#' + path;
		};

		_sgd.framework7.onPageAfterAnimation('*', function(page){
			if(page.name == 'detail' || page.name == 'form'){
				if(page.container.dataset.nav)
					$('#header').addClass(page.container.dataset.nav);
				else
					$('#header').removeClass();
			}
			if(page.name == 'detail'){
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
					window.location.hash = '';
				}
			} else if(page.name == 'home'){
				_sgd.debtsCredits.clearDetailDatas();
			}
		});
		_sgd.framework7.onPageBeforeAnimation('*', function(page){
			if(page.container.dataset.nav)
				$('#header').addClass(page.container.dataset.nav);
			else
				$('#header').removeClass();
			if(page.name == 'form-second'){
				if($('#otherUserID').val() && $('#otherUserID').val().indexOf('-') === -1){
					$('.debtType .right').html('<img src=\"http://graph.facebook.com/' + $('#otherUserID').val() + '/picture\" alt=\"\" />');
				} else if($('#otherUserName').val()){
					$('.debtType .right').html('<span>' + $('#otherUserName').val() + '</span>');
				} else {
					_sgd.framework7.alert('Please enter a name / select a wooishui user', function(){
						_sgd.changeSection('form');
					});
				}
			} else if(page.name == 'detail'){
				if(page.query.uid.indexOf('-') > -1){
					$('#connectUser').show().data('uid', page.query.uid);
				} else{
					$('#connectUser').hide().data('uid', '');
				}
			}
		});
		$$('#homeDebts').on('refresh', function(e){
			_sgd.debtsCredits.credits.fetchDatas({
				reset: true,
				complete: function(){
					sgd.framework7.pullToRefreshDone();
				}
			});
		});
		_sgd.popupFriendList = new pfl({
			wrapper: '#friendList',
			inviteTarget: '#nonRegFriend',
			friendTarget: '#regFriend',
			getFriendHandler: function(pCallback){
				_sgd.facebookHelper.getFriendList(pCallback);
			},
			getInvitableHandler: function(pCallback){
				_sgd.facebookHelper.getInvitableList(pCallback);
			}
		});
		_sgd.facebookHelper = new fbh(function(){
			_sgd.debtsCredits.credits.fetchDatas();
		});
		_sgd.submitDebt = function(){
			var _q = {
				isCreatorDebt: $('.debtType .middle').hasClass('creatorDebt'),
				price: parseFloat($('#debtForm input[name=price]').val()) || 0,
				desc: $('#debtForm input[name=desc]').val(),
				otherUserID: $('#otherUserID').val(),
				otherUserName: $('#otherUserName').val(),
				itemid: $("#debtForm input[name=itemid]").val(),
				curUser: sgd.userUID
			};
			if(_q.price != ''){
				$.ajax({
					url: _sgd.apiPrefix + '/api/debtsSubmit',
					dataType: 'jsonp',
					data: _q,
					success: function (data) {
						if(data.status){
							if($('#debtForm input[name=callback]').val() != ''){
								_sgd.debtsCredits.credits.fetchDatas();
								Backbone.history.loadUrl(Backbone.history.fragment);
								_sgd.resetForm();
							} else {
								_sgd.changeSection('home');
							}
						}
					}
				});
			} else {
				sgd.framework7.alert('Please fill in an amount', ['Amount missing']);
			}
		};
	
		if(_sgd.accessToken && _sgd.userUID){
			_sgd.debtsCredits = new dc();
			$('.userImageContain').html('<img src="http://graph.facebook.com/' + _sgd.userUID + '/picture" height="50" alt="" />');
		} else {
			window.location.href = "index.html";
		}

	$$('.menu-link').on('click', function () {
		var buttons = [
			{
				text: 'Invite friend',
				onClick: function () {
					facebookConnectPlugin.showDialog({
						method: 'apprequests',
						title : 'wooishui',
						message: 'Lets use wooishui to maintain your debts!',
						filters: ['app_non_users']
					}, function(response){
						
					});
				}
			},
			{
				text: 'Sign Out',
				onClick: function () {
					facebookConnectPlugin.logout(function(){
						window.localStorage.setItem("at", '');
						window.localStorage.setItem("uid", '');
						window.location.href = 'index.html';
					}, function(){
						_sgd.framework7.alert('Logout fail', ['Please try again']);
					});
				}
			}
		];
		_sgd.framework7.actions(buttons);
	});
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
	$("#dataListDetailWrap .icon-plus").on('click', function(){
		var _userUID = $(this).data('uid');
		var _userData = _sgd.debtsCredits.getUserByUID($(this).data('uid')).toJSON();
		var _userName = (_userData.debtorsUID === _userUID) ? _userData.debtorsName : _userData.creditorName;
		$('input#otherUserName').val(_userName);
		$('input#otherUserID').val(_userUID);
		_sgd.changeSection('form-second', false, true);
	});
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
	$('#menu a.internal').on('click', function(){
		_sgd.changeSection($(this).attr('href'));
		_sgd.framework7.closePanel();
		return false;
	});
	$('#inviteFriend').on('opened', function () {
		_sgd.popupFriendList.startLoading();
	});
	$('#friendList').on('opened', function () {
		_sgd.popupFriendList.startLoading();
	});
	$('.friendListSearch').on('input', function(){
		var curText = $(this).val();
		var target = $(this).data('target');
		if(curText != ''){
			var filtered = $(target + ' .item-content').filter(function(pIndex, pEl){
				return $(pEl).find('.item-title').text().indexOf(curText) > -1;
			});
			$(target + ' .item-content').hide();
			filtered.show();
		} else {
			$(target + ' .item-content').show();
		}
	});
});