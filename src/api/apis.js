import req from "./https";

// 全域 api 掛載於 Vue.prototype
// 使用方式 this.$api
// api 命名原則 首字大寫爾後駝峰
const api = {
  // Login
  GetAdminToken(params) {
    return req("get", "Login/GetAdminToken", params);
  },
  PostAdminToken(params) {
    return req("post", "Login/PostAdminToken", params);
  },
  GetInfoByToken(params) {
    return req("get", "Login/GetInfoByToken", params);
  },
  GetNavigationBar(params) {
    return req("get", "Permission/GetNavigationBar", params);
  },
  RefreshToken(params) {
    return req("get", "Login/RefreshToken/api/RefreshToken", params);
  },
  GetAdminTokenAll(params) {
    return req("get", "Login/GetAdminTokenAll", params);
  },

  // Roles
  GetRoles(params) {
    return req("get", "Role/Get", params);
  },
  GetAllRoles() {
    return req("get", "Role/GetRoles");
  },
  DeleteRole(params) {
    return req("delete", "Role/Delete", params);
  },
  SearchRoles(params) {
    return req("get", "Role/Get", params);
  },
  AddRole(params) {
    return req("post", "Role/Post", params);
  },
  EditRole(params) {
    return req("put", "Role/put", params);
  },

  // AdminUsers
  GetAdminUsers(params) {
    return req("get", "AdminUser/Get", params);
  },
  AddAdminUser(params) {
    return req("post", "AdminUser/Post", params);
  },
  DeleteAdminUser(params) {
    return req("delete", "AdminUser/Delete", params);
  },
  GetAdminUserById(params) {
    return req("get", "AdminUser/GetAdminUserById", params);
  },
  EditAdminUserById(params) {
    return req("put", "AdminUser/Put", params);
  },
  GetAdminUserByKey(params) {
    return req("get", "AdminUser/GetAdminUserByKey", params);
  },
  GetTopUnit(params) {
    return req("get", "AdminUser/GetTopUnit", params);
  },
  // Authority
  GetAuthority(params) {
    return req("get", "Permission/GetPermissionTree", params);
  },
  GetPermissionByRid(params) {
    return req("get", "Permission/GetPermissionIdByRoleId", params);
  },
  EditPermissionByRid(params) {
    return req("post", "Permission/Assign", params);
  },

  // School
  GetUsers(params) {
    return req("get", "School/GetUsers", params);
  },
  GetOrg() {
    return req("get", "School/GetUnits");
  },
  GetUnits() {
    return req("get", "School/GetUnitList");
  },

  // Calendar EventType
  GetEventType() {
    return req("get", "EventType/GetList");
  },
  SearchEventType(params) {
    return req("get", "EventType/Get", params);
  },
  AddEventType(params) {
    return req("post", "EventType/Post", params);
  },
  DeleteEventType(params) {
    return req("delete", "EventType/Delete", params);
  },
  EditEventType(params) {
    return req("put", "EventType/Put", params);
  },

  //  Calendar Event
  GetEventsPage(params) {
    return req("get", "CalendarEvent/Get", params);
  },
  AddEvent(params) {
    return req("post", "CalendarEvent/Post", params);
  },
  PutEvent(params) {
    return req("put", "CalendarEvent/Put", params);
  },
  DelEvent(params) {
    return req("delete", "CalendarEvent/Delete", params);
  },
  EditEvent(params) {
    return req("put", "CalendarEvent/Put", params);
  },
  DeleteEvent(params) {
    return req("delete", "CalendarEvent/Delete", params);
  },
  SearchEvent(params) {
    return req("get", "CalendarEvent/Get", params);
  },
  CheckUserHasEvent(params) {
    return req("get", "CalendarEvent/CheckUserHasEvent", params);
  },
  GetEventById(params) {
    return req("get", "CalendarEvent/GetById/Id", params);
  },
  GetJoinUserByEventIds(params) {
    return req("get", "CalendarEvent/GetJoinUserByEventIds", params);
  },
  ChangeMember(params) {
    return req("get", "CalendarEvent/ReplaceJoinUser", params);
  },

  // upload
  UploadPic() {
    return req("get", "/images/Upload/Pic");
  },
  UploadFiles() {
    return req("get", "/images/Upload/Files");
  },

  // download
  DownloadExcel() {
    return req("get", "CalendarEvent/GetCalendarExcel");
  },

  //Form
  GetForm(params) {
    return req("get", "Form/Get", params);
  },
  GetFormNoPage() {
    return req("get", "Form/GetList");
  },
  GetFormById(params) {
    return req("get", "Form/GetById/Id", params);
  },
  PostForm(params) {
    return req("post", "Form/Post", params);
  },
  PutForm(params) {
    return req("put", "Form/Put", params);
  },
  DeleteForm(params) {
    return req("delete", "Form/Delete", params);
  },

  //Activity

  GetActivityExcel(params) {
    return req("get", "Activity/GetActivityExcel", params);
  },
  GetActivityExcelList(params) {
    return req("get", "Activity/GetActivityExcelList", params);
  },
  GetActivityById(params) {
    return req("get", "Activity/GetActivityById", params);
  },
  GetActivity(params) {
    return req("get", "Activity/Get", params);
  },
  PostActivity(params) {
    return req("post", "Activity/Post", params);
  },
  PutActivity(params) {
    return req("put", "Activity/Put", params);
  },
  DeleteActivity(params) {
    return req("delete", "Activity/Delete", params);
  },
  GetActivityFlow(params) {
    return req("get", "ActivityRegisterFlow/GetActivityFlow", params);
  },
  GetActivityFlowLog(params) {
    return req("get", "ActivityRegisterFlow/GetActivityFlowLog", params);
  },
  CancelFlowStatusBySelf(params) {
    return req(
      "post",
      "ActivityRegisterFlow/CancelFlowStatusBySelf?actId=" + params.actId
    );
  },
  GetActivityFlowByActId(params) {
    return req("get", "ActivityRegisterFlow/GetActivityFlowByActId", params);
  },
  PostBatchJoinTime(params) {
    return req(
      "post",
      "ActivityRegister/PostBatchJoinTime?jointime=" + params.jointime,
      params.list
    );
  },
  ImportActExcel(params) {
    return req(
      "post",
      "ActivityRegister/ImportActExcel/xlsx?ActId=" + params.ActId,
      params
    );
  },
  SetActivityFlowStatusById(params) {
    return req(
      "post",
      "ActivityRegisterFlow/SetActivityFlowStatusById",
      params
    );
  },
  SetActivityById(params) {
    return req("post", "Activity/SetActivityById?id=" + params.id);
  },
  GetRegisterJoinData(params) {
    return req("get", "ActivityRegister/GetRegisterJoinData", params);
  },
  GetActivityReportExcel(params) {
    return req("get", "Activity/GetActivityReportExcel", params);
  },
  //IndividualStatementModule
  GetIndividualStatementModuleNoPage() {
    return req("get", "IndividualStatementModule/GetList");
  },
  GetIndividualStatementModule(params) {
    return req("get", "IndividualStatementModule/Get", params);
  },
  PostIndividualStatementModule(params) {
    return req("post", "IndividualStatementModule/Post", params);
  },
  PutIndividualStatementModule(params) {
    return req("put", "IndividualStatementModule/Put", params);
  },
  DeleteIndividualStatementModule(params) {
    return req("delete", "IndividualStatementModule/Delete", params);
  },

  //CertificateTemp
  GetCertificateTempNoPage() {
    return req("get", "CertificateTemp/GetCertificateTempList");
  },
  GetCertificateTemp(params) {
    return req("get", "CertificateTemp/Get", params);
  },
  GetCertificateContentById(params) {
    return req("get", "CertificateTemp/GetCertificateTempById", params);
  },
  PostCertificateTemp(params) {
    return req("post", "CertificateTemp/Post", params);
  },
  PutCertificateTemp(params) {
    return req("put", "CertificateTemp/Put", params);
  },
  DeleteCertificateTemp(params) {
    return req("delete", "CertificateTemp/Delete", params);
  },

  //Member
  GetMemberNoPage() {
    return req("get", "Member/GetList");
  },

  //ActivityRegister
  //http://enroll.wzu.edu.tw/api/ActivityRegister/OutputSignExcel?actId=1
  //http://enroll.wzu.edu.tw/api/ActivityRegister/SetNo
  SetNo(params) {
    return req("post", "ActivityRegister/SetNo", params);
  },
  OutputSignExcel(params) {
    return req("get", "ActivityRegister/OutputSignExcel", params);
  },
  PostAndSendMail(params) {
    return req("post", "ActivityRegister/PostAndSendMail", params);
  },
  SendMail(params) {
    return req("get", "ActivityRegister/SendMail", params);
  },
  OtherCheckIn(params) {
    return req(
      "post",
      "ActivityRegister/OtherCheckIn?ActivityId=" +
        params.ActivityId +
        "&account=" +
        params.account +
        "&type=" +
        params.type
    );
  },
  GetRegisterReportData(params) {
    return req("get", "ActivityRegister/GetRegisterReportData", params);
  },
  PostActivityRegister(params) {
    return req("post", "ActivityRegister/Post", params);
  },
  PostActivityRegisterNoEmail(params) {
    return req("post", "ActivityRegister/SetRegisterNo", params);
  },
  PutActivityRegister(params) {
    return req("put", "ActivityRegister/Put", params);
  },
  GetActivityRegisterById(params) {
    return req("get", "ActivityRegister/GeRegisterBytActivityId", params);
  },
  GeRegisterStatusByActivityId(params) {
    return req("get", "ActivityRegister/GeRegisterStatusByActivityId", params);
  },
  UpdateBatchMeeting(params, data) {
    return req(
      "post",
      `ActivityRegister/PostBatchMeeting?uType=${params.uType}&uValue=${params.uValue}&uService=${params.uService}`,
      data
    );
  },
  ChangeSort(params) {
    return req("post", "ActivityRegister/ChangeRegistorSort", params);
  },
  DeleteActivityRegister(params) {
    return req("delete", "ActivityRegister/Delete", params);
  },
  GetActivityRegisterByUserId(params) {
    return req("get", "ActivityRegister/GetActivityRegisterById", params);
  },
  GetActivityRegisterCalendarExcel(params) {
    return req("get", "ActivityRegister/GetActMemberExcel", params);
  },
  ChangeActSort(params) {
    return req("post", "ActivityRegister/ChangeActSort", params);
  },

  //ActivityRegisterDtl
  GetByActivityRegisterId(params) {
    return req("get", "ActivityRegisterDtl/GetByActivityRegisterId", params);
  },
  PostActivityRegisterDtl(params) {
    return req("post", "ActivityRegisterDtl/Post", params);
  },
  PutActivityRegisterDtl(params) {
    return req("put", "ActivityRegisterDtl/Put", params);
  },

  //CertificateContent
  GetCertificateContentByActivityId(params) {
    return req("get", "CertificateContent/GetByActivityId", params);
  },
  PutCertificateContentByActivityId(params) {
    return req("put", "CertificateContent/Put", params);
  },
  //Member
  GetMemberById(params) {
    return req("get", "Member/GetById/Id", params);
  },
  GetByAccount(params) {
    return req("get", "Member/GetByAccount", params);
  },
  //Banner
  GetBanner(params) {
    return req("get", "Banner/Get", params);
  },
  PostBanner(params) {
    return req("post", "Banner/Post", params);
  },
  PutBanner(params) {
    return req("put", "Banner/Put", params);
  },
  DelBanner(params) {
    return req("delete", "Banner/Delete", params);
  },
  //CalendarEvent
  GetCalendarEvent(params) {
    return req("get", "CalendarEvent/GetCalendarId", params);
  },
  //MasterSet
  GetMasterSetById(params) {
    return req("get", "MasterSet/GetMasterSetById", params);
  },
  PutMasterSet(params) {
    return req("put", "MasterSet/Put", params);
  },
  GetActivityReport(params) {
    return req("get", "Activity/GetActivityReport", params);
  },
  GetSchoolContentById(params) {
    return req("get", "SchoolContent/GetSchoolContentById", params);
  },
  PutSchoolContent(params) {
    return req("put", "SchoolContent/Put", params);
  },
  GetActImage(params) {
    return req("post", "ActivityRegister/GetActImage?actId=" + params.actId);
  },
  GetMember(params) {
    return req("get", "Member/Get", params);
  },
  PutMember(params) {
    return req("put", "Member/Put", params);
  },
  DelMember(params) {
    return req("delete", "Member/Delete", params);
  },

  /* 組織 */
  GetAdminUserByOrgId(params) {
    return req("get", "AdminUser/GetAdminUserByOrg", params);
  },
  PutAdminUserByOrgId(params) {
    return req("put", "AdminUser/PutAdminUserUnit", params);
  },
  DeleteAdminUserByOrgId(params) {
    return req("post", "AdminUser/DeleteAdminUserUnit", params);
  },

  /* 代理人 */
  GetUserAgent(params) {
    return req("get", "AdminUser/GetUserAgent", params);
  },
};

export default api;
