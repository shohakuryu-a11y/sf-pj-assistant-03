"""架空テナント「Demo Corp」のメタデータを生成する。

出力（すべて demo_data/ に書き出す）:
    metadata_ja.xml / metadata_en.xml   OData $metadata（EntityType、Property、NavigationProperty、Association）
    picklists.json                      PickListV2（親 picklist と親の値を含む）
    event_reasons.json                  FOEventReason
    records.json                        Foundation Object / Generic Object / MDF のレコード
    users.json                          User
    data_model_demo.xml                 簡略版の Succession Data Model（HRIS 要素）

使い方（リポジトリのルートで実行）:
    python demo_data/gen.py
    python tools/build_catalog.py
"""
import json
import os
import re
import zlib
from xml.sax.saxutils import quoteattr

OUT = os.path.dirname(os.path.abspath(__file__))
EDM = {"S": "Edm.String", "D": "Edm.DateTime", "DT": "Edm.DateTimeOffset", "B": "Edm.Boolean",
       "L": "Edm.Int64", "N": "Edm.Decimal"}

# ---------------------------------------------------------------------------
# エンティティ定義
#   fields: (name, 型, 必須, 日本語ラベル, 英語ラベル, オプション)
#     オプション: pl=picklist ID, nav=参照先エンティティ（<name>Nav のナビゲーションを作る）,
#                 ro=読み取り専用, ml=最大長, scale=小数桁
#   navs: 項目に対応しないナビゲーション（name, 参照先, 多重度 "1" | "*"）
# ---------------------------------------------------------------------------
def f(name, t, req, ja, en, **o):
    return (name, t, req, ja, en, o)


ENT = {}

# ---- Employee Central ------------------------------------------------------
ENT["EmpJob"] = dict(hris="jobInfo", ja="職務情報", en="Job Information", keys=["seqNumber", "startDate", "userId"], fields=[
    f("userId", "S", 1, "ユーザーID", "User ID", nav="User", ro=True),
    f("startDate", "D", 1, "発令日", "Event Date"),
    f("endDate", "D", 0, "終了日", "End Date", ro=True),
    f("seqNumber", "L", 1, "連番", "Sequence Number", ro=True),
    f("event", "S", 1, "イベント", "Event", pl="event"),
    f("eventReason", "S", 1, "イベント事由", "Event Reason", nav="FOEventReason"),
    f("company", "S", 1, "会社", "Company", nav="FOCompany"),
    f("businessUnit", "S", 0, "事業本部", "Business Unit", nav="FOBusinessUnit"),
    f("division", "S", 0, "事業部", "Division", nav="FODivision"),
    f("department", "S", 0, "部署", "Department", nav="FODepartment"),
    f("location", "S", 0, "勤務地", "Location", nav="FOLocation"),
    f("costCenter", "S", 0, "コストセンター", "Cost Center", nav="FOCostCenter"),
    f("jobCode", "S", 0, "職務コード", "Job Classification", nav="FOJobCode"),
    f("jobTitle", "S", 0, "職務名", "Job Title", ml=255),
    f("payGrade", "S", 0, "等級", "Pay Grade", nav="FOPayGrade"),
    f("position", "S", 0, "ポジション", "Position", nav="Position"),
    f("managerId", "S", 0, "上長", "Supervisor", nav="User"),
    f("employeeClass", "S", 0, "社員区分", "Employee Class", pl="employeeclass"),
    f("employmentType", "S", 0, "雇用形態", "Employment Type", pl="employmentType"),
    f("emplStatus", "S", 0, "在籍ステータス", "Employee Status", pl="employee-status", ro=True),
    f("standardHours", "N", 0, "所定労働時間（週）", "Standard Weekly Hours", scale=2),
    f("workingDaysPerWeek", "N", 0, "週の勤務日数", "Working Days Per Week", scale=1),
    f("fte", "N", 0, "FTE", "FTE", scale=2, ro=True),
    f("isFulltimeEmployee", "B", 0, "フルタイム", "Is Full-Time Employee"),
    f("probationPeriodEndDate", "D", 0, "試用期間終了日", "Probation Period End Date"),
    f("contractType", "S", 0, "契約種別", "Contract Type", pl="contractType"),
    f("contractEndDate", "D", 0, "契約終了日", "Contract End Date"),
    f("customString1", "S", 0, "人事区分", "HR Category", pl="JP_HRCategory"),
    f("customString2", "S", 0, "評価ランク", "Appraisal Rank", pl="JP_AppraisalRank"),
    f("customString3", "S", 0, "役職", "Managerial Title", pl="JP_Position"),
    f("customString4", "S", 0, "職群", "Job Family", nav="cust_JobFamily"),
    f("customString5", "S", 0, "職級", "Job Level", pl="JP_JobLevel"),
    f("customString6", "S", 0, "勤務形態", "Work Style", pl="JP_WorkStyle"),
    f("customDate1", "D", 0, "最終等級変更日", "Last Grade Change Date"),
    f("customDate2", "D", 0, "役職任命日", "Title Appointment Date"),
    f("customDate3", "D", 0, "出向開始日", "Secondment Start Date"),
    f("customDate4", "D", 0, "出向終了予定日", "Planned Secondment End Date"),
    f("customDate5", "D", 0, "契約更新日", "Contract Renewal Date"),
    f("customLong1", "L", 0, "等級在籍年数", "Years in Grade"),
    f("customDouble1", "N", 0, "評価係数", "Appraisal Factor", scale=2),
    f("customBoolean1", "B", 0, "裁量労働対象", "Discretionary Work Flag"),
    f("customBoolean2", "B", 0, "テレワーク対象", "Remote Work Eligible"),
    f("createdBy", "S", 0, "作成者", "Created By", ro=True),
    f("lastModifiedDateTime", "DT", 0, "最終更新日時", "Last Modified On", ro=True),
], navs=[("employmentNav", "EmpEmployment", "1")])

ENT["EmpEmployment"] = dict(hris="employmentInfo", ja="雇用情報", en="Employment Details", keys=["personIdExternal", "userId"], fields=[
    f("personIdExternal", "S", 1, "個人ID", "Person ID", ro=True),
    f("userId", "S", 1, "ユーザーID", "User ID", nav="User", ro=True),
    f("startDate", "D", 1, "入社日", "Hire Date"),
    f("originalStartDate", "D", 0, "当初入社日", "Original Start Date"),
    f("seniorityDate", "D", 0, "勤続起算日", "Seniority Start Date"),
    f("benefitsEligibilityStartDate", "D", 0, "福利厚生適用開始日", "Benefits Eligibility Start Date"),
    f("endDate", "D", 0, "退職日", "Termination Date", ro=True),
    f("lastDateWorked", "D", 0, "最終勤務日", "Last Date Worked", ro=True),
    f("isContingentWorker", "B", 0, "外部人材", "Is Contingent Worker"),
    f("customString1", "S", 0, "入社経路", "Hire Route", pl="JP_HireRoute"),
    f("customString2", "S", 0, "社員番号", "Employee Number", ml=10),
    f("customDate1", "D", 0, "グループ入社日", "Group Hire Date"),
    f("customDate2", "D", 0, "定年到達日", "Retirement Age Date"),
    f("customDate3", "D", 0, "入社予定日", "Planned Hire Date"),
    f("customDate4", "D", 0, "資格取得日", "Insurance Eligibility Date"),
    f("customLong1", "L", 0, "定年年齢", "Retirement Age"),
    f("customLong2", "L", 0, "入社年度", "Hire Fiscal Year"),
    f("customLong3", "L", 0, "勤続年数", "Years of Service"),
], navs=[("personNav", "PerPerson", "1"), ("jobInfoNav", "EmpJob", "*"), ("compInfoNav", "EmpCompensation", "*"),
         ("employmentTerminationNav", "EmpEmploymentTermination", "1")])

