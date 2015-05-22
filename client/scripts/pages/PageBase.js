'use strict';

define('PageBase', function(){
	return Backbone.Model.extend({
		initialize: function(){},
		beforeShow: function(){},
		onShow: function(pParam, next){ next() },
		afterShow: function(){},
		hide: function(){}
	});
});