Please see http://go.microsoft.com/fwlink/?LinkId=272764 for more information on using SignalR.

Running the SignalR sample in your ASP.NET application
------------------------------------------------------
To enable and run the SignalR sample in your application follow these steps:

    1. Create an OWIN startup class in your application if you don't already have one.
         NOTE: For more information on OWIN startup visit http://go.microsoft.com/fwlink/?LinkID=316888
    
    2. Call the Microsoft.AspNet.SignalR.StockTicker.Startup.ConfigureSignalR method included
       in the sample, e.g.:

            using Microsoft.Owin;
            using Owin;

            [assembly: OwinStartup(typeof(MyWebApplication.Startup), "Configuration")]

            namespace MyWebApplication
            {
                public class Startup
                {
                    public void Configuration(IAppBuilder app)
                    {
                        Microsoft.AspNet.SignalR.StockTicker.Startup.ConfigureSignalR(app);
                    }
                }
            }

    3. Browse to ~/SignalR.Sample/StockTicker.html in two browsers and click the Open Market button.