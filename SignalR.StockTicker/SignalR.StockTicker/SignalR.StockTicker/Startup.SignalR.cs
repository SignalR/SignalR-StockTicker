using System.Web.Optimization;
using Owin;

[assembly: Microsoft.Owin.OwinStartup(typeof(SignalR.StockTicker.Startup), "Configuration")]

namespace SignalR.StockTicker
{
    public class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            BundleTable.Bundles.Add(
                new ScriptBundle("~/bundles/jquery")
                    .Include("~/Scripts/jquery-{version}.js"));

            BundleTable.Bundles.Add(
                new ScriptBundle("~/bundles/jquerycolor")
                    .Include("~/Scripts/jquery.color-{version}.js"));

            app.MapSignalR();
        }
    }
}