ENT["EmpEmploymentTermination"] = dict(hris="employmentInfo_termination", ja="退職情報", en="Termination Details", keys=["personIdExternal", "userId"], fields=[
    f("personIdExternal", "S", 1, "個人ID", "Person ID", ro=True),
    f("userId", "S", 1, "ユーザーID", "User ID", nav="User", ro=True),
    f("endDate", "D", 1, "退職日", "Termination Date"),
    f("eventReason", "S", 1, "退職事由", "Termination Reason", nav="FOEventReason"),
    f("lastDateWorked", "D", 0, "最終勤務日", "Last Date Worked"),
    f("okToRehire", "B", 0, "再雇用可", "OK to Rehire"),
    f("regretTermination", "B", 0, "惜しまれる退職", "Regret Termination"),
    f("customString1", "S", 0, "退職理由（詳細）", "Termination Reason Detail", pl="JP_TermReasonDetail"),
])

ENT["PerPerson"] = dict(hris="personInfo", ja="個人情報（基本）", en="Biographical Information", keys=["personIdExternal"], fields=[
    f("personIdExternal", "S", 1, "個人ID", "Person ID", ro=True),
    f("dateOfBirth", "D", 0, "生年月日", "Date Of Birth"),
    f("countryOfBirth", "S", 0, "出生国", "Country Of Birth", nav="Country"),
    f("placeOfBirth", "S", 0, "出生地", "Place Of Birth", ml=100),
    f("perPersonUuid", "S", 0, "個人UUID", "Person UUID", ro=True),
], navs=[("personalInfoNav", "PerPersonal", "1"), ("emailNav", "PerEmail", "*"), ("nationalIdNav", "PerNationalId", "*"),
         ("employmentNav", "EmpEmployment", "*")])

ENT["PerPersonal"] = dict(hris="personalInfo", ja="個人情報", en="Personal Information", keys=["personIdExternal", "startDate"], fields=[
    f("personIdExternal", "S", 1, "個人ID", "Person ID", ro=True),
    f("startDate", "D", 1, "有効開始日", "Start Date"),
    f("endDate", "D", 0, "有効終了日", "End Date", ro=True),
    f("lastName", "S", 1, "姓", "Last Name", ml=128),
    f("firstName", "S", 1, "名", "First Name", ml=128),
    f("lastNameAlt1", "S", 0, "姓（カナ）", "Last Name (Kana)", ml=128),
    f("firstNameAlt1", "S", 0, "名（カナ）", "First Name (Kana)", ml=128),
    f("gender", "S", 0, "性別", "Gender", pl="GENDER"),
    f("maritalStatus", "S", 0, "婚姻状況", "Marital Status", pl="ecMaritalStatus"),
    f("since", "D", 0, "婚姻状況の変更日", "Marital Status Since"),
    f("nationality", "S", 0, "国籍", "Nationality", nav="Country"),
])

ENT["PerEmail"] = dict(hris="emailInfo", ja="メールアドレス", en="Email Information", keys=["emailType", "personIdExternal"], fields=[
    f("personIdExternal", "S", 1, "個人ID", "Person ID", ro=True),
    f("emailType", "S", 1, "メールの種類", "Email Type", pl="ecEmailType"),
    f("emailAddress", "S", 1, "メールアドレス", "Email Address", ml=100),
    f("isPrimary", "B", 0, "主たる連絡先", "Is Primary"),
])

ENT["PerNationalId"] = dict(hris="nationalIdCard", ja="国民ID", en="National ID Information", keys=["cardType", "country", "personIdExternal"], fields=[
    f("personIdExternal", "S", 1, "個人ID", "Person ID", ro=True),
    f("country", "S", 1, "国", "Country", nav="Country"),
    f("cardType", "S", 1, "ID の種類", "National ID Card Type", pl="ecNationalIdCardType"),
    f("nationalId", "S", 1, "ID 番号", "National ID", ml=40),
    f("isPrimary", "B", 0, "主たる ID", "Is Primary"),
])

ENT["EmpCompensation"] = dict(hris="compInfo", ja="報酬情報", en="Compensation Information", keys=["seqNumber", "startDate", "userId"], fields=[
    f("userId", "S", 1, "ユーザーID", "User ID", nav="User", ro=True),
    f("startDate", "D", 1, "発令日", "Event Date"),
    f("seqNumber", "L", 1, "連番", "Sequence Number", ro=True),
    f("event", "S", 1, "イベント", "Event", pl="event"),
    f("eventReason", "S", 1, "イベント事由", "Event Reason", nav="FOEventReason"),
    f("payGroup", "S", 0, "給与グループ", "Pay Group", nav="FOPayGroup"),
    f("isEligibleForBenefit", "B", 0, "福利厚生対象", "Benefits Eligible"),
    f("isEligibleForCar", "B", 0, "社用車対象", "Company Car Eligible"),
    f("customString1", "S", 0, "給与形態", "Salary Type", pl="JP_SalaryType"),
], navs=[("empPayCompRecurringNav", "EmpPayCompRecurring", "*"), ("employmentNav", "EmpEmployment", "1")])

ENT["EmpPayCompRecurring"] = dict(hris="payComponentRecurring", ja="定期報酬", en="Recurring Pay Component", keys=["payComponent", "seqNumber", "startDate", "userId"], fields=[
    f("userId", "S", 1, "ユーザーID", "User ID", nav="User", ro=True),
    f("startDate", "D", 1, "発令日", "Event Date"),
    f("seqNumber", "L", 1, "連番", "Sequence Number", ro=True),
    f("payComponent", "S", 1, "報酬項目", "Pay Component", nav="FOPayComponent"),
    f("paycompvalue", "N", 1, "金額", "Amount", scale=2),
    f("currencyCode", "S", 1, "通貨", "Currency", nav="Currency"),
    f("frequency", "S", 1, "頻度", "Frequency", nav="FOFrequency"),
])

ENT["EmpPayCompNonRecurring"] = dict(hris="payComponentNonRecurring", ja="一時報酬", en="Spot Bonus / Non-Recurring Pay Component", keys=["payComponentCode", "payDate", "userId"], fields=[
    f("userId", "S", 1, "ユーザーID", "User ID", nav="User", ro=True),
    f("payComponentCode", "S", 1, "報酬項目", "Pay Component", nav="FOPayComponent"),
    f("value", "N", 1, "金額", "Amount", scale=2),
    f("currencyCode", "S", 1, "通貨", "Currency", nav="Currency"),
    f("payDate", "D", 1, "支給日", "Issue Date"),
    f("notes", "S", 0, "備考", "Notes", ml=255),
])

ENT["EmpJobRelationships"] = dict(hris="jobRelationsInfo", ja="職務上の関係", en="Job Relationships", keys=["relationshipType", "startDate", "userId"], fields=[
    f("userId", "S", 1, "ユーザーID", "User ID", nav="User", ro=True),
    f("startDate", "D", 1, "有効開始日", "Start Date"),
    f("relationshipType", "S", 1, "関係の種類", "Relationship Type", pl="jobRelType"),
    f("relUserId", "S", 1, "関係者", "Name", nav="User"),
])

