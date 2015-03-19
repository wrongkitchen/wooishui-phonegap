'use strict';

define(['CreditView', 'CreditDetailView', 'RejectedView'], function(_creditView, _creditDetailView, _rejectedView){
	var _ctrl = Backbone.Model.extend({

		credits: null,

		creditDetail: null,

		rejectedDetail: null,

		creditDetailView: null,

		rejectedView: null,

		initialize: function(){
			var _this = this;

			var _credits = Backbone.Collection.extend({
				url: sgd.apiPrefix + '/api/debtsCredits'
			});
			_this.credits = new _credits();
			_this.credits.fetchDatas = function(pSetting){
				this.fetch(_.extend({ 
					dataType: 'jsonp', 
					data:{ uid: sgd.userUID } 
				}, pSetting));
			};
			_this.credits.fetchDatas();


			var creditsDetail = new Backbone.Collection();
			_this.creditsDetail = creditsDetail;
			var rejectedDetail = new Backbone.Collection();
			_this.rejectedDetail = rejectedDetail;


			var creditView = new _creditView({
				credits: _this.credits
			});
			creditView.comparator = 'createdAt';

			var creditDetailView = new _creditDetailView({
				credits: creditsDetail,
				rejectItemCallback: function(pObj){
					rejectedDetail.add(pObj);
				}
			});
			creditDetailView.comparator = 'createdAt';
			_this.creditDetailView = creditDetailView;

			var rejectedView = new _rejectedView({
				credits: rejectedDetail,
				acceptItemCallback: function(pObj){
					creditsDetail.add(pObj);
				}
			});
			rejectedView.comparator = 'createdAt';
			_this.rejectedView = rejectedView;
		},

		loadDetailByUID: function(pUID){
			var _this = this;
			var modelCredits = _this.credits.where({ creditorUID : pUID });
			var modelDebts = _this.credits.where({ debtorsUID : pUID });
			var allModel = modelCredits.concat(modelDebts);
			
			_this.creditsDetail.reset();
			_this.rejectedDetail.reset();

			if(allModel.length <= 0){
				$(_this.creditDetailView.wrapper).hide();
				$(_this.rejectedView.wrapper).hide();
				$('#dataListDetailError').show();
				$('#connectUser').hide();
			} else {
				var rejected = [];
				var normal = [];
				$.each(allModel, function(pIndex, pVal){
					if(pVal.get('reject'))
						rejected.push(pVal)
					else 
						normal.push(pVal);
				});
				if(normal.length){
					_this.creditsDetail.add(normal);
					$(_this.creditDetailView.wrapper).show();
				} else {
					$(_this.creditDetailView.wrapper).hide();
				}
				if(rejected.length){
					_this.rejectedDetail.add(rejected);
					$(_this.rejectedView.wrapper).show();
				} else {
					$(_this.rejectedView.wrapper).hide();
				}
			}
		},

		clearDetailDatas: function(){
			this.creditDetailView.$el.empty();
			this.rejectedView.$el.empty();
		}

	});

	return _ctrl;
});