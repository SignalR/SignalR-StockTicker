/// <reference path="../scripts/jquery-1.6.4.js" />
/// <reference path="../scripts/jquery.signalr.js" />
/// <reference path="../scripts/knockout-1.3.0beta.debug.js" />
/// <reference path="../scripts/knockout.mapping-latest.debug.js" />

/*!
SignalR Stock Ticker Sample
*/

// Crockford's supplant method (poor man's templating)
if (!String.prototype.supplant) {
    String.prototype.supplant = function (o) {
        return this.replace(/{([^{}]*)}/g,
            function (a, b) {
                var r = o[b];
                return typeof r === 'string' || typeof r === 'number' ? r : a;
            }
        );
    };
}

// A simple background color flash effect that uses jQuery Color plugin
jQuery.fn.flash = function (color, duration) {
    var that = this;
    that.queue(function () {
        var current = that.css('backgroundColor');
        that.animate({ backgroundColor: 'rgb(' + color + ')' }, duration / 2)
            .animate({ backgroundColor: current }, duration / 2);
        $(this).dequeue();
    });
};

ko.bindingHandlers.flash = {
    update: function (e, v) {
        $(e).flash(ko.utils.unwrapObservable(v()), 1000);
    }
};

$(function () {

    function stockViewModel(data) {
        ko.mapping.fromJS(data, {}, this);

        var up = '▲',
            down = '▼';

        this.CurrentPrice = ko.dependentObservable(function () {
            return this.Price().toFixed(2);
        }, this);
        this.CurrentPercentChange = ko.dependentObservable(function () {
            return (this.PercentChange() * 100).toFixed(2) + '%';
        }, this);
        this.Direction = ko.dependentObservable(function () {
            return this.Change() === 0 ? '' : this.Change() >= 0 ? up : down;
        }, this);
        this.Even = ko.dependentObservable(function () {
            return this.Change() === 0;
        }, this);
        this.Up = ko.dependentObservable(function () {
            return this.Change() > 0;
        }, this);
        this.Down = ko.dependentObservable(function () {
            return this.Change() < 0;
        }, this);
        this.FlashColor = ko.dependentObservable(function () {
            var value = this.LastChange();
            return value === 0 ? '255,216,0' : (value > 0 ? '154,240,117' : '255,148,148');
        }, this);

        this.stockUpdated = function (e) {
            var value = this.LastChange();
            $(e).flash(value === 0 ? '255,216,0' : (value > 0 ? '154,240,117' : '255,148,148'), 1000);
        };

        return this;
    };

    function stockTickerViewModel() {
        var ticker = $.connection.stockTicker,
            self = this;

        ko.mapping.fromJS({ stocks: [] }, {
            'stocks': {
                key: function (data) { return ko.utils.unwrapObservable(data.Symbol); },
                create: function (options) { return new stockViewModel(options.data); }
            }
        }, this);

        function init() {
            return ticker.getAllStocks()
                .done(function (stocks) {
                    ko.mapping.fromJS({ stocks: stocks }, self);
                });
        }

        $.connection.hub.start(function () {
            init().done(function () {
                ticker.getMarketState()
                .done(function (state) {
                    if (state === 'Open') {
                        ticker.marketOpened();
                    } else {
                        ticker.marketClosed();
                    }
                });
            });
        });

        this.tickerVisible = ko.observable(false);

        this.openDisabled = ko.observable(true);
        this.openMarket = function (e) {
            ticker.openMarket();
        };
        this.closeDisabled = ko.observable(true);
        this.closeMarket = function (e) {
            ticker.closeMarket();
        };
        this.resetDisabled = ko.observable(true);
        this.resetTicker = function (e) {
            ticker.reset();
        };

        ticker.updateStockPrice = function (stock) {
            var stockVm = self.stocks().filter(function (s) { return s.Symbol() == stock.Symbol; });
            if (stockVm.length == 0) return;
            ko.mapping.fromJS(stock, stockVm[0]);
        };
        ticker.marketOpened = function () {
            self.openDisabled(true);
            self.closeDisabled(false);
            self.resetDisabled(true);
            self.tickerVisible(true);
            scrollTicker();
        };
        ticker.marketClosed = function () {
            self.openDisabled(false);
            self.closeDisabled(true);
            self.resetDisabled(false);
            self.tickerVisible(false);
            stopTicker();
        };
        ticker.marketReset = function () {
            init();
        };

        var $scrollingTicker = $('#stockTicker ul');
        function scrollTicker() {
            var w = $scrollingTicker.width();
            $scrollingTicker.css({ marginLeft: w });
            $scrollingTicker.animate({ marginLeft: -w }, 15000, 'linear', scrollTicker);
        }
        function stopTicker() {
            $scrollingTicker.stop();
        }

        return this;
    };

    ko.applyBindings(new stockTickerViewModel());
});