# ---- User ------------------------------------------------------------------
ENT["User"] = dict(hris=None, ja="ユーザー", en="User", keys=["userId"], fields=[
    f("userId", "S", 1, "ユーザーID", "User ID", ro=True),
    f("username", "S", 1, "ログイン名", "Username", ml=100),
    f("lastName", "S", 0, "姓", "Last Name", ro=True),
    f("firstName", "S", 0, "名", "First Name", ro=True),
    f("email", "S", 0, "メールアドレス", "Email", ml=100),
    f("status", "S", 1, "ステータス", "Status", ro=True),
    f("hireDate", "D", 0, "入社日", "Hire Date", ro=True),
    f("manager", "S", 0, "上長", "Manager", nav="User", ro=True),
], navs=[("personKeyNav", "PerPerson", "1"), ("empInfo", "EmpEmployment", "1")])

# ---- Foundation Object（従来型）---------------------------------------------
def fo(ja, en, extra, navs=None):
    return dict(hris=None, ja=ja, en=en, keys=["externalCode", "startDate"], fields=[
        f("externalCode", "S", 1, "コード", "Code", ro=True),
        f("startDate", "D", 1, "有効開始日", "Start Date"),
        f("endDate", "D", 0, "有効終了日", "End Date", ro=True),
        f("name", "S", 1, "名称", "Name", ml=128),
        f("description", "S", 0, "説明", "Description", ml=255),
        f("status", "S", 1, "ステータス", "Status", pl="status"),
    ] + extra, navs=navs or [])


ENT["FOCompany"] = fo("会社", "Company", [
    f("country", "S", 1, "国", "Country", nav="Country"),
    f("currency", "S", 0, "通貨", "Default Currency", nav="Currency"),
])
ENT["FOBusinessUnit"] = fo("事業本部", "Business Unit", [
    f("headOfUnit", "S", 0, "本部長", "Head of Unit", nav="User"),
])
ENT["FODivision"] = fo("事業部", "Division", [
    f("parentBusinessUnit", "S", 0, "上位の事業本部", "Parent Business Unit", nav="FOBusinessUnit"),
    f("headOfUnit", "S", 0, "事業部長", "Head of Unit", nav="User"),
])
ENT["FODepartment"] = fo("部署", "Department", [
    f("parent", "S", 0, "上位部署", "Parent Department", nav="FODepartment"),
    f("headOfUnit", "S", 0, "部署長", "Head of Unit", nav="User"),
    f("costCenter", "S", 0, "コストセンター", "Cost Center", nav="FOCostCenter"),
], navs=[("cust_toDivision", "FODivision", "*")])
ENT["FOLocation"] = fo("勤務地", "Location", [
    f("standardHours", "N", 0, "所定労働時間（週）", "Standard Weekly Hours", scale=2),
    f("timezone", "S", 0, "タイムゾーン", "Time Zone", ml=40),
], navs=[("companyFlxNav", "FOCompany", "*")])
ENT["FOCostCenter"] = fo("コストセンター", "Cost Center", [
    f("legalEntity", "S", 0, "会社", "Legal Entity", nav="FOCompany"),
])
ENT["FOJobCode"] = fo("職務コード", "Job Classification", [
    f("grade", "S", 0, "標準の等級", "Pay Grade", nav="FOPayGrade"),
    f("isFulltimeEmployee", "B", 0, "フルタイム", "Is Full-Time Employee"),
    f("isRegular", "B", 0, "正規雇用", "Regular/Temporary"),
    f("standardHours", "N", 0, "所定労働時間（週）", "Standard Weekly Hours", scale=2),
])
ENT["FOPayGrade"] = fo("等級", "Pay Grade", [
    f("paygradeLevel", "L", 0, "等級レベル", "Pay Grade Level"),
])
ENT["FOEventReason"] = fo("イベント事由", "Event Reason", [
    f("event", "S", 1, "イベント", "Event", pl="event"),
    f("emplStatus", "S", 0, "在籍ステータス", "Employee Status", pl="employee-status"),
])
ENT["FOPayGroup"] = fo("給与グループ", "Pay Group", [
    f("payFrequency", "S", 0, "支払頻度", "Payment Frequency", nav="FOFrequency"),
])
ENT["FOPayComponent"] = fo("報酬項目", "Pay Component", [
    f("payComponentType", "S", 1, "種類", "Pay Component Type", pl="payComponentType"),
    f("isRecurring", "B", 0, "定期", "Recurring"),
    f("currency", "S", 0, "通貨", "Currency", nav="Currency"),
    f("frequencyCode", "S", 0, "頻度", "Frequency", nav="FOFrequency"),
    f("payComponentValue", "N", 0, "標準の金額", "Value", scale=2),
])
ENT["FOFrequency"] = fo("頻度", "Frequency", [
    f("annualizationFactor", "N", 1, "年換算係数", "Annualization Factor", scale=4),
])

# ---- Generic Object（MDF 標準）------------------------------------------------
def go(ja, en, extra, code_label=("コード", "Code"), navs=None, eff=True):
    base = [f("externalCode", "S", 1, code_label[0], code_label[1], ro=True)]
    if eff:
        base.append(f("effectiveStartDate", "D", 1, "有効開始日", "Effective Start Date"))
    base += [f("externalName", "S", 0, "名称", "Name", ml=255),
             f("mdfSystemStatus", "S", 1, "ステータス", "Status", pl="status")]
    return dict(hris=None, ja=ja, en=en, keys=["externalCode"] + (["effectiveStartDate"] if eff else []),
                fields=base + extra, navs=navs or [])


ENT["Country"] = go("国", "Country", [f("currency", "S", 0, "通貨", "Currency", nav="Currency")], eff=False)
ENT["Currency"] = go("通貨", "Currency", [f("symbol", "S", 0, "記号", "Symbol", ml=5)], eff=False)
ENT["Position"] = go("ポジション", "Position", [
    f("company", "S", 1, "会社", "Company", nav="FOCompany"),
    f("department", "S", 0, "部署", "Department", nav="FODepartment"),
    f("jobCode", "S", 1, "職務コード", "Job Classification", nav="FOJobCode"),
    f("payGrade", "S", 0, "等級", "Pay Grade", nav="FOPayGrade"),
    f("location", "S", 0, "勤務地", "Location", nav="FOLocation"),
    f("costCenter", "S", 0, "コストセンター", "Cost Center", nav="FOCostCenter"),
    f("parentPosition", "S", 0, "上位ポジション", "Parent Position", nav="Position"),
    f("vacant", "B", 0, "空席", "To Be Hired"),
    f("targetFTE", "N", 0, "目標 FTE", "Target FTE", scale=2),
    f("standardHours", "N", 0, "所定労働時間（週）", "Standard Weekly Hours", scale=2),
    f("cust_managerialTitle", "S", 0, "役職", "Managerial Title", pl="JP_Position"),
], code_label=("ポジションコード", "Position Code"))

