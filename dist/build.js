(function () {
    'use strict';

    angular.module('fs-angular-build',[])
    .service('fsBuild', function ($http, $interval, fsModal, $location, $rootScope) {

        var service = {
            listen: listen
        },
        self = this;

        self.build = {};
        self.newer = false;

        return service;

        function listen(interval) {

            if($location.$$host=='localhost') {
                return;
            }

            $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams, options) {

            	if(self.build.update_priority=='passive' && !toState.onEnter) {
            		if(self.newer) {
            			location.reload(true);
            		}
           		}
            });

            check();

            var interval = interval || 30;
            $interval(check,interval * 1000);
        }

        function check() {
            $http.get("build.json")
            .then(function(response) {
            	var build = response && response.data ? response.data : {};

                if(build.build_date) {
                    build.build_date = new Date(build.build_date);

                    if(self.build.build_date && build.build_date>self.build.build_date) {
                    	self.newer = true;

                    	if(self.build!=build) {
	                    	console.log('Latest Build Date: ' + build.build_date);
	                    }

	                    if(build.update_priority=='confirm') {
	                        fsModal.confirm({   focusOnOpen: false,
	                                            content: 'There is a new version of this app available. Refresh now?',
	                                            ok: function() {
	                                                location.reload(true);
	                                            }});
	                    } else if(build.update_priority=='immediate') {
	                    	location.reload(true);
	                    }
	                }

	                self.build = build;
                }
            })
            .catch(function(e) {});
        }
    });
})();
