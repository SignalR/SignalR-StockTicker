using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

[assembly: System.Web.PreApplicationStartMethod(typeof(SignalR.StockTicker.SignalR.StockTicker.AppStart), "Start")]

namespace SignalR.StockTicker.SignalR.StockTicker
{
    public static class AppStart
    {
        public static void Start()
        {

        }
    }
}