# ---- カスタム MDF -------------------------------------------------------------
ENT["cust_JobFamily"] = go("職群", "Job Family", [
    f("cust_defaultHRCategory", "S", 0, "標準の人事区分", "Default HR Category", pl="JP_HRCategory"),
])
ENT["cust_QualificationMaster"] = go("資格マスタ", "Qualification Master", [
    f("cust_category", "S", 1, "資格分類", "Category", pl="JP_QualCategory"),
    f("cust_level", "S", 0, "レベル", "Level", pl="JP_QualLevel"),
    f("cust_allowanceAmount", "N", 0, "資格手当（月額）", "Monthly Allowance", scale=0),
    f("cust_currency", "S", 0, "通貨", "Currency", nav="Currency"),
])
ENT["cust_Qualification"] = go("保有資格", "Qualification", [
    f("cust_user", "S", 1, "対象者", "Employee", nav="User"),
    f("cust_qualification", "S", 1, "資格", "Qualification", nav="cust_QualificationMaster"),
    f("cust_category", "S", 0, "資格分類", "Category", pl="JP_QualCategory"),
    f("cust_level", "S", 0, "レベル", "Level", pl="JP_QualLevel"),
    f("cust_acquiredDate", "D", 0, "取得日", "Acquired Date"),
    f("cust_expiryDate", "D", 0, "有効期限", "Expiry Date"),
    f("cust_allowanceEligible", "B", 0, "資格手当対象", "Allowance Eligible"),
    f("cust_allowanceAmount", "N", 0, "資格手当（月額）", "Monthly Allowance", scale=0),
])
ENT["cust_PromotionHistory"] = go("昇進昇格履歴", "Promotion History", [
    f("cust_user", "S", 1, "対象者", "Employee", nav="User"),
    f("cust_fromGrade", "S", 0, "変更前等級", "Previous Grade", nav="FOPayGrade"),
    f("cust_toGrade", "S", 0, "変更後等級", "New Grade", nav="FOPayGrade"),
    f("cust_promotionType", "S", 0, "昇格区分", "Promotion Type", pl="JP_PromotionType"),
    f("cust_approvedDate", "D", 0, "承認日", "Approval Date"),
    f("cust_approver", "S", 0, "承認者", "Approver", nav="User"),
])
ENT["cust_TrainingPlan"] = go("研修計画", "Training Plan", [
    f("cust_user", "S", 1, "対象者", "Employee", nav="User"),
    f("cust_fiscalYear", "L", 1, "年度", "Fiscal Year"),
    f("cust_status", "S", 0, "計画の状態", "Plan Status", pl="JP_PlanStatus"),
    f("cust_totalHours", "N", 0, "合計時間", "Total Hours", scale=1, ro=True),
], navs=[("cust_items", "cust_TrainingItem", "*")])
# 旧人事システムからの移行データ。現行の項目と同じ名前・同じ意味でも、データ型が違う（わざと）
ENT["cust_EmployeeProfile"] = dict(hris=None, ja="社員プロファイル", en="Employee Profile (Legacy)", keys=["externalCode", "effectiveStartDate"], fields=[
    f("externalCode", "S", 1, "社員", "Employee", nav="User", ro=True),
    f("effectiveStartDate", "D", 1, "有効開始日", "Effective Start Date"),
    f("mdfSystemStatus", "S", 1, "ステータス", "Status", pl="status"),
    f("cust_employeeNo", "L", 0, "社員番号", "Employee Number"),
    f("cust_hireDate", "S", 0, "入社日", "Hire Date", ml=8),
    f("cust_hireYear", "S", 0, "入社年度", "Hire Fiscal Year", ml=4),
    f("cust_serviceYears", "N", 0, "勤続年数", "Years of Service", scale=1),
    f("cust_retirementAge", "S", 0, "定年年齢", "Retirement Age", ml=3),
    f("cust_remoteFlag", "S", 0, "テレワーク対象", "Remote Work Eligible", ml=1),
    f("cust_lastPromotionDate", "DT", 0, "最終等級変更日", "Last Grade Change Date"),
    f("cust_grade", "S", 0, "等級", "Grade (Legacy)", ml=10),
    f("cust_position", "S", 0, "役職", "Title (Legacy)", ml=20),
    f("cust_department", "S", 0, "部署", "Department (Legacy)", ml=10),
    f("cust_qualificationAllowance", "L", 0, "資格手当", "Qualification Allowance"),
    f("cust_syncedOn", "D", 0, "最終同期日", "Last Synced On"),
], navs=[])
ENT["cust_AppraisalResult"] = go("評価結果", "Appraisal Result", [
    f("cust_user", "S", 1, "対象者", "Employee", nav="User"),
    f("cust_fiscalYear", "S", 1, "年度", "Fiscal Year", ml=6),
    f("cust_rank", "S", 0, "評価ランク", "Rating", ml=2),
    f("cust_score", "N", 0, "評価点", "Score", scale=1),
    f("cust_finalized", "B", 0, "確定", "Finalized"),
    f("cust_finalizedDate", "D", 0, "確定日", "Finalized On"),
])
ENT["cust_TrainingItem"] = dict(hris=None, ja="研修計画の明細", en="Training Plan Item", keys=["externalCode"], fields=[
    f("externalCode", "S", 1, "明細番号", "Item No.", ro=True),
    f("cust_course", "S", 1, "研修名", "Course", ml=255),
    f("cust_hours", "N", 0, "時間", "Hours", scale=1),
    f("cust_completed", "B", 0, "受講済み", "Completed"),
    f("cust_completedDate", "D", 0, "受講日", "Completed On"),
], navs=[])


def hris_id(name):
    return re.sub(r"(?<!^)(?=[A-Z])", "-", name).lower()


def metadata(lang):
    out =['<?xml version="1.0" encoding="utf-8"?>',
           '<!-- DEMO DATA: fictional tenant "Demo Corp". Not from any real customer. -->',
           '<edmx:Edmx Version="1.0" xmlns:edmx="http://schemas.microsoft.com/ado/2007/06/edmx" '
           'xmlns:m="http://schemas.microsoft.com/ado/2007/08/dataservices/metadata" '
           'xmlns:sap="http://www.successfactors.com/edm/sap">',
           '  <edmx:DataServices m:DataServiceVersion="2.0">',
           '    <Schema Namespace="SFOData" xmlns="http://schemas.microsoft.com/ado/2008/09/edm">']
    assocs = []
    for name, e in ENT.items():
        out.append(f'      <EntityType Name="{name}" sap:label={quoteattr(e[lang])}>')
        out.append('        <Key>' + ''.join(f'<PropertyRef Name="{k}"/>' for k in e["keys"]) + '</Key>')
        navs = []
        for pn, t, req, pja, pen, o in e["fields"]:
            lab = pja if lang == "ja" else pen
            ro = o.get("ro")
            a = (f'Name="{pn}" Type="{EDM[t]}" Nullable="{"false" if req else "true"}" '
                 f'sap:required="{"true" if req else "false"}" '
                 f'sap:creatable="{"false" if ro else "true"}" sap:updatable="{"false" if ro else "true"}" '
                 f'sap:upsertable="{"false" if ro else "true"}" sap:visible="true" sap:label={quoteattr(lab)}')
            if t == "S":
                a += f' MaxLength="{o.get("ml", 128)}"'
            if t == "N":
                a += f' Precision="18" Scale="{o.get("scale", 2)}"'
            if t == "D":
                a += ' sap:display-format="Date"'
            if o.get("pl"):
                a += f' sap:picklist="{o["pl"]}"'
            out.append(f'        <Property {a}/>')
            if o.get("nav"):
                navs.append((pn + "Nav", o["nav"], "1"))
        navs += e.get("navs", [])
        for nn, target, mult in navs:
            rel = f"{name}_{nn}"
            out.append(f'        <NavigationProperty Name="{nn}" Relationship="SFOData.{rel}" '
                       f'FromRole="{name}" ToRole="{nn}_{target}" sap:label={quoteattr(ENT[target][lang])}/>')
            assocs.append((rel, name, target, mult, nn))
        out.append('      </EntityType>')
    for rel, src, target, mult, nn in assocs:
        out.append(f'      <Association Name="{rel}">'
                   f'<End Type="SFOData.{src}" Multiplicity="*" Role="{src}"/>'
                   f'<End Type="SFOData.{target}" Multiplicity="{"*" if mult == "*" else "0..1"}" Role="{nn}_{target}"/>'
                   f'</Association>')
    out.append('      <EntityContainer Name="EntityContainer" m:IsDefaultEntityContainer="true">')
    for name in ENT:
        out.append(f'        <EntitySet Name="{name}" EntityType="SFOData.{name}"/>')
    out += ['      </EntityContainer>', '    </Schema>', '  </edmx:DataServices>', '</edmx:Edmx>']
    return "\n".join(out)


