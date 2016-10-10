(function() {
    'use strict';

    angular
        .module('bibalDenisApp')
        .controller('ReservationDetailController', ReservationDetailController);

    ReservationDetailController.$inject = ['$scope', '$rootScope', '$stateParams', 'previousState', 'entity', 'Reservation', 'Usager', 'Exemplaire'];

    function ReservationDetailController($scope, $rootScope, $stateParams, previousState, entity, Reservation, Usager, Exemplaire) {
        var vm = this;

        vm.reservation = entity;
        vm.previousState = previousState.name;

        var unsubscribe = $rootScope.$on('bibalDenisApp:reservationUpdate', function(event, result) {
            vm.reservation = result;
        });
        $scope.$on('$destroy', unsubscribe);
    }
})();
