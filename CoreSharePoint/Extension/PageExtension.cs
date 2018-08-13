using Microsoft.SharePoint;
using Microsoft.SharePoint.Utilities;
using System.Web;
using System.Web.UI;

namespace RBVH.Core.SharePoint.Extension
{
    public static class PageExtension
    {
        public static void GoBack(this Page currentPage, string defaultPage)
        {
            var sourceUrl = currentPage.Request["SourceUrl"];
            if (string.IsNullOrEmpty(sourceUrl))
                sourceUrl = defaultPage;

            //currentPage.Response.Redirect(sourceUrl);
            SPUtility.Redirect(sourceUrl, SPRedirectFlags.DoNotEndResponse | SPRedirectFlags.Trusted, HttpContext.Current);
        }
    }
}