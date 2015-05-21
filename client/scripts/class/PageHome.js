'use strict';

define('PageHome', ['PageBase'], function(pb){

	var _sgd = (window.sgd) ? window.sgd : {};
	var $$ = Dom7;

	return pb.extend({
		initialize: function(){
			
			$$('#homeDebts').on('refresh', function(e){
				_sgd.debtsCredits.credits.fetchDatas({
					reset: true,
					complete: function(){
						sgd.framework7.pullToRefreshDone();
					}
				});
			});

		},
		beforeShow: function(){
			_sgd.debtsCredits.clearDetailDatas();
		},
		onShow: function(pParam, next){
			_sgd.resetForm();
			_sgd.debtsCredits.credits.fetchDatas();

			next();
		}
	});

});
