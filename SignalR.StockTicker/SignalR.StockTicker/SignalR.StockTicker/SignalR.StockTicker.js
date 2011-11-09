/// <reference path="../scripts/jquery-1.6.4.js" />
/// <reference path="../scripts/jquery.signalr.js" />
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

$(function () {

    var ticker = $.connection.stockTicker,
        $stockTable = $("#stockTable"),
        $stockTableBody = $stockTable.find("tbody"),
        rowTemplate = "<tr data-symbol='{Symbol}'><td>{Symbol}</td><td>{Price}</td><td>{DayOpen}</td><td>{DayHigh}</td><td>{DayLow}</td><td>{PercentChange}</td></tr>";

    ticker.updateStockPrice = function (stock) {
        $stockTableBody.find("tr[data-symbol=" + stock.Symbol + "]")
            .replaceWith(rowTemplate.supplant(stock));
    };

    $.connection.hub.start(function () {
        ticker.getAllStocks()
            .done(function (stocks) {
                $stockTableBody.empty();
                $.each(stocks, function () {
                    $stockTableBody.append(rowTemplate.supplant(this));
                });
            });
    });
});