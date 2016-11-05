(function() {
    'use strict';

    angular
        .module('bibalDenisApp')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider
        .state('emprunt', {
            parent: 'entity',
            url: '/emprunt',
            data: {
                authorities: ['ROLE_USER'],
                pageTitle: 'Emprunts'
            },
            views: {
                'content@': {
                    templateUrl: 'app/entities/emprunt/emprunts.html',
                    controller: 'EmpruntController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
            }
        })
        .state('emprunt.return' , {
            parent: 'emprunt',
            url:'/{id}/return',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/emprunt/emprunt-return.html',
                    controller: 'EmpruntReturnController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: ['Emprunt', function(Emprunt) {
                            return Emprunt.get({id : $stateParams.id}).$promise;
                        }],
                        previousState: ["$state", function ($state) {
                            var currentStateData = {
                                name: $state.current.name || 'emprunt',
                                params: $state.params,
                                url: $state.href($state.current.name, $state.params)
                            };
                            return currentStateData;
                        }]
                    }
                }).result.then(function() {
                    $state.go('^', {}, { reload: 'emprunt' });
                }, function() {
                    $state.go('^');
                });
            }]
        })
        .state('emprunt-detail', {
            parent: 'entity',
            url: '/emprunt/{id}',
            data: {
                authorities: ['ROLE_USER'],
                pageTitle: 'Emprunt'
            },
            views: {
                'content@': {
                    templateUrl: 'app/entities/emprunt/emprunt-detail.html',
                    controller: 'EmpruntDetailController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
                entity: ['$stateParams', 'Emprunt', function($stateParams, Emprunt) {
                    return Emprunt.get({id : $stateParams.id}).$promise;
                }],
                previousState: ["$state", function ($state) {
                    var currentStateData = {
                        name: $state.current.name || 'emprunt',
                        params: $state.params,
                        url: $state.href($state.current.name, $state.params)
                    };
                    return currentStateData;
                }]
            }
        })
        .state('emprunt-detail.edit', {
            parent: 'emprunt-detail',
            url: '/detail/edit',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/emprunt/emprunt-dialog.html',
                    controller: 'EmpruntDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: ['Emprunt', function(Emprunt) {
                            return Emprunt.get({id : $stateParams.id}).$promise;
                        }]
                    }
                }).result.then(function() {
                    $state.go('^', {}, { reload: false });
                }, function() {
                    $state.go('^');
                });
            }]
        })
        .state('emprunt.new', {
            parent: 'emprunt',
            url: '/new',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/emprunt/emprunt-dialog.html',
                    controller: 'EmpruntDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: function () {
                            return {
                                dateEmprunt: null,
                                dateRetour: null,
                                id: null
                            };
                        }
                    }
                }).result.then(function() {
                    $state.go('emprunt', null, { reload: 'emprunt' });
                }, function() {
                    $state.go('emprunt');
                });
            }]
        })
        .state('emprunt.edit', {
            parent: 'emprunt',
            url: '/{id}/edit',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/emprunt/emprunt-dialog.html',
                    controller: 'EmpruntDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: ['Emprunt', function(Emprunt) {
                            return Emprunt.get({id : $stateParams.id}).$promise;
                        }]
                    }
                }).result.then(function() {
                    $state.go('emprunt', null, { reload: 'emprunt' });
                }, function() {
                    $state.go('^');
                });
            }]
        })
        .state('emprunt.delete', {
            parent: 'emprunt',
            url: '/{id}/delete',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/emprunt/emprunt-delete-dialog.html',
                    controller: 'EmpruntDeleteController',
                    controllerAs: 'vm',
                    size: 'md',
                    resolve: {
                        entity: ['Emprunt', function(Emprunt) {
                            return Emprunt.get({id : $stateParams.id}).$promise;
                        }]
                    }
                }).result.then(function() {
                    $state.go('emprunt', null, { reload: 'emprunt' });
                }, function() {
                    $state.go('^');
                });
            }]
        });
    }

})();
