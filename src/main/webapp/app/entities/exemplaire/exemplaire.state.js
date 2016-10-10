(function() {
    'use strict';

    angular
        .module('bibalDenisApp')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider
        .state('exemplaire', {
            parent: 'entity',
            url: '/exemplaire',
            data: {
                authorities: ['ROLE_USER'],
                pageTitle: 'Exemplaires'
            },
            views: {
                'content@': {
                    templateUrl: 'app/entities/exemplaire/exemplaires.html',
                    controller: 'ExemplaireController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
            }
        })
        .state('exemplaire-detail', {
            parent: 'entity',
            url: '/exemplaire/{id}',
            data: {
                authorities: ['ROLE_USER'],
                pageTitle: 'Exemplaire'
            },
            views: {
                'content@': {
                    templateUrl: 'app/entities/exemplaire/exemplaire-detail.html',
                    controller: 'ExemplaireDetailController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
                entity: ['$stateParams', 'Exemplaire', function($stateParams, Exemplaire) {
                    return Exemplaire.get({id : $stateParams.id}).$promise;
                }],
                previousState: ["$state", function ($state) {
                    var currentStateData = {
                        name: $state.current.name || 'exemplaire',
                        params: $state.params,
                        url: $state.href($state.current.name, $state.params)
                    };
                    return currentStateData;
                }]
            }
        })
        .state('exemplaire-detail.edit', {
            parent: 'exemplaire-detail',
            url: '/detail/edit',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/exemplaire/exemplaire-dialog.html',
                    controller: 'ExemplaireDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: ['Exemplaire', function(Exemplaire) {
                            return Exemplaire.get({id : $stateParams.id}).$promise;
                        }]
                    }
                }).result.then(function() {
                    $state.go('^', {}, { reload: false });
                }, function() {
                    $state.go('^');
                });
            }]
        })
        .state('exemplaire.new', {
            parent: 'exemplaire',
            url: '/new',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/exemplaire/exemplaire-dialog.html',
                    controller: 'ExemplaireDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: function () {
                            return {
                                edition: null,
                                etat: null,
                                id: null
                            };
                        }
                    }
                }).result.then(function() {
                    $state.go('exemplaire', null, { reload: 'exemplaire' });
                }, function() {
                    $state.go('exemplaire');
                });
            }]
        })
        .state('exemplaire.edit', {
            parent: 'exemplaire',
            url: '/{id}/edit',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/exemplaire/exemplaire-dialog.html',
                    controller: 'ExemplaireDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: ['Exemplaire', function(Exemplaire) {
                            return Exemplaire.get({id : $stateParams.id}).$promise;
                        }]
                    }
                }).result.then(function() {
                    $state.go('exemplaire', null, { reload: 'exemplaire' });
                }, function() {
                    $state.go('^');
                });
            }]
        })
        .state('exemplaire.delete', {
            parent: 'exemplaire',
            url: '/{id}/delete',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/exemplaire/exemplaire-delete-dialog.html',
                    controller: 'ExemplaireDeleteController',
                    controllerAs: 'vm',
                    size: 'md',
                    resolve: {
                        entity: ['Exemplaire', function(Exemplaire) {
                            return Exemplaire.get({id : $stateParams.id}).$promise;
                        }]
                    }
                }).result.then(function() {
                    $state.go('exemplaire', null, { reload: 'exemplaire' });
                }, function() {
                    $state.go('^');
                });
            }]
        });
    }

})();
