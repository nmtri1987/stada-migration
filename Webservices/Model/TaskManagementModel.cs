
using RBVH.Stada.Intranet.Biz.Constants;
using RBVH.Stada.Intranet.Biz.Models;

namespace RBVH.Stada.Intranet.Webservices.Model
{
    public class TaskManagementModel
    {
        public int Id { get; set; }
        public UserModel AssignedTo { get; set; }
        public int ItemId { get; set; }
        public string TaskOutcome { get; set; }
        public string Description { get; set; }
        public string Modified { get; set; }

        public TaskManagementModel() { }

        public TaskManagementModel(TaskManagement taskManagement)
        {
            Id = taskManagement.ID;
            if (taskManagement.AssignedTo != null)
            {
                AssignedTo = new UserModel { FirstName = taskManagement.AssignedTo.FirstName, FullName = taskManagement.AssignedTo.FullName, ID = taskManagement.AssignedTo.ID, IsGroup = taskManagement.AssignedTo.IsGroup, LastName = taskManagement.AssignedTo.LastName, UserName = taskManagement.AssignedTo.UserName };
            }
            ItemId = taskManagement.ItemId;
            TaskOutcome = taskManagement.TaskOutcome;
            Description = taskManagement.Description;
            Modified = taskManagement.Modified.ToString(StringConstant.DateFormatddMMyyyyHHmmss);
        }
    }
}
