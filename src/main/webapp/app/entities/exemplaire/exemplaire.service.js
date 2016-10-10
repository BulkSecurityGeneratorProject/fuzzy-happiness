(function() {
    'use strict';
    angular
        .module('bibalDenisApp')
        .factory('Exemplaire', Exemplaire);

    Exemplaire.$inject = ['$resource'];

    function Exemplaire ($resource) {
        var resourceUrl =  'api/exemplaires/:id';

        return $resource(resourceUrl, {}, {
            'query': { method: 'GET', isArray: true},
            'get': {
                method: 'GET',
                transformResponse: function (data) {
                    if (data) {
                        data = angular.fromJson(data);
                    }
                    return data;
                }
            },
            'update': { method:'PUT' }
        });
    }
})();
