(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        define('/App/Location', ['exports', 'Site'], factory);
    } else if (typeof exports !== "undefined") {
        factory(exports, require('Site'));
    } else {
        var mod = {
            exports: {}
        };
        factory(mod.exports, global.Site);
        global.AppLocation = mod.exports;
    }
})(this, function (exports, _Site2) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.getInstance = exports.run = exports.AppLocation = undefined;

    var _Site3 = babelHelpers.interopRequireDefault(_Site2);

    var AppLocation = function (_Site) {
        babelHelpers.inherits(AppLocation, _Site);

        function AppLocation() {
            babelHelpers.classCallCheck(this, AppLocation);
            return babelHelpers.possibleConstructorReturn(this, (AppLocation.__proto__ || Object.getPrototypeOf(AppLocation)).apply(this, arguments));
        }

        babelHelpers.createClass(AppLocation, [{
            key: 'initialize',
            value: function initialize() {
                babelHelpers.get(AppLocation.prototype.__proto__ || Object.getPrototypeOf(AppLocation.prototype), 'initialize', this).call(this);

                this.window = $(window);
                this.$listItem = $('.app-location .page-aside .list-group');
                this.$allFriends = $('.app-location .friend-info');
                this.allFriends = this.getAllFriends();
                this.friendNum = null;

                // states
                this.states = {
                    mapChanged: true,
                    listItemActive: false
                };
            }
        }, {
            key: 'process',
            value: function process() {
                babelHelpers.get(AppLocation.prototype.__proto__ || Object.getPrototypeOf(AppLocation.prototype), 'process', this).call(this);

                this.handleResize();
                this.steupListItem();
                this.steupMapChange();
                this.handleSearch();
            }
        }, {
            key: 'getDefaultState',
            value: function getDefaultState() {
                return Object.assign(babelHelpers.get(AppLocation.prototype.__proto__ || Object.getPrototypeOf(AppLocation.prototype), 'getDefaultState', this).call(this), {
                    mapChange: true,
                    listItemActive: false
                });
            }
        }, {
            key: 'mapChange',
            value: function mapChange(change) {
                if (change) {
                    console.log('map change');
                } else {
                    var friendsInList = [];

                    this.markersInMap = this.markers.getMarkersInMap();
                    for (var i = 0; i < this.allMarkers.length; i++) {
                        if (this.markersInMap.indexOf(i) === -1) {
                            $(this.allFriends[i]).hide();
                        } else {
                            $(this.allFriends[i]).show();
                            friendsInList.push($(this.allFriends[i]));
                        }
                    }

                    this.friendsInList = friendsInList;
                }

                this.states.mapChanged = change;
            }
        }, {
            key: 'listItemActive',
            value: function listItemActive(active) {
                if (active) {
                    this.map.panTo(this.allMarkers[this.friendNum].getLatLng());
                    this.allMarkers[this.friendNum].openPopup();
                } else {
                    console.log('listItem unactive');
                }

                this.states.listItemActived = active;
            }
        }, {
            key: 'getAllFriends',
            value: function getAllFriends() {
                var allFriends = [];

                this.$allFriends.each(function () {
                    allFriends.push(this);
                });

                return allFriends;
            }
        }, {
            key: 'steupListItem',
            value: function steupListItem() {
                var _this2 = this;

                var self = this;

                this.$allFriends.on('click', function () {

                    $('.list-inline').on('click', function (event) {
                        event.stopPropagation();
                    });

                    self.friendNum = self.allFriends.indexOf(this);

                    self.listItemActive(true);
                });

                this.$allFriends.on('mouseup', function () {
                    _this2.listItemActive(false);
                });
            }
        }, {
            key: 'steupMapChange',
            value: function steupMapChange() {
                var _this3 = this;

                this.map.on('viewreset move', function () {
                    _this3.mapChange(true);
                });

                this.map.on('ready blur moveend dragend zoomend', function () {
                    _this3.mapChange(false);
                });
            }
        }, {
            key: 'handleResize',
            value: function handleResize() {
                var _this4 = this;

                this.window.on('resize', function () {
                    _this4.mapbox.handleMapHeight();
                });
            }
        }, {
            key: 'handleSearch',
            value: function handleSearch() {
                var self = this;
                $('.search-friends input').on('focus', function () {
                    $(this).on('keyup', function () {
                        var inputName = $('.search-friends input').val();

                        for (var i = 0; i < self.friendsInList.length; i++) {
                            var friendName = self.friendsInList[i].find('.friend-name').html();

                            if (inputName.length <= friendName.length) {
                                for (var j = 1; j <= inputName.length; j++) {
                                    if (inputName.substring(0, j).toLowerCase() === friendName.substring(0, j).toLowerCase()) {
                                        self.friendsInList[i].show();
                                    } else {
                                        self.friendsInList[i].hide();
                                    }
                                }
                            } else {
                                self.friendsInList[i].hide();
                            }
                        }
                        if (inputName === '') {
                            for (var _i = 0; _i < self.friendsInList.length; _i++) {
                                self.friendsInList[_i].show();
                            }
                        }
                    });
                });
                $('.search-friends input').on('focusout', function () {
                    $(this).off('keyup');
                });
            }
        }]);
        return AppLocation;
    }(_Site3.default);

    var instance = null;

    function getInstance() {
        if (!instance) {
            instance = new AppLocation();
        }
        return instance;
    }

    function run() {
        var app = getInstance();
        app.run();
    }

    exports.AppLocation = AppLocation;
    exports.run = run;
    exports.getInstance = getInstance;
    exports.default = AppLocation;
});