for lang in ("ja", "en"):
    with open(os.path.join(OUT, f"metadata_{lang}.xml"), "w", encoding="utf-8") as fp:
        fp.write(metadata(lang))

# ---------------------------------------------------------------------------
# Picklist（PickListV2）。値: (コード, 日本語, 英語[, 状態 "I", 親の値])
# ---------------------------------------------------------------------------
PL = {
    "event": [("H", "入社", "Hire"), ("R", "再入社", "Rehire"), ("5", "職務変更", "Job Change"),
              ("PRM", "昇進・昇格", "Promotion"), ("DEM", "降格", "Demotion"), ("TRN", "異動", "Transfer"),
              ("9", "データ変更", "Data Change"), ("LOA", "休職", "Leave of Absence"), ("RTW", "復職", "Return to Work"),
              ("26", "退職", "Termination"), ("SUS", "停職", "Suspension", "I")],
    "employeeclass": [("1", "正社員", "Regular"), ("2", "契約社員", "Fixed-term"), ("3", "嘱託社員", "Re-employed Senior"),
                      ("4", "パートタイマー", "Part-time"), ("5", "派遣社員", "Temporary Agency Worker", "I")],
    "employmentType": [("FT", "フルタイム", "Full Time"), ("PT", "パートタイム", "Part Time")],
    "employee-status": [("A", "在籍", "Active"), ("U", "休職中", "Unpaid Leave"), ("P", "休職中（有給）", "Paid Leave"),
                        ("T", "退職", "Terminated")],
    "GENDER": [("M", "男性", "Male"), ("F", "女性", "Female"), ("O", "その他", "Other"), ("U", "未回答", "Undeclared")],
    "ecMaritalStatus": [("S", "独身", "Single"), ("M", "既婚", "Married"), ("D", "離別", "Divorced"), ("W", "死別", "Widowed")],
    "status": [("A", "有効", "Active"), ("I", "無効", "Inactive")],
    "JP_HRCategory": [("G", "総合職", "Career Track"), ("A", "一般職", "Clerical Track"), ("S", "専門職", "Specialist Track")],
    "JP_AppraisalRank": [("S", "S", "S"), ("A", "A", "A"), ("B", "B", "B"), ("C", "C", "C"), ("D", "D", "D")],
    "JP_Position": [("NONE", "なし", "None"), ("CHIEF", "主任", "Chief"), ("SEC", "係長", "Section Chief", "I"),
                    ("DMGR", "課長代理", "Deputy Manager"), ("MGR", "課長", "Manager"), ("SMGR", "部長", "Senior Manager"),
                    ("EXE", "本部長", "Executive")],
    "JP_PromotionType": [("REG", "定期昇格", "Regular Promotion"), ("SPC", "抜擢昇格", "Special Promotion"),
                         ("EXM", "試験昇格", "Exam-based Promotion")],
    "JP_HireRoute": [("NEWGRAD", "新卒", "New Graduate"), ("MID", "中途", "Experienced"), ("GROUP", "グループ転籍", "Group Transfer")],
    "JP_TermReasonDetail": [("CAREER", "キャリアアップ", "Career Change"), ("FAMILY", "家庭の事情", "Family Reasons"),
                            ("HEALTH", "健康上の理由", "Health"), ("RETIRE", "定年", "Retirement")],
    "JP_SalaryType": [("M", "月給", "Monthly"), ("D", "日給", "Daily"), ("H", "時給", "Hourly")],
    "JP_QualCategory": [("ACC", "会計", "Accounting"), ("LANG", "語学", "Language"), ("LAW", "法務・労務", "Legal"),
                        ("IT", "IT", "IT")],
    "JP_QualLevel": [("ACC_1", "1級", "Level 1", "A", "ACC"), ("ACC_2", "2級", "Level 2", "A", "ACC"),
                     ("LANG_800", "800点以上", "800+", "A", "LANG"), ("LANG_900", "900点以上", "900+", "A", "LANG"),
                     ("LAW_PRO", "国家資格", "National License", "A", "LAW"),
                     ("IT_ADV", "高度", "Advanced", "A", "IT"), ("IT_BAS", "基本", "Basic", "A", "IT"),
                     ("IT_OLD", "旧区分", "Legacy", "I", "IT")],
    "JP_PlanStatus": [("DRAFT", "下書き", "Draft"), ("SUBMITTED", "申請中", "Submitted"), ("APPROVED", "承認済み", "Approved")],
    "ecEmailType": [("B", "会社", "Business"), ("P", "個人", "Personal")],
    "ecNationalIdCardType": [("MYNUM", "マイナンバー", "My Number"), ("PASS", "パスポート", "Passport")],
    "jobRelType": [("HRBP", "人事担当", "HR Business Partner"), ("MATRIX", "マトリクス上長", "Matrix Manager"),
                   ("MENTOR", "メンター", "Mentor")],
    "payComponentType": [("AMOUNT", "金額", "Amount"), ("PERCENT", "割合", "Percentage")],
    "contractType": [("PERM", "無期", "Permanent"), ("FIXED", "有期", "Fixed Term")],
    "JP_JobLevel": [("L1", "L1（担当）", "L1"), ("L2", "L2（主任相当）", "L2"), ("L3", "L3（係長相当）", "L3"),
                    ("M1", "M1（課長相当）", "M1"), ("M2", "M2（部長相当）", "M2")],
    "JP_WorkStyle": [("OFFICE", "出社", "Office"), ("HYBRID", "ハイブリッド", "Hybrid"), ("REMOTE", "在宅", "Remote")],
}
PL_LABEL = {
    "event": ("イベント", "Event"), "employeeclass": ("社員区分", "Employee Class"),
    "employmentType": ("雇用形態", "Employment Type"), "employee-status": ("在籍ステータス", "Employee Status"),
    "GENDER": ("性別", "Gender"), "ecMaritalStatus": ("婚姻状況", "Marital Status"), "status": ("ステータス", "Status"),
    "JP_HRCategory": ("人事区分", "HR Category"), "JP_AppraisalRank": ("評価ランク", "Appraisal Rank"),
    "JP_Position": ("役職", "Managerial Title"), "JP_PromotionType": ("昇格区分", "Promotion Type"),
    "JP_HireRoute": ("入社経路", "Hire Route"), "JP_TermReasonDetail": ("退職理由（詳細）", "Termination Reason Detail"),
    "JP_SalaryType": ("給与形態", "Salary Type"), "JP_QualCategory": ("資格分類", "Qualification Category"),
    "JP_QualLevel": ("資格レベル", "Qualification Level"), "JP_PlanStatus": ("計画の状態", "Plan Status"),
    "ecEmailType": ("メールの種類", "Email Type"), "ecNationalIdCardType": ("ID の種類", "National ID Card Type"),
    "jobRelType": ("関係の種類", "Relationship Type"), "payComponentType": ("報酬項目の種類", "Pay Component Type"),
    "contractType": ("契約種別", "Contract Type"), "JP_JobLevel": ("職級", "Job Level"), "JP_WorkStyle": ("勤務形態", "Work Style"),
}
PL_PARENT = {"JP_QualLevel": "JP_QualCategory"}

