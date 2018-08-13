using Microsoft.SharePoint;
using Microsoft.SharePoint.Administration;
using RBVH.Stada.Intranet.Biz.DataAccessLayer;
using RBVH.Stada.Intranet.HotFixes.CalendarList;
using RBVH.Stada.Intranet.HotFixes.Helper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RBVH.Stada.Intranet.HotFixes
{
    class Program
    {
        static void Main(string[] args)
        {
            //string siteUrl = "";
            //Console.Write("Site Url: ");
            //siteUrl = Console.ReadLine();

            //Console.WriteLine();
            //Console.Write("Waiting...");

            ////AddNewColToList.AddPermissionModuleCategoryVNToList(siteUrl);

            //Console.WriteLine();
            //Console.Write("Press any key to exit...");
            //Console.Read();

            //siteUrl = Console.ReadLine();

            //AddNewColToList.AddDelegatedByColToList(siteUrl);

            //AddNewColToList.AddCommonCommentToVehicleManagement(siteUrl);
            //AddNewColToList.AddShiftRequiredColToList(siteUrl);
            //AddNewColToList.AddColForSortToList(siteUrl);
            //AddNewColToList.UpdateColForSortData(siteUrl);
            //CalendarHelper.ChangeFillInChoices(siteUrl);
            //TaskListHelper.UpdateTypeOfDateTime(siteUrl);

            //AddNewColToList.AddCommonLocationToList(siteUrl);
            //AddNewColToList.AddCommonMultiLocationToList(siteUrl);

            //ServiceHelper.UpdateCustomWCF();

            //MoveData.MoveDateUserToMultiUser(siteUrl, "Business Trip Management", "CommonApprover1", "CommonApprover1Multi");
            //MoveData.MoveDateUserToMultiUser(siteUrl, "Business Trip Management", "CommonApprover2", "CommonApprover2Multi");
            //MoveData.MoveDateUserToMultiUser(siteUrl, "Business Trip Management", "CommonApprover3", "CommonApprover3Multi");
            //MoveData.MoveDateUserToMultiUser(siteUrl, "Business Trip Management", "CommonApprover3", "CommonApprover4Multi");


            

            string SiteUrl = "http://windev1442";
            var listName = "OvertimeManagement";
            var listUrl = "";
            var result = new List<int>();
            using (SPSite site = new SPSite(SiteUrl))
            {
                using (SPWeb web = site.OpenWeb())
                {
                    //SPList list = spWeb.GetList($"{spWeb.Url}/Lists/{listName}");

                    //var query = $@"<Where>
                    //            <And>
                    //                <Eq>
                    //                    <FieldRef Name='CommonDepartment' LookupId='TRUE'/>
                    //                    <Value Type='Lookup'>5</Value>
                    //                </Eq>
                    //                <Or>
                    //                    <And>
                    //                        <IsNotNull>
                    //                            <FieldRef Name='CommonApprover2' LookupId='TRUE' />
                    //                        </IsNotNull>
                    //                        <Eq>
                    //                            <FieldRef Name='FirstApprovedDate' />
                    //                            <Value IncludeTimeValue='FALSE' Type='DateTime'>2018-08-11 15:10:56</Value>
                    //                        </Eq>
                    //                    </And>
                    //                    <And>
                    //                        <Or>
                    //                            <Eq>
                    //                                <FieldRef Name='ApprovalStatus' />
                    //                                <Value Type='Text'>true</Value>
                    //                            </Eq>
                    //                            <Eq>
                    //                                <FieldRef Name='ApprovalStatus' />
                    //                                <Value Type='Text'>false</Value>
                    //                            </Eq>
                    //                        </Or>
                    //                        <And>
                    //                            <IsNotNull>
                    //                                <FieldRef Name='CommonApprover1' LookupId='TRUE' />
                    //                            </IsNotNull>
                    //                            <Eq>
                    //                                <FieldRef Name='Modified' />
                    //                                <Value IncludeTimeValue='FALSE' Type='DateTime'>2018-08-11 15:10:56</Value>
                    //                            </Eq>
                    //                        </And>
                    //                    </And>
                    //                </Or>
                    //            </And>
                    //        </Where>";
                    var spQuery = new SPQuery
                    {
                        Query = query
                    };


                    var itemCollection = list.GetItems(spQuery);

                    foreach (SPListItem item in itemCollection)
                    {
                        item.Delete();
                    }
                }
            }

        }
    }
}
