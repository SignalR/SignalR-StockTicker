using System.Web.Optimization;
using Microsoft.AspNet.SignalR.StockTicker;

[assembly:WebActivator.PostApplicationStartMethod(typeof(AppStart), "ConfigureBundles")]

namespace Microsoft.AspNet.SignalR.StockTicker
{
    public static class AppStart
    {
        public static void ConfigureBundles()
        {
            BundleTable.Bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                "~/Scripts/jquery-{version}.js"));

            BundleTable.Bundles.Add(new ScriptBundle("~/bundles/jquerycolor").Include(
                "~/Scripts/jquery.color-{version}.js"));
        }
    }
}