pl_json = {"d": {"results": []}}
for pid, vals in PL.items():
    rs = []
    for v in vals:
        c, ja, en = v[:3]
        st = v[3] if len(v) > 3 else "A"
        r = {"optionId": f"{zlib.crc32((pid + c).encode()) % 90000 + 10000}", "externalCode": c,
             "status": "ACTIVE" if st == "A" else "OBSOLETE",
             "label_ja_JP": ja, "label_en_US": en, "label_defaultValue": en}
        if len(v) > 4:
            r["parentValue"] = {"externalCode": v[4]}
        rs.append(r)
    item = {"id": pid, "status": "ACTIVE", "label_ja_JP": PL_LABEL[pid][0], "label_en_US": PL_LABEL[pid][1],
            "values": {"results": rs}}
    if pid in PL_PARENT:
        item["parentPickList"] = {"id": PL_PARENT[pid]}
    pl_json["d"]["results"].append(item)
with open(os.path.join(OUT, "picklists.json"), "w", encoding="utf-8") as fp:
    json.dump(pl_json, fp, ensure_ascii=False, indent=1)

# ---------------------------------------------------------------------------
# イベント事由（FOEventReason）: (コード, event, 日本語, 英語, 在籍ステータス[, 状態])
# ---------------------------------------------------------------------------
ER = [("HIRNEW", "H", "新卒入社", "New Graduate Hire", "A"), ("HIRMID", "H", "中途入社", "Experienced Hire", "A"),
      ("HIRGRP", "H", "グループ転籍入社", "Group Transfer Hire", "A"),
      ("REHIRE", "R", "再雇用", "Rehire after Retirement", "A"),
      ("PRM_REG", "PRM", "定期昇格", "Regular Promotion", "A"), ("PRM_SPC", "PRM", "抜擢昇格", "Special Promotion", "A"),
      ("PRM_TTL", "PRM", "役職昇進", "Title Promotion", "A"), ("PRM_OLD", "PRM", "昇格（旧制度）", "Promotion (Legacy)", "A", "I"),
      ("DEM_GRD", "DEM", "降格", "Grade Demotion", "A"), ("JOB_CHG", "5", "職務変更", "Job Change", "A"),
      ("TRN_INT", "TRN", "社内異動", "Internal Transfer", "A"), ("TRN_SEC", "TRN", "出向", "Secondment", "A"),
      ("TRN_RTN", "TRN", "出向復帰", "Return from Secondment", "A"), ("DATA_COR", "9", "データ修正", "Data Correction", "A"),
      ("PROB_END", "9", "試用期間終了", "Probation Completed", "A"), ("LOA_SICK", "LOA", "私傷病休職", "Sick Leave", "U"),
      ("LOA_CARE", "LOA", "育児休業", "Childcare Leave", "U"), ("LOA_MAT", "LOA", "産前産後休業", "Maternity Leave", "P"),
      ("RTW", "RTW", "復職", "Return to Work", "A"), ("TER_VOL", "26", "自己都合退職", "Voluntary Resignation", "T"),
      ("TER_INV", "26", "会社都合退職", "Involuntary Termination", "T"), ("TER_RET", "26", "定年退職", "Retirement", "T")]


def odate(s):
    import datetime
    d = datetime.datetime.strptime(s, "%Y-%m-%d").replace(tzinfo=datetime.timezone.utc)
    return f"/Date({int(d.timestamp() * 1000)})/"


er_json = {"d": {"results": [
    {"externalCode": r[0], "startDate": odate("2000-01-01"), "event": r[1], "emplStatus": r[4],
     "status": r[5] if len(r) > 5 else "A", "name_ja_JP": r[2], "name_en_US": r[3], "name_defaultValue": r[3]}
    for r in ER]}}
with open(os.path.join(OUT, "event_reasons.json"), "w", encoding="utf-8") as fp:
    json.dump(er_json, fp, ensure_ascii=False, indent=1)

