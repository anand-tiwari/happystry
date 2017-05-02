'use strict';

/**
 * services/auth.service.js
 * ===========
 * This service is created to use provide service to AuthService controller.
 *
 * @class Happystry.services.AuthService
 * @author Anand Tiwari <anand.tiwari@appinessworld.com>
 */
angular.module('Happystry.services')
    .factory('LoginService', function ($http, Settings,$state, $log, $q, $rootScope, ezfb) {
        function getLogin() {
            console.log('called Login');
            //var deferred = $q.defer();
            ezfb.login(function (response, status) {
                /*deferred.resolve({
                    status: status,
                    data: response.authResponse
                })*/
                if (response.authResponse) {
                    updateLoginStatus(updateApiMe);
                }
            }, function (response, status, headers, config) {
                /*deferred.reject({
                    status: status,
                    data: response.authResponse
                });*/
            });
            //return deferred.promise;
        };
        function updateLoginStatus(more) {
            console.log('called update login')
            ezfb.getLoginStatus(function (res) {
                var loginStatus = res;
                (more || angular.noop)();
            });
        }

        function updateApiMe() {
            ezfb.api('/me', {
                fields: 'name, gender'
            }, function (res) {
                var apiMe = res;
                $http({
                    method: "post",
                    url: Settings.BASE_URL + 'user/',
                    data: {
                        id: res.id,
                        name: res.name,
                        gender: res.gender,
                    },
                    headers: {'Content-Type': 'application/json', 'HAPPI-API-KEY': 'TRR36-PDTHB-9XBHC-PPYQK-GBPKQ'}
                }).success(function (data) {
                    if (data.message == 'success') {
                        ezfb.api(
                            "/me/friends",
                            function (response) {
                               var friends = response.data;
                                var user_id = data.user_id;
                                console.log("Login Success  !!!");
                               $state.go('timeline');
                                return 1;
                               /* $http({
                                    method: "post",
                                    url: Settings.BASE_URL + 'user/friends_list',
                                    data: {
                                        friends: friends,
                                        user_id: user_id,
                                    },
                                    headers: {'Content-Type': 'application/json', 'HAPPI-API-KEY': api_key}
                                }).success(function (data) {
                                    var userData = data.user_welcome;
                                    if (userData) {
                                        jQuery.fancybox({
                                            'href': '#contactInfo',
                                            'closeBtn': false,
                                            keys: {
                                                close: null
                                            }
                                        });
                                        angular.element('body').find('#contactInfo').parents('.fancybox-wrap .fancybox-outer').siblings('a').addClass('aa');
                                        return false;
                                    } else {
                                        console.log("Login Success  !!!");
                                        /!*var id = $localStorage.happystryUrl.substr($localStorage.happystryUrl.lastIndexOf('/') + 1);
                                         if ($localStorage.happystryUrl.indexOf('postdetails') > -1) {
                                         $window.location.href = api_url + "#/postdetails/" + id;
                                         $window.location.reload();
                                         } else if ($localStorage.happystryUrl.indexOf('profile') > -1) {
                                         $window.location.href = api_url + "#/profile/" + id;
                                         $window.location.reload();
                                         } else {
                                         $window.location.href = api_url + "#/timeline";
                                         }*!/
                                    }
                                });*/
                            });
                    } else {
                        if (data.type == 'user blocked') {
                            jQuery.fancybox({
                                'href': '#user-blocked',
                                'closeBtn': true,
                                keys: {
                                    close: null
                                }
                            });
                        }
                    }
                });
            });
            return;
        }

        return {
            getLogin: getLogin
        };

    });