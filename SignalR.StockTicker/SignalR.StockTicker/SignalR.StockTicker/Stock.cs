using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace SignalR.StockTicker.SignalR.StockTicker
{
    public class Stock
    {
        private decimal _price;

        public string Symbol { get; set; }
        
        public decimal DayOpen { get; set; }
        
        public decimal DayLow { get; set; }
        
        public decimal DayHigh { get; set; }

        public decimal Price
        {
            get
            {
                return _price;
            }
            set
            {
                _price = value;
                if (_price < DayLow)
                {
                    DayLow = Price;
                }
                if (_price > DayHigh)
                {
                    DayHigh = _price;
                }
            }
        }

        public decimal PercentChange
        {
            get
            {
                return Math.Round((Price - DayOpen) / Price, 4);
            }
        }
    }
}