# ---------------------------------------------------------------------------
# レコード（Foundation Object / Generic Object / MDF）
#   (コード, 日本語名, 英語名, 項目の値{}[, 状態, 開始日, 終了日])
# ---------------------------------------------------------------------------
REC = {
    "Country": [("JPN", "日本", "Japan", {"currency": "JPY"}), ("USA", "アメリカ合衆国", "United States", {"currency": "USD"}),
                ("CHN", "中国", "China", {"currency": "CNY"}), ("GBR", "イギリス", "United Kingdom", {"currency": "GBP"})],
    "Currency": [("JPY", "日本円", "Japanese Yen", {"symbol": "¥"}), ("USD", "米ドル", "US Dollar", {"symbol": "$"}),
                 ("CNY", "人民元", "Chinese Yuan", {"symbol": "元"}), ("GBP", "英ポンド", "British Pound", {"symbol": "£"}),
                 ("EUR", "ユーロ", "Euro", {"symbol": "€"})],
    "FOCompany": [("JP01", "デモ株式会社", "Demo Corp Japan", {"country": "JPN", "currency": "JPY"}),
                  ("JP02", "デモソリューションズ株式会社", "Demo Solutions Japan", {"country": "JPN", "currency": "JPY"}),
                  ("US01", "Demo Corp USA", "Demo Corp USA", {"country": "USA", "currency": "USD"}),
                  ("JP09", "デモ物流株式会社（清算済み）", "Demo Logistics (Liquidated)", {"country": "JPN", "currency": "JPY"}, "I")],
    "FOBusinessUnit": [("BU_SAL", "営業本部", "Sales", {"headOfUnit": "EMP0002"}),
                       ("BU_ENG", "技術本部", "Engineering", {"headOfUnit": "EMP0003"}),
                       ("BU_ADM", "管理本部", "Corporate", {"headOfUnit": "EMP0004"})],
    "FODivision": [("DV_SAL1", "第一営業事業部", "Sales Division 1", {"parentBusinessUnit": "BU_SAL"}),
                   ("DV_SAL2", "第二営業事業部", "Sales Division 2", {"parentBusinessUnit": "BU_SAL"}),
                   ("DV_ENG", "開発事業部", "Development", {"parentBusinessUnit": "BU_ENG"}),
                   ("DV_ADM", "管理事業部", "Administration", {"parentBusinessUnit": "BU_ADM"})],
    "FOCostCenter": [("CC1100", "第一営業部", "Sales Dept. 1", {"legalEntity": "JP01"}),
                     ("CC1200", "第二営業部", "Sales Dept. 2", {"legalEntity": "JP01"}),
                     ("CC2100", "開発部", "Development", {"legalEntity": "JP01"}),
                     ("CC3100", "人事部", "Human Resources", {"legalEntity": "JP01"}),
                     ("CC3200", "経理部", "Accounting", {"legalEntity": "JP01"}),
                     ("CC9000", "旧管理部", "Old Admin", {"legalEntity": "JP01"}, "I")],
    "FODepartment": [("D1000", "営業本部", "Sales HQ", {"headOfUnit": "EMP0002"}),
                     ("D1100", "第一営業部", "Sales Dept. 1", {"parent": "D1000", "headOfUnit": "EMP0005", "costCenter": "CC1100"}),
                     ("D1110", "第一営業部 東京課", "Sales 1 Tokyo", {"parent": "D1100", "costCenter": "CC1100"}),
                     ("D1120", "第一営業部 大阪課", "Sales 1 Osaka", {"parent": "D1100", "costCenter": "CC1100"}),
                     ("D1200", "第二営業部", "Sales Dept. 2", {"parent": "D1000", "headOfUnit": "EMP0006", "costCenter": "CC1200"}),
                     ("D2000", "技術本部", "Engineering HQ", {"headOfUnit": "EMP0003"}),
                     ("D2100", "開発部", "Development", {"parent": "D2000", "headOfUnit": "EMP0007", "costCenter": "CC2100"}),
                     ("D2200", "品質保証部", "Quality Assurance", {"parent": "D2000", "costCenter": "CC2100"}),
                     ("D3000", "管理本部", "Corporate HQ", {"headOfUnit": "EMP0004"}),
                     ("D3100", "人事部", "Human Resources", {"parent": "D3000", "headOfUnit": "EMP0008", "costCenter": "CC3100"}),
                     ("D3200", "経理部", "Accounting", {"parent": "D3000", "costCenter": "CC3200"}),
                     ("D3900", "旧総務部", "Old General Affairs", {"parent": "D3000"}, "I"),
                     ("D4000", "新規事業準備室", "New Business Office", {"parent": "D3000"}, "A", "2027-04-01")],
    "FOLocation": [("LOC_TKY", "東京本社", "Tokyo HQ", {"standardHours": 40, "timezone": "Asia/Tokyo"}),
                   ("LOC_OSK", "大阪支社", "Osaka Branch", {"standardHours": 40, "timezone": "Asia/Tokyo"}),
                   ("LOC_NGY", "名古屋営業所", "Nagoya Office", {"standardHours": 37.5, "timezone": "Asia/Tokyo"}),
                   ("LOC_NYC", "ニューヨーク", "New York", {"standardHours": 40, "timezone": "America/New_York"}),
                   ("LOC_SDI", "仙台営業所（閉鎖）", "Sendai Office (Closed)", {"standardHours": 40, "timezone": "Asia/Tokyo"}, "A", "2010-04-01", "2024-03-31")],
    "FOPayGrade": [("G1", "1等級", "Grade 1", {"paygradeLevel": 1}), ("G2", "2等級", "Grade 2", {"paygradeLevel": 2}),
                   ("G3", "3等級", "Grade 3", {"paygradeLevel": 3}), ("G4", "4等級", "Grade 4", {"paygradeLevel": 4}),
                   ("G5", "5等級", "Grade 5", {"paygradeLevel": 5}), ("G6", "6等級（管理職）", "Grade 6 (Manager)", {"paygradeLevel": 6}),
                   ("G7", "7等級（管理職）", "Grade 7 (Manager)", {"paygradeLevel": 7}),
                   ("G8", "8等級（上級管理職）", "Grade 8 (Senior Manager)", {"paygradeLevel": 8}),
                   ("GX", "旧等級", "Legacy Grade", {"paygradeLevel": 0}, "I")],
    "FOJobCode": [("JC_SALES", "営業", "Sales", {"grade": "G3", "isFulltimeEmployee": True, "isRegular": True, "standardHours": 40}),
                  ("JC_ENG", "エンジニア", "Engineer", {"grade": "G3", "isFulltimeEmployee": True, "isRegular": True, "standardHours": 40}),
                  ("JC_HR", "人事", "HR Specialist", {"grade": "G3", "isFulltimeEmployee": True, "isRegular": True, "standardHours": 40}),
                  ("JC_ACC", "経理", "Accountant", {"grade": "G3", "isFulltimeEmployee": True, "isRegular": True, "standardHours": 40}),
                  ("JC_MGR", "管理職", "Manager", {"grade": "G6", "isFulltimeEmployee": True, "isRegular": True, "standardHours": 40}),
                  ("JC_PT", "パートスタッフ", "Part-time Staff", {"grade": "G1", "isFulltimeEmployee": False, "isRegular": False, "standardHours": 20})],
    "FOPayGroup": [("PG_JP_M", "日本・月給", "Japan Monthly", {"payFrequency": "MON"}),
                   ("PG_JP_H", "日本・時給", "Japan Hourly", {"payFrequency": "MON"}),
                   ("PG_US", "米国・隔週", "US Bi-weekly", {"payFrequency": "BIW"})],
    "FOFrequency": [("MON", "月次", "Monthly", {"annualizationFactor": 12}), ("ANN", "年次", "Annual", {"annualizationFactor": 1}),
                    ("BIW", "隔週", "Bi-weekly", {"annualizationFactor": 26}), ("ONE", "一回", "One-time", {"annualizationFactor": 1})],
    "FOPayComponent": [("BASE", "基本給", "Base Salary", {"payComponentType": "AMOUNT", "isRecurring": True, "currency": "JPY", "frequencyCode": "MON"}),
                       ("ALW_POS", "役職手当", "Position Allowance", {"payComponentType": "AMOUNT", "isRecurring": True, "currency": "JPY", "frequencyCode": "MON"}),
                       ("ALW_QUAL", "資格手当", "Qualification Allowance", {"payComponentType": "AMOUNT", "isRecurring": True, "currency": "JPY", "frequencyCode": "MON"}),
                       ("ALW_COMM", "通勤手当", "Commuting Allowance", {"payComponentType": "AMOUNT", "isRecurring": True, "currency": "JPY", "frequencyCode": "MON"}),
                       ("ALW_REMOTE", "在宅勤務手当", "Remote Work Allowance", {"payComponentType": "AMOUNT", "isRecurring": True, "currency": "JPY", "frequencyCode": "MON"}),
                       ("BONUS", "賞与", "Bonus", {"payComponentType": "AMOUNT", "isRecurring": False, "currency": "JPY", "frequencyCode": "ONE"}),
                       ("ALW_OLD", "旧調整手当", "Legacy Adjustment Allowance", {"payComponentType": "AMOUNT", "isRecurring": True, "currency": "JPY", "frequencyCode": "MON"}, "I")],
    "Position": [("POS1000", "営業本部長", "Head of Sales", {"company": "JP01", "department": "D1000", "jobCode": "JC_MGR", "payGrade": "G8", "location": "LOC_TKY", "cust_managerialTitle": "EXE"}),
                 ("POS1100", "第一営業部長", "Sales Dept. 1 Head", {"company": "JP01", "department": "D1100", "jobCode": "JC_MGR", "payGrade": "G7", "location": "LOC_TKY", "parentPosition": "POS1000", "cust_managerialTitle": "SMGR"}),
                 ("POS1110", "東京課長", "Tokyo Section Manager", {"company": "JP01", "department": "D1110", "jobCode": "JC_MGR", "payGrade": "G6", "location": "LOC_TKY", "parentPosition": "POS1100", "cust_managerialTitle": "MGR"}),
                 ("POS1111", "営業担当（東京）", "Sales Rep (Tokyo)", {"company": "JP01", "department": "D1110", "jobCode": "JC_SALES", "payGrade": "G3", "location": "LOC_TKY", "parentPosition": "POS1110", "cust_managerialTitle": "NONE", "vacant": True}),
                 ("POS2100", "開発部長", "Development Head", {"company": "JP01", "department": "D2100", "jobCode": "JC_MGR", "payGrade": "G7", "location": "LOC_TKY", "cust_managerialTitle": "SMGR"}),
                 ("POS2101", "エンジニア", "Engineer", {"company": "JP01", "department": "D2100", "jobCode": "JC_ENG", "payGrade": "G3", "location": "LOC_TKY", "parentPosition": "POS2100", "cust_managerialTitle": "NONE"}),
                 ("POS3100", "人事部長", "HR Head", {"company": "JP01", "department": "D3100", "jobCode": "JC_MGR", "payGrade": "G7", "location": "LOC_TKY", "cust_managerialTitle": "SMGR"}),
                 ("POS3999", "旧総務担当", "Old GA Staff", {"company": "JP01", "department": "D3900", "jobCode": "JC_HR", "payGrade": "G3", "location": "LOC_TKY", "cust_managerialTitle": "NONE"}, "I")],
    "cust_JobFamily": [("JF_SALES", "営業職群", "Sales", {"cust_defaultHRCategory": "G"}),
                       ("JF_ENG", "技術職群", "Engineering", {"cust_defaultHRCategory": "S"}),
                       ("JF_CORP", "コーポレート職群", "Corporate", {"cust_defaultHRCategory": "G"}),
                       ("JF_OPS", "業務職群", "Operations", {"cust_defaultHRCategory": "A"})],
    "cust_QualificationMaster": [
        ("Q_BOKI1", "日商簿記1級", "Bookkeeping Level 1", {"cust_category": "ACC", "cust_level": "ACC_1", "cust_allowanceAmount": 20000, "cust_currency": "JPY"}),
        ("Q_BOKI2", "日商簿記2級", "Bookkeeping Level 2", {"cust_category": "ACC", "cust_level": "ACC_2", "cust_allowanceAmount": 5000, "cust_currency": "JPY"}),
        ("Q_TOEIC800", "TOEIC 800点以上", "TOEIC 800+", {"cust_category": "LANG", "cust_level": "LANG_800", "cust_allowanceAmount": 5000, "cust_currency": "JPY"}),
        ("Q_TOEIC900", "TOEIC 900点以上", "TOEIC 900+", {"cust_category": "LANG", "cust_level": "LANG_900", "cust_allowanceAmount": 10000, "cust_currency": "JPY"}),
        ("Q_SR", "社会保険労務士", "Labor and Social Security Attorney", {"cust_category": "LAW", "cust_level": "LAW_PRO", "cust_allowanceAmount": 30000, "cust_currency": "JPY"}),
        ("Q_PMP", "PMP", "PMP", {"cust_category": "IT", "cust_level": "IT_ADV", "cust_allowanceAmount": 15000, "cust_currency": "JPY"}),
        ("Q_FE", "基本情報技術者", "Fundamental IT Engineer", {"cust_category": "IT", "cust_level": "IT_BAS", "cust_allowanceAmount": 3000, "cust_currency": "JPY"}),
        ("Q_SYSAD", "初級シスアド（廃止）", "Systems Administrator (Discontinued)", {"cust_category": "IT", "cust_level": "IT_OLD", "cust_allowanceAmount": 0, "cust_currency": "JPY"}, "I")],
}
rec_json = {}
for obj, rows in REC.items():
    out = []
    for r in rows:
        code, ja, en, attrs = r[:4]
        st = r[4] if len(r) > 4 else "A"
        start = r[5] if len(r) > 5 else "2000-01-01"
        item = {"externalCode": code, "name_ja_JP": ja, "name_en_US": en, "status": st, "startDate": odate(start)}
        if len(r) > 6:
            item["endDate"] = odate(r[6])
        item.update(attrs)
        out.append(item)
    rec_json[obj] = {"d": {"results": out}}
