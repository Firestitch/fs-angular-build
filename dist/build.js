(function () {
    'use strict';

    angular.module('fs-angular-build',[])
    .service('fsBuild', function ($http, $timeout, fsModal, $location) {
        
        var build_date = null;
        var service = {
            listen: listen
        };

        return service;

        function listen(interval) {

            if($location.$$host=='localhost') {
                return;
            }

            var interval = interval || 60;

            $http.get("build.json")
            .then(function(build) {
                if(build.data && build.data.build_date) {
                    var latest_build_date = new Date(build.data.build_date);

                    console.log('Latest Build Date: ' + latest_build_date);

                    if(build_date!==null) {
                        if(build_date<latest_build_date) {
                            fsModal.confirm({ content: 'There is a new version of this app available. Refresh now?',
                                                ok: function() {
                                                    location.reload(true);
                                                }});
                        }
                    }

                    build_date = latest_build_date;
                }
            })
            .catch(function(e) {

            });

            $timeout(function() {
                listen();
            },interval * 1000)
        }
    });
})();
