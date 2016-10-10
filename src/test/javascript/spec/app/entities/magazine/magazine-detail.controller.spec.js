'use strict';

describe('Controller Tests', function() {

    describe('Magazine Management Detail Controller', function() {
        var $scope, $rootScope;
        var MockEntity, MockPreviousState, MockMagazine, MockAuteur, MockExemplaire, MockEmprunt;
        var createController;

        beforeEach(inject(function($injector) {
            $rootScope = $injector.get('$rootScope');
            $scope = $rootScope.$new();
            MockEntity = jasmine.createSpy('MockEntity');
            MockPreviousState = jasmine.createSpy('MockPreviousState');
            MockMagazine = jasmine.createSpy('MockMagazine');
            MockAuteur = jasmine.createSpy('MockAuteur');
            MockExemplaire = jasmine.createSpy('MockExemplaire');
            MockEmprunt = jasmine.createSpy('MockEmprunt');
            

            var locals = {
                '$scope': $scope,
                '$rootScope': $rootScope,
                'entity': MockEntity,
                'previousState': MockPreviousState,
                'Magazine': MockMagazine,
                'Auteur': MockAuteur,
                'Exemplaire': MockExemplaire,
                'Emprunt': MockEmprunt
            };
            createController = function() {
                $injector.get('$controller')("MagazineDetailController", locals);
            };
        }));


        describe('Root Scope Listening', function() {
            it('Unregisters root scope listener upon scope destruction', function() {
                var eventType = 'bibalDenisApp:magazineUpdate';

                createController();
                expect($rootScope.$$listenerCount[eventType]).toEqual(1);

                $scope.$destroy();
                expect($rootScope.$$listenerCount[eventType]).toBeUndefined();
            });
        });
    });

});