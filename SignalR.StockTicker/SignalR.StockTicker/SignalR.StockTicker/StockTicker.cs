using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Web;
using SignalR.Hubs;

namespace SignalR.StockTicker.SignalR.StockTicker
{
    public class StockTicker
    {
        private readonly static object _instanceLock = new object();
        private static StockTicker _instance;
        private readonly Dictionary<string, Stock> _stocks = new Dictionary<string, Stock>();
        private readonly double _rangePercent = .01;
        private readonly int _updateInterval = 5000;
        private Timer _timer;
        private readonly object _updateStockPricesLock = new object();
        private bool _updatingStockPrices = false;
        private readonly Random _updateOrNotRandom = new Random();

        private StockTicker()
        {
            LoadDefaultStocks();
            OpenMarket();
        }

        public static StockTicker Instance
        {
            get
            {
                if (_instance == null)
                {
                    lock (_instanceLock)
                    {
                        if (_instance == null)
                        {
                            _instance = new StockTicker();
                        }
                    }
                }
                return _instance;
            }
        }

        public IEnumerable<Stock> GetAllStocks()
        {
            return _stocks.Values;
        }

        private void LoadDefaultStocks()
        {
            new List<Stock>
            {
                new Stock { Symbol = "MSFT", Price = 26.31m, DayOpen = 26.34m, DayHigh = 26.84m, DayLow = 26.28m },
                new Stock { Symbol = "APPL", Price = 404.18m, DayOpen = 400.06m, DayHigh = 404.18m, DayLow = 395.62m },
                new Stock { Symbol = "GOOG", Price = 596.30m, DayOpen = 598.40m, DayHigh = 608.97m, DayLow = 593.87m }
            }.ForEach(stock => _stocks.Add(stock.Symbol, stock));
        }

        private void OpenMarket()
        {
            _timer = new Timer(UpdateStockPrices, null, _updateInterval, _updateInterval);
        }

        private void CloseMarket()
        {
            if (_timer != null)
            {
                _timer.Dispose();
            }
        }

        private void UpdateStockPrices(object state)
        {
            // This function must be re-entrant as it's running as a timer interval handler
            if (_updatingStockPrices)
            {
                return;
            }

            lock (_updateStockPricesLock)
            {
                if (!_updatingStockPrices)
                {
                    _updatingStockPrices = true;

                    foreach (var stock in _stocks.Values)
                    {
                        if (UpdateStockPrice(stock))
                        {
                            BroadcastStockPrice(stock);
                        }
                    }

                    _updatingStockPrices = false;
                }
            }
        }

        private bool UpdateStockPrice(Stock stock)
        {
            // Randomly choose whether to udpate this stock or not
            var r = _updateOrNotRandom.NextDouble();
            if (r > .25)
            {
                return false;
            }

            // Update the stock price by a random factor of the range percent
            var random = new Random((int)Math.Floor(stock.Price));
            var percentChange = random.NextDouble() * _rangePercent;
            var pos = random.NextDouble() > .5;
            var change = Math.Round(stock.Price * (decimal)percentChange, 3);
            change = pos ? change : -change;

            stock.Price += change;
            return true;
        }

        private void BroadcastStockPrice(Stock stock)
        {
            var clients = Hub.GetClients<StockTickerHub>();
            clients.updateStockPrice(stock);
        }
    }
}