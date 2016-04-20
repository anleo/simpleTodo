angular
  .module('app', ['ui.router', 'pouchdb'])

  .config(function ($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/');

  $stateProvider.state('app', {
    abstract: true,
    views: {
      '@': {
        templateUrl: 'components/general/layout.html',
        controller: 'mainController'
      },
      'header@app': {
        templateUrl: 'components/general/header.html'
      },
      'footer@app': {
        templateUrl: 'components/general/footer.html'
      }
    }
  });

  $stateProvider.state('app.main', {
    url: '/',
    templateUrl: 'components/main/main.html',
    controller: ''
  });

  $stateProvider.state('app.first', {
    url: '/first',
    template: '<div>First</div>'
  });

  $stateProvider.state('app.second', {
    url: '/second',
    template: '<div>Second</div>'
  });
});