with open(os.path.join(OUT, "records.json"), "w", encoding="utf-8") as fp:
    json.dump(rec_json, fp, ensure_ascii=False, indent=1)

# ---------------------------------------------------------------------------
# ユーザー
# ---------------------------------------------------------------------------
USERS = [("EMP0001", "山田", "太郎", "Yamada", "Taro"), ("EMP0002", "佐藤", "健一", "Sato", "Kenichi"),
         ("EMP0003", "鈴木", "美咲", "Suzuki", "Misaki"), ("EMP0004", "高橋", "誠", "Takahashi", "Makoto"),
         ("EMP0005", "田中", "裕子", "Tanaka", "Yuko"), ("EMP0006", "伊藤", "大輔", "Ito", "Daisuke"),
         ("EMP0007", "渡辺", "直樹", "Watanabe", "Naoki"), ("EMP0008", "中村", "恵", "Nakamura", "Megumi"),
         ("EMP0009", "小林", "翔", "Kobayashi", "Sho"), ("EMP0010", "加藤", "彩", "Kato", "Aya"),
         ("EMP0011", "吉田", "拓也", "Yoshida", "Takuya"), ("EMP0012", "山本", "千尋", "Yamamoto", "Chihiro"),
         ("HR_ADMIN", "人事", "管理者", "HR", "Admin"), ("EMP0099", "松本", "浩二", "Matsumoto", "Koji", "inactive")]
users_json = {"d": {"results": [
    {"userId": u[0], "username": u[0].lower(), "lastName": u[1], "firstName": u[2], "lastName_en": u[3], "firstName_en": u[4],
     "status": u[5] if len(u) > 5 else "active", "email": f"{u[0].lower()}@demo-corp.example"} for u in USERS]}}
with open(os.path.join(OUT, "users.json"), "w", encoding="utf-8") as fp:
    json.dump(users_json, fp, ensure_ascii=False, indent=1)

# ---------------------------------------------------------------------------
# Succession Data Model（HRIS 要素）
# ---------------------------------------------------------------------------
dm = ['<?xml version="1.0" encoding="UTF-8"?>',
      '<!-- DEMO DATA: simplified Succession Data Model for fictional tenant "Demo Corp". Not from any real customer. -->',
      '<succession-data-model>']
for name, e in ENT.items():
    if not e["hris"]:
        continue
    dm.append(f'  <hris-element id="{e["hris"]}" odata-entity="{name}">')
    dm.append(f'    <label>{e["en"]}</label><label xml:lang="ja-JP">{e["ja"]}</label>')
    for pn, t, req, pja, pen, o in e["fields"]:
        a = f'id="{hris_id(pn)}" odata-property="{pn}" visibility="{"view" if o.get("ro") else "both"}" required="{"true" if req else "false"}"'
        if o.get("pl"):
            a += f' picklist-id="{o["pl"]}"'
        dm.append(f'    <hris-field {a}><label>{pen}</label><label xml:lang="ja-JP">{pja}</label></hris-field>')
    dm.append('  </hris-element>')
dm.append('</succession-data-model>')
with open(os.path.join(OUT, "data_model_demo.xml"), "w", encoding="utf-8") as fp:
    fp.write("\n".join(dm))

nf = sum(len(e["fields"]) for e in ENT.values())
nv = sum(len(v) for v in PL.values())
nr = sum(len(v) for v in REC.values())
print(f"{len(ENT)} entities, {nf} fields, {len(PL)} picklists ({nv} values), {len(ER)} event reasons, "
      f"{nr} records, {len(USERS)} users")
