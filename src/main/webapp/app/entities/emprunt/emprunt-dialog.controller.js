(function() {
    'use strict';

    angular
        .module('bibalDenisApp')
        .controller('EmpruntDialogController', EmpruntDialogController);

    EmpruntDialogController.$inject = ['$timeout', '$scope', '$stateParams', '$uibModalInstance', 'entity', 'Emprunt', 'Usager', 'Exemplaire'];

    function EmpruntDialogController ($timeout, $scope, $stateParams, $uibModalInstance, entity, Emprunt, Usager, Exemplaire) {
        var vm = this;

        vm.emprunt = entity;
        vm.clear = clear;
        vm.datePickerOpenStatus = {};
        vm.openCalendar = openCalendar;
        vm.save = save;
        vm.usagers = Usager.query();
        vm.exemplaires = Exemplaire.query();

        $timeout(function (){
            angular.element('.form-group:eq(1)>input').focus();
        });

        function clear () {
            $uibModalInstance.dismiss('cancel');
        }

        function save () {
            vm.isSaving = true;
            if (vm.emprunt.id !== null) {
                Emprunt.update(vm.emprunt, onSaveSuccess, onSaveError);
            } else {
                Emprunt.save(vm.emprunt, onSaveSuccess, onSaveError);
            }
        }

        function onSaveSuccess (result) {
            $scope.$emit('bibalDenisApp:empruntUpdate', result);
            $uibModalInstance.close(result);
            vm.isSaving = false;
        }

        function onSaveError () {
            vm.isSaving = false;
        }

        vm.datePickerOpenStatus.dateEmprunt = false;
        vm.datePickerOpenStatus.dateRetour = false;

        function openCalendar (date) {
            vm.datePickerOpenStatus[date] = true;
        }
    }
})();
