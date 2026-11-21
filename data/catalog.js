// データモデル（同期レイヤー、スキーマ 2）。tools/build_catalog.py で生成。直接編集してもよい。
window.BR_CATALOG = {
 "schema": 2,
 "tenant": "Demo Corp",
 "version": "2026-11-21",
 "settings": {
  "navDepth": 3,
  "staleDays": 180
 },
 "objects": {
  "EmpJob": {
   "label": "職務情報",
   "en": "Job Information",
   "desc": "社員の職務上の配置と条件を、発令ごとに有効日付で記録する（所属・職務・等級・上長・雇用条件など）。人事発令の中心となるオブジェクト",
   "syn": [
    "職務情報",
    "ジョブ情報",
    "発令情報",
    "配置情報"
   ],
   "kind": "EC",
   "status": "active",
   "effectiveDated": true,
   "keys": [
    "seqNumber",
    "startDate",
    "userId"
   ],
   "baseObject": true,
   "events": [
    "onInit",
    "onChange",
    "onSave",
    "onView",
    "onPostSave",
    "saveAlert"
   ],
   "associations": [
    {
     "id": "employmentNav",
     "target": "EmpEmployment",
     "multiplicity": "1:1",
     "type": "association"
    }
   ],
   "crossWrite": {
    "targets": [
     "EmpCompensation",
     "EmpJobRelationships",
     "EmpPayCompRecurring",
     "EmpPayCompNonRecurring",
     "EmpEmployment"
    ],
    "events": [
     "onChange",
     "onSave"
    ]
   },
   "fields": {
    "userId": {
     "label": "ユーザーID",
     "en": "User ID",
     "dataType": "User",
     "source": "User",
     "required": true,
     "readOnly": true,
     "desc": "職務情報の持ち主のユーザー。キーのため変更できない",
     "syn": [
      "従業員",
      "本人"
     ]
    },
    "startDate": {
     "label": "発令日",
     "en": "Event Date",
     "dataType": "Date",
     "required": true,
     "desc": "この職務情報レコードの有効開始日（発令日）。入社の発令では雇入れ日と同じ日になるが、異動・昇格などでは各発令の日",
     "syn": [
      "有効日",
      "効力発生日",
      "発令年月日",
      "effective date"
     ]
    },
    "endDate": {
     "label": "終了日",
     "en": "End Date",
     "dataType": "Date",
     "readOnly": true,
     "desc": "このレコードの有効終了日。次の発令の前日でシステムが自動設定する。退職日ではない",
     "syn": [
      "レコード終了日"
     ]
    },
    "seqNumber": {
     "label": "連番",
     "en": "Sequence Number",
     "dataType": "Long",
     "required": true,
     "readOnly": true,
     "desc": "同じ日に複数の発令があるときの順番。システムが採番する",
     "syn": [
      "同日連番"
     ]
    },
    "event": {
     "label": "イベント",
     "en": "Event",
     "dataType": "Picklist",
     "source": "event",
     "required": true,
     "desc": "人事イベントの種類（入社＝雇入れ、昇進・昇格、異動、退職など）",
     "syn": [
      "人事イベント",
      "発令の種類"
     ]
    },
    "eventReason": {
     "label": "イベント事由",
     "en": "Event Reason",
     "dataType": "FoundationObject",
     "source": "FOEventReason",
     "required": true,
     "desc": "人事イベントの理由（新卒入社、定期昇格、出向など）。値は FOEventReason のレコード",
     "syn": [
      "発令事由",
      "異動理由",
      "事由"
     ]
    },
    "company": {
     "label": "会社",
     "en": "Company",
     "dataType": "FoundationObject",
     "source": "FOCompany",
     "required": true,
     "desc": "雇用契約を結んでいる会社（FOCompany）。出向先の会社ではない",
     "syn": [
      "法人",
      "所属会社",
      "雇用元"
     ]
    },
    "businessUnit": {
     "label": "事業本部",
     "en": "Business Unit",
     "dataType": "FoundationObject",
     "source": "FOBusinessUnit",
     "desc": "所属する事業本部（FOBusinessUnit）",
     "syn": [
      "本部",
      "所属本部"
     ]
    },
    "division": {
     "label": "事業部",
     "en": "Division",
     "dataType": "FoundationObject",
     "source": "FODivision",
     "desc": "所属する事業部（FODivision）",
     "syn": [
      "所属事業部"
     ]
    },
    "department": {
     "label": "部署",
     "en": "Department",
     "dataType": "FoundationObject",
     "source": "FODepartment",
     "desc": "所属部署。値は FODepartment のレコード。部署長は FODepartment.headOfUnit でたどれる",
     "syn": [
      "所属部署",
      "部門",
      "所属組織",
      "組織"
     ]
    },
    "location": {
     "label": "勤務地",
     "en": "Location",
     "dataType": "FoundationObject",
     "source": "FOLocation",
     "desc": "実際に働く場所（事業所）。値は FOLocation のレコード。出社か在宅かという働き方（勤務形態）ではない",
     "syn": [
      "勤務場所",
      "就業場所",
      "事業所",
      "勤務先"
     ]
    },
    "costCenter": {
     "label": "コストセンター",
     "en": "Cost Center",
     "dataType": "FoundationObject",
     "source": "FOCostCenter",
     "desc": "人件費を計上するコストセンター（FOCostCenter）",
     "syn": [
      "原価センター",
      "費用負担部署"
     ]
    },
    "jobCode": {
     "label": "職務コード",
     "en": "Job Classification",
     "dataType": "FoundationObject",
     "source": "FOJobCode",
     "desc": "担当する職務の種類（FOJobCode）。営業・エンジニアなど",
     "syn": [
      "職務",
      "職種コード",
      "ジョブコード"
     ]
    },
    "jobTitle": {
     "label": "職務名",
     "en": "Job Title",
     "dataType": "String",
     "maxLength": 255,
     "desc": "名刺などに使う職務の名称（自由入力のテキスト）。役職（customString3）とは別",
     "syn": [
      "職名",
      "肩書き"
     ]
    },
    "payGrade": {
     "label": "等級",
     "en": "Pay Grade",
     "dataType": "FoundationObject",
     "source": "FOPayGrade",
     "desc": "給与テーブル上の等級（FOPayGrade、G1〜G8）。職責のレベルである職級（customString5）や、資格のレベル（cust_level）とは別",
     "syn": [
      "グレード",
      "給与等級",
      "資格等級"
     ]
    },
    "position": {
     "label": "ポジション",
     "en": "Position",
     "dataType": "GenericObject",
     "source": "Position",
     "desc": "ポジション管理のポジション（Generic Object：Position）",
     "syn": [
      "ポスト番号",
      "ポジションコード"
     ]
    },
    "managerId": {
     "label": "上長",
     "en": "Supervisor",
     "dataType": "User",
     "source": "User",
     "desc": "ライン上の直属の上司（User）。部署長とは限らない。マトリクス上長やメンターは職務上の関係（EmpJobRelationships）で持つ",
     "syn": [
      "上司",
      "直属の上司",
      "直属上長",
      "ライン長",
      "マネージャー"
     ]
    },
    "employeeClass": {
     "label": "社員区分",
     "en": "Employee Class",
     "dataType": "Picklist",
     "source": "employeeclass",
     "desc": "社員の身分（正社員・契約社員・嘱託社員・パートタイマー）。契約期間の定め（有期・無期）は契約種別（contractType）で判断する。契約社員でも無期転換している場合がある",
     "syn": [
      "雇用区分",
      "社員種別",
      "身分区分"
     ]
    },
    "employmentType": {
     "label": "雇用形態",
     "en": "Employment Type",
     "dataType": "Picklist",
     "source": "employmentType",
     "desc": "労働時間の区分（フルタイム／パートタイム）。雇用期間の定め（有期・無期）や社員の身分とは無関係",
     "syn": [
      "勤務時間区分",
      "フルタイム・パート区分"
     ]
    },
    "emplStatus": {
     "label": "在籍ステータス",
     "en": "Employee Status",
     "dataType": "Picklist",
     "source": "employee-status",
     "readOnly": true,
     "desc": "在籍ステータス。イベント事由の設定から自動で決まるため、ルールでは設定できない",
     "syn": [
      "在籍状況",
      "就業状態"
     ]
    },
    "standardHours": {
     "label": "所定労働時間（週）",
     "en": "Standard Weekly Hours",
     "dataType": "Decimal",
     "decimals": 2,
     "desc": "週の所定労働時間（時間）",
     "syn": [
      "週所定労働時間",
      "所定時間"
     ]
    },
    "workingDaysPerWeek": {
     "label": "週の勤務日数",
     "en": "Working Days Per Week",
     "dataType": "Decimal",
     "decimals": 1,
     "desc": "週の所定勤務日数",
     "syn": [
      "週の出勤日数"
     ]
    },
    "fte": {
     "label": "FTE",
     "en": "FTE",
     "dataType": "Decimal",
     "decimals": 2,
     "readOnly": true,
     "desc": "所定労働時間から計算されるフルタイム換算値。システムが計算する",
     "syn": [
      "フルタイム換算"
     ]
    },
    "isFulltimeEmployee": {
     "label": "フルタイム",
     "en": "Is Full-Time Employee",
     "dataType": "Boolean",
     "desc": "フルタイム勤務かどうか（はい/いいえ）。雇用形態（employmentType）と同じ意味を、はい/いいえで持つ",
     "syn": [
      "フルタイム勤務"
     ]
    },
    "probationPeriodEndDate": {
     "label": "試用期間終了日",
     "en": "Probation Period End Date",
     "dataType": "Date",
     "desc": "試用期間の最終日",
     "syn": [
      "試用期間満了日",
      "試用終了日"
     ]
    },
    "contractType": {
     "label": "契約種別",
     "en": "Contract Type",
     "dataType": "Picklist",
     "source": "contractType",
     "desc": "雇用期間の定めがあるか（有期 FIXED／無期 PERM）。有期雇用かどうかはこの項目で判断する",
     "syn": [
      "有期雇用",
      "無期雇用",
      "雇用期間の定め",
      "有期・無期",
      "契約形態"
     ]
    },
    "contractEndDate": {
     "label": "契約終了日",
     "en": "Contract End Date",
     "dataType": "Date",
     "desc": "有期契約が満了する日（この日をもって契約が終わる）。契約を更新した日（customDate5）や退職日とは別",
     "syn": [
      "契約満了日",
      "雇止め予定日",
      "雇用期限",
      "契約期間満了日"
     ]
    },
    "customString1": {
     "label": "人事区分",
     "en": "HR Category",
     "dataType": "Picklist",
     "source": "JP_HRCategory",
     "desc": "人事制度上のコース区分（総合職・一般職・専門職）",
     "syn": [
      "コース区分",
      "職掌"
     ]
    },
    "customString2": {
     "label": "評価ランク",
     "en": "Appraisal Rank",
     "dataType": "Picklist",
     "source": "JP_AppraisalRank",
     "desc": "直近の人事評価の結果（S〜D、picklist JP_AppraisalRank）。評価結果 MDF の評価ランク（cust_AppraisalResult.cust_rank）と同じ意味だが、こちらは選択肢",
     "syn": [
      "人事評価",
      "評価結果",
      "考課ランク"
     ]
    },
    "customString3": {
     "label": "役職",
     "en": "Managerial Title",
     "dataType": "Picklist",
     "source": "JP_Position",
     "desc": "管理職の役職（主任・課長・部長・本部長など、picklist JP_Position）。値の「本部長」は役職名で、事業本部の長（FOBusinessUnit.headOfUnit）を指す項目ではない",
     "syn": [
      "ポスト",
      "管理職",
      "職位",
      "肩書（管理職）"
     ]
    },
    "customString4": {
     "label": "職群",
     "en": "Job Family",
     "dataType": "GenericObject",
     "source": "cust_JobFamily",
     "desc": "職群。カスタム MDF cust_JobFamily を参照する Generic Object 項目",
     "syn": [
      "職種群",
      "ジョブファミリー"
     ]
    },
    "customString5": {
     "label": "職級",
     "en": "Job Level",
     "dataType": "Picklist",
     "source": "JP_JobLevel",
     "desc": "職責の大きさを表す職級（L1〜M2、picklist JP_JobLevel）。給与テーブルの等級（payGrade）とは別の体系",
     "syn": [
      "ジョブレベル",
      "職責レベル"
     ]
    },
    "customString6": {
     "label": "勤務形態",
     "en": "Work Style",
     "dataType": "Picklist",
     "source": "JP_WorkStyle",
     "desc": "出社・ハイブリッド・在宅などの働き方（picklist JP_WorkStyle）。働く場所（勤務地 location）ではない",
     "syn": [
      "働き方",
      "勤務スタイル",
      "出社区分"
     ]
    },
    "customDate1": {
     "label": "最終等級変更日",
     "en": "Last Grade Change Date",
     "dataType": "Date",
     "desc": "等級（payGrade）が最後に変更された日（カスタム項目）",
     "syn": [
      "等級変更日",
      "最終昇格日",
      "grade change"
     ]
    },
    "customDate2": {
     "label": "役職任命日",
     "en": "Title Appointment Date",
     "dataType": "Date",
     "desc": "現在の役職に任命された日",
     "syn": [
      "役職発令日"
     ]
    },
    "customDate3": {
     "label": "出向開始日",
     "en": "Secondment Start Date",
     "dataType": "Date",
     "desc": "出向を開始した日",
     "syn": [
      "出向日",
      "出向発令日"
     ]
    },
    "customDate4": {
     "label": "出向終了予定日",
     "en": "Planned Secondment End Date",
     "dataType": "Date",
     "desc": "出向を終える予定の日",
     "syn": [
      "出向終了日",
      "出向期限"
     ]
    },
    "customDate5": {
     "label": "契約更新日",
     "en": "Contract Renewal Date",
     "dataType": "Date",
     "desc": "有期契約を更新した日（更新後の契約の開始日）。契約が満了する日（contractEndDate）ではない",
     "syn": [
      "更新日",
      "契約更新年月日"
     ]
    },
    "customLong1": {
     "label": "等級在籍年数",
     "en": "Years in Grade",
     "dataType": "Long",
     "desc": "現在の等級での在籍年数（年）",
     "syn": [
      "等級滞留年数"
     ]
    },
    "customDouble1": {
     "label": "評価係数",
     "en": "Appraisal Factor",
     "dataType": "Decimal",
     "decimals": 2,
     "desc": "賞与計算に使う評価の係数（例：1.2）。評価点（cust_AppraisalResult.cust_score）とは別",
     "syn": [
      "賞与係数",
      "査定係数"
     ]
    },
    "customBoolean1": {
     "label": "裁量労働対象",
     "en": "Discretionary Work Flag",
     "dataType": "Boolean",
     "desc": "裁量労働制の対象者かどうか",
     "syn": [
      "裁量労働",
      "裁量労働制",
      "みなし労働"
     ]
    },
    "customBoolean2": {
     "label": "テレワーク対象",
     "en": "Remote Work Eligible",
     "dataType": "Boolean",
     "desc": "テレワーク（在宅勤務）の制度の対象者かどうか（はい/いいえ）。社員プロファイルの同名項目（cust_EmployeeProfile.cust_remoteFlag）は同じ意味を Y/N の文字で持つ",
     "syn": [
      "在宅勤務対象",
      "リモートワーク対象",
      "在宅勤務可否"
     ]
    },
    "createdBy": {
     "label": "作成者",
     "en": "Created By",
     "dataType": "String",
     "maxLength": 128,
     "readOnly": true,
     "desc": "このレコードを作成したユーザー。システム項目",
     "syn": [
      "登録者"
     ]
    },
    "lastModifiedDateTime": {
     "label": "最終更新日時",
     "en": "Last Modified On",
     "dataType": "DateTime",
     "readOnly": true,
     "desc": "このレコードの最終更新日時。システム項目",
     "syn": [
      "更新日時"
     ]
    }
   }
  },
  "EmpEmployment": {
   "label": "雇用情報",
   "en": "Employment Details",
   "desc": "会社と社員の雇用関係そのもの（入社日・退職日・勤続の起算日など）。1 人が複数の会社に雇用されるときは雇用ごとに 1 件",
   "syn": [
    "雇用情報",
    "雇用関係",
    "雇用契約"
   ],
   "kind": "EC",
   "status": "active",
   "effectiveDated": false,
   "keys": [
    "personIdExternal",
    "userId"
   ],
   "baseObject": true,
   "events": [
    "onInit",
    "onChange",
    "onSave",
    "onView",
    "saveAlert"
   ],
   "associations": [
    {
     "id": "personNav",
     "target": "PerPerson",
     "multiplicity": "1:1",
     "type": "association"
    },
    {
     "id": "jobInfoNav",
     "target": "EmpJob",
     "multiplicity": "1:n",
     "type": "association"
    },
    {
     "id": "compInfoNav",
     "target": "EmpCompensation",
     "multiplicity": "1:n",
     "type": "association"
    },
    {
     "id": "employmentTerminationNav",
     "target": "EmpEmploymentTermination",
     "multiplicity": "1:1",
     "type": "association"
    }
   ],
   "fields": {
    "personIdExternal": {
     "label": "個人ID",
     "en": "Person ID",
     "dataType": "String",
     "maxLength": 128,
     "required": true,
     "readOnly": true,
     "desc": "個人を識別する ID。キーのため変更できない",
     "syn": [
      "個人番号"
     ]
    },
    "userId": {
     "label": "ユーザーID",
     "en": "User ID",
     "dataType": "User",
     "source": "User",
     "required": true,
     "readOnly": true,
     "desc": "雇用情報の持ち主のユーザー。キーのため変更できない",
     "syn": [
      "従業員"
     ]
    },
    "startDate": {
     "label": "入社日",
     "en": "Hire Date",
     "dataType": "Date",
     "required": true,
     "desc": "この会社に実際に入社した日（雇入れ日）",
     "syn": [
      "入社年月日",
      "雇入れ日",
      "採用日",
      "hire date"
     ]
    },
    "originalStartDate": {
     "label": "当初入社日",
     "en": "Original Start Date",
     "dataType": "Date",
     "desc": "最初に入社した日（再雇用の前を含む）",
     "syn": [
      "初回入社日",
      "当初の採用日"
     ]
    },
    "seniorityDate": {
     "label": "勤続起算日",
     "en": "Seniority Start Date",
     "dataType": "Date",
     "desc": "勤続年数を数え始める日。休職期間などを調整した日になることがある",
     "syn": [
      "勤続開始日",
      "勤続計算開始日"
     ]
    },
    "benefitsEligibilityStartDate": {
     "label": "福利厚生適用開始日",
     "en": "Benefits Eligibility Start Date",
     "dataType": "Date",
     "desc": "福利厚生の適用を開始する日",
     "syn": [
      "福利厚生開始日"
     ]
    },
    "endDate": {
     "label": "退職日",
     "en": "Termination Date",
     "dataType": "Date",
     "readOnly": true,
     "desc": "退職日。退職情報（EmpEmploymentTermination）から設定されるため、ルールでは設定できない",
     "syn": [
      "離職日"
     ]
    },
    "lastDateWorked": {
     "label": "最終勤務日",
     "en": "Last Date Worked",
     "dataType": "Date",
     "readOnly": true,
     "desc": "最後に勤務した日。退職情報から設定される",
     "syn": [
      "最終出勤日"
     ]
    },
    "isContingentWorker": {
     "label": "外部人材",
     "en": "Is Contingent Worker",
     "dataType": "Boolean",
     "desc": "派遣・業務委託などの外部人材かどうか",
     "syn": [
      "外部要員",
      "非従業員"
     ]
    },
    "customString1": {
     "label": "入社経路",
     "en": "Hire Route",
     "dataType": "Picklist",
     "source": "JP_HireRoute",
     "desc": "入社の経路（新卒・中途・グループ転籍）",
     "syn": [
      "採用区分",
      "採用ルート"
     ]
    },
    "customString2": {
     "label": "社員番号",
     "en": "Employee Number",
     "dataType": "String",
     "maxLength": 10,
     "desc": "社員番号（例：000123、先頭の 0 を含む文字列）。社員プロファイルの社員番号（cust_EmployeeProfile.cust_employeeNo）は同じ番号を数値で持つ",
     "syn": [
      "従業員番号",
      "社員コード"
     ]
    },
    "customDate1": {
     "label": "グループ入社日",
     "en": "Group Hire Date",
     "dataType": "Date",
     "desc": "グループ会社に最初に入社した日",
     "syn": [
      "グループ入社年月日",
      "グループ通算開始日"
     ]
    },
    "customDate2": {
     "label": "定年到達日",
     "en": "Retirement Age Date",
     "dataType": "Date",
     "desc": "定年年齢に到達する日",
     "syn": [
      "定年日",
      "定年年月日"
     ]
    },
    "customDate3": {
     "label": "入社予定日",
     "en": "Planned Hire Date",
     "dataType": "Date",
     "desc": "内定時点での入社予定日。実際に入社した日（startDate）ではない",
     "syn": [
      "入社予定",
      "採用予定日"
     ]
    },
    "customDate4": {
     "label": "資格取得日",
     "en": "Insurance Eligibility Date",
     "dataType": "Date",
     "desc": "雇用保険の被保険者資格を取得した日。免許・検定などの資格を取った日（cust_Qualification.cust_acquiredDate）とは別物",
     "syn": [
      "雇用保険資格取得日",
      "被保険者資格取得日",
      "雇保取得日"
     ]
    },
    "customLong1": {
     "label": "定年年齢",
     "en": "Retirement Age",
     "dataType": "Long",
     "desc": "定年年齢（歳、整数）。社員プロファイルの定年年齢（cust_EmployeeProfile.cust_retirementAge）は同じ値を文字で持つ",
     "syn": [
      "定年"
     ]
    },
    "customLong2": {
     "label": "入社年度",
     "en": "Hire Fiscal Year",
     "dataType": "Long",
     "desc": "入社した年度（例：2020、整数）。社員プロファイルの入社年度（cust_hireYear）は同じ値を文字で持つ",
     "syn": [
      "採用年度",
      "入社年"
     ]
    },
    "customLong3": {
     "label": "勤続年数",
     "en": "Years of Service",
     "dataType": "Long",
     "desc": "勤続年数（満年数、整数）。社員プロファイルの勤続年数（cust_serviceYears）は小数で持つ",
     "syn": [
      "勤続",
      "在籍年数"
     ]
    }
   }
  },
  "EmpEmploymentTermination": {
   "label": "退職情報",
   "en": "Termination Details",
   "desc": "退職の手続きで入力する情報（退職日・退職事由・再雇用可否）。保存すると雇用情報の退職日に反映される",
   "syn": [
    "退職情報",
    "離職情報",
    "退職手続き"
   ],
   "kind": "EC",
   "status": "active",
   "effectiveDated": false,
   "keys": [
    "personIdExternal",
    "userId"
   ],
   "baseObject": true,
   "events": [
    "onInit",
    "onChange",
    "onSave"
   ],
   "fields": {
    "personIdExternal": {
     "label": "個人ID",
     "en": "Person ID",
     "dataType": "String",
     "maxLength": 128,
     "required": true,
     "readOnly": true,
     "desc": "個人を識別する ID",
     "syn": [
      "個人番号"
     ]
    },
    "userId": {
     "label": "ユーザーID",
     "en": "User ID",
     "dataType": "User",
     "source": "User",
     "required": true,
     "readOnly": true,
     "desc": "退職者のユーザー",
     "syn": [
      "退職者"
     ]
    },
    "endDate": {
     "label": "退職日",
     "en": "Termination Date",
     "dataType": "Date",
     "required": true,
     "desc": "退職日（雇用契約が終わる日）。ここで入力すると雇用情報の退職日に反映される",
     "syn": [
      "離職日",
      "退職年月日"
     ]
    },
    "eventReason": {
     "label": "退職事由",
     "en": "Termination Reason",
     "dataType": "FoundationObject",
     "source": "FOEventReason",
     "required": true,
     "desc": "退職の事由（自己都合・会社都合・定年など）。値は FOEventReason（event 26）",
     "syn": [
      "退職区分",
      "離職理由"
     ]
    },
    "lastDateWorked": {
     "label": "最終勤務日",
     "en": "Last Date Worked",
     "dataType": "Date",
     "desc": "最後に勤務した日。有給休暇の消化などで退職日より前になることがある",
     "syn": [
      "最終出勤日"
     ]
    },
    "okToRehire": {
     "label": "再雇用可",
     "en": "OK to Rehire",
     "dataType": "Boolean",
     "desc": "将来、再雇用してよいかどうか",
     "syn": [
      "再雇用可否",
      "再雇用OK"
     ]
    },
    "regretTermination": {
     "label": "惜しまれる退職",
     "en": "Regret Termination",
     "dataType": "Boolean",
     "desc": "会社として引き留めたかった退職かどうか",
     "syn": [
      "惜しまれる離職"
     ]
    },
    "customString1": {
     "label": "退職理由（詳細）",
     "en": "Termination Reason Detail",
     "dataType": "Picklist",
     "source": "JP_TermReasonDetail",
     "desc": "退職理由の詳細（キャリアアップ、家庭の事情など）",
     "syn": [
      "退職理由",
      "離職理由詳細"
     ]
    }
   }
  },
  "PerPerson": {
   "label": "個人情報（基本）",
   "en": "Biographical Information",
   "desc": "個人そのものの、時期によって変わらない情報（生年月日・出生国）",
   "syn": [
    "個人基本情報",
    "人物情報"
   ],
   "kind": "EC",
   "status": "active",
   "effectiveDated": false,
   "keys": [
    "personIdExternal"
   ],
   "baseObject": true,
   "events": [
    "onInit",
    "onChange",
    "onSave",
    "onView"
   ],
   "associations": [
    {
     "id": "personalInfoNav",
     "target": "PerPersonal",
     "multiplicity": "1:1",
     "type": "association"
    },
    {
     "id": "emailNav",
     "target": "PerEmail",
     "multiplicity": "1:n",
     "type": "association"
    },
    {
     "id": "nationalIdNav",
     "target": "PerNationalId",
     "multiplicity": "1:n",
     "type": "association"
    },
    {
     "id": "employmentNav",
     "target": "EmpEmployment",
     "multiplicity": "1:n",
     "type": "association"
    }
   ],
   "fields": {
    "personIdExternal": {
     "label": "個人ID",
     "en": "Person ID",
     "dataType": "String",
     "maxLength": 128,
     "required": true,
     "readOnly": true,
     "desc": "個人を識別する ID",
     "syn": [
      "個人番号"
     ]
    },
    "dateOfBirth": {
     "label": "生年月日",
     "en": "Date Of Birth",
     "dataType": "Date",
     "desc": "生年月日",
     "syn": [
      "誕生日",
      "birthday"
     ]
    },
    "countryOfBirth": {
     "label": "出生国",
     "en": "Country Of Birth",
     "dataType": "GenericObject",
     "source": "Country",
     "desc": "生まれた国（Country）。国籍（PerPersonal.nationality）とは別",
     "syn": [
      "出身国"
     ]
    },
    "placeOfBirth": {
     "label": "出生地",
     "en": "Place Of Birth",
     "dataType": "String",
     "maxLength": 100,
     "desc": "生まれた場所（自由入力）",
     "syn": [
      "出身地"
     ]
    },
    "perPersonUuid": {
     "label": "個人UUID",
     "en": "Person UUID",
     "dataType": "String",
     "maxLength": 128,
     "readOnly": true,
     "desc": "システム内部の個人 UUID",
     "syn": [
      "個人UUID"
     ]
    }
   }
  },
  "PerPersonal": {
   "label": "個人情報",
   "en": "Personal Information",
   "desc": "氏名・性別・婚姻状況・国籍など、変更履歴を有効日付で持つ個人情報",
   "syn": [
    "個人情報",
    "氏名情報",
    "パーソナル情報"
   ],
   "kind": "EC",
   "status": "active",
   "effectiveDated": true,
   "keys": [
    "personIdExternal",
    "startDate"
   ],
   "baseObject": true,
   "events": [
    "onInit",
    "onChange",
    "onSave",
    "onView"
   ],
   "fields": {
    "personIdExternal": {
     "label": "個人ID",
     "en": "Person ID",
     "dataType": "String",
     "maxLength": 128,
     "required": true,
     "readOnly": true,
     "desc": "個人を識別する ID",
     "syn": [
      "個人番号"
     ]
    },
    "startDate": {
     "label": "有効開始日",
     "en": "Start Date",
     "dataType": "Date",
     "required": true,
     "desc": "この個人情報レコードの有効開始日（氏名変更などの日）",
     "syn": [
      "変更日"
     ]
    },
    "endDate": {
     "label": "有効終了日",
     "en": "End Date",
     "dataType": "Date",
     "readOnly": true,
     "desc": "この個人情報レコードの有効終了日。システムが設定する",
     "syn": [
      "レコード終了日"
     ]
    },
    "lastName": {
     "label": "姓",
     "en": "Last Name",
     "dataType": "String",
     "maxLength": 128,
     "required": true,
     "desc": "戸籍上の姓（漢字）",
     "syn": [
      "苗字",
      "氏"
     ]
    },
    "firstName": {
     "label": "名",
     "en": "First Name",
     "dataType": "String",
     "maxLength": 128,
     "required": true,
     "desc": "戸籍上の名（漢字）",
     "syn": [
      "下の名前"
     ]
    },
    "lastNameAlt1": {
     "label": "姓（カナ）",
     "en": "Last Name (Kana)",
     "dataType": "String",
     "maxLength": 128,
     "desc": "姓のフリガナ",
     "syn": [
      "セイ",
      "フリガナ（姓）"
     ]
    },
    "firstNameAlt1": {
     "label": "名（カナ）",
     "en": "First Name (Kana)",
     "dataType": "String",
     "maxLength": 128,
     "desc": "名のフリガナ",
     "syn": [
      "メイ",
      "フリガナ（名）"
     ]
    },
    "gender": {
     "label": "性別",
     "en": "Gender",
     "dataType": "Picklist",
     "source": "GENDER",
     "desc": "性別",
     "syn": [
      "ジェンダー"
     ]
    },
    "maritalStatus": {
     "label": "婚姻状況",
     "en": "Marital Status",
     "dataType": "Picklist",
     "source": "ecMaritalStatus",
     "desc": "婚姻状況（独身・既婚など）",
     "syn": [
      "配偶者の有無",
      "結婚"
     ]
    },
    "since": {
     "label": "婚姻状況の変更日",
     "en": "Marital Status Since",
     "dataType": "Date",
     "desc": "婚姻状況が変わった日（結婚した日など）",
     "syn": [
      "婚姻日",
      "結婚日"
     ]
    },
    "nationality": {
     "label": "国籍",
     "en": "Nationality",
     "dataType": "GenericObject",
     "source": "Country",
     "desc": "国籍（Country）。出生国とは別",
     "syn": [
      "国籍国"
     ]
    }
   }
  },
  "PerEmail": {
   "label": "メールアドレス",
   "en": "Email Information",
   "desc": "個人のメールアドレス。1 人に複数あるため、職務情報からは集合（1:n）になる",
   "syn": [
    "メール情報",
    "連絡先メール"
   ],
   "kind": "EC",
   "status": "active",
   "effectiveDated": false,
   "keys": [
    "emailType",
    "personIdExternal"
   ],
   "baseObject": true,
   "events": [
    "onChange",
    "onSave"
   ],
   "fields": {
    "personIdExternal": {
     "label": "個人ID",
     "en": "Person ID",
     "dataType": "String",
     "maxLength": 128,
     "required": true,
     "readOnly": true,
     "desc": "個人を識別する ID",
     "syn": [
      "個人番号"
     ]
    },
    "emailType": {
     "label": "メールの種類",
     "en": "Email Type",
     "dataType": "Picklist",
     "source": "ecEmailType",
     "required": true,
     "desc": "メールアドレスの種類（会社・個人）",
     "syn": [
      "アドレス区分"
     ]
    },
    "emailAddress": {
     "label": "メールアドレス",
     "en": "Email Address",
     "dataType": "String",
     "maxLength": 100,
     "required": true,
     "desc": "メールアドレス。1 人に複数あるため、職務情報からは集合（1:n）になる",
     "syn": [
      "Eメール",
      "e-mail"
     ]
    },
    "isPrimary": {
     "label": "主たる連絡先",
     "en": "Is Primary",
     "dataType": "Boolean",
     "desc": "主に使う連絡先かどうか",
     "syn": [
      "主アドレス"
     ]
    }
   }
  },
  "PerNationalId": {
   "label": "国民ID",
   "en": "National ID Information",
   "desc": "マイナンバー・パスポートなど、国が発行する個人の ID。1 人に複数ありうる",
   "syn": [
    "国民ID情報",
    "身分証情報"
   ],
   "kind": "EC",
   "status": "active",
   "effectiveDated": false,
   "keys": [
    "cardType",
    "country",
    "personIdExternal"
   ],
   "baseObject": true,
   "events": [
    "onChange",
    "onSave"
   ],
   "fields": {
    "personIdExternal": {
     "label": "個人ID",
     "en": "Person ID",
     "dataType": "String",
     "maxLength": 128,
     "required": true,
     "readOnly": true,
     "desc": "個人を識別する ID",
     "syn": [
      "個人番号"
     ]
    },
    "country": {
     "label": "国",
     "en": "Country",
     "dataType": "GenericObject",
     "source": "Country",
     "required": true,
     "desc": "ID を発行した国",
     "syn": [
      "発行国"
     ]
    },
    "cardType": {
     "label": "ID の種類",
     "en": "National ID Card Type",
     "dataType": "Picklist",
     "source": "ecNationalIdCardType",
     "required": true,
     "desc": "ID の種類（マイナンバー・パスポート）",
     "syn": [
      "身分証の種類"
     ]
    },
    "nationalId": {
     "label": "ID 番号",
     "en": "National ID",
     "dataType": "String",
     "maxLength": 40,
     "required": true,
     "desc": "マイナンバーなどの番号。社員番号ではない",
     "syn": [
      "マイナンバー",
      "個人番号カード番号"
     ]
    },
    "isPrimary": {
     "label": "主たる ID",
     "en": "Is Primary",
     "dataType": "Boolean",
     "desc": "主に使う ID かどうか",
     "syn": [
      "主たる身分証"
     ]
    }
   }
  },
  "EmpCompensation": {
   "label": "報酬情報",
   "en": "Compensation Information",
   "desc": "報酬の枠組み（給与グループ・給与形態・福利厚生の対象など）を発令ごとに記録する。金額は定期報酬・一時報酬に持つ",
   "syn": [
    "報酬情報",
    "給与情報"
   ],
   "kind": "EC",
   "status": "active",
   "effectiveDated": true,
   "keys": [
    "seqNumber",
    "startDate",
    "userId"
   ],
   "baseObject": true,
   "events": [
    "onInit",
    "onChange",
    "onSave",
    "onView",
    "saveAlert"
   ],
   "associations": [
    {
     "id": "empPayCompRecurringNav",
     "target": "EmpPayCompRecurring",
     "multiplicity": "1:n",
     "type": "association"
    },
    {
     "id": "employmentNav",
     "target": "EmpEmployment",
     "multiplicity": "1:1",
     "type": "association"
    }
   ],
   "crossWrite": {
    "targets": [
     "EmpJobRelationships",
     "EmpPayCompRecurring",
     "EmpPayCompNonRecurring"
    ],
    "events": [
     "onChange",
     "onSave"
    ]
   },
   "fields": {
    "userId": {
     "label": "ユーザーID",
     "en": "User ID",
     "dataType": "User",
     "source": "User",
     "required": true,
     "readOnly": true,
     "desc": "報酬情報の持ち主のユーザー",
     "syn": [
      "従業員"
     ]
    },
    "startDate": {
     "label": "発令日",
     "en": "Event Date",
     "dataType": "Date",
     "required": true,
     "desc": "この報酬情報レコードの有効開始日",
     "syn": [
      "報酬の発令日",
      "昇給日"
     ]
    },
    "seqNumber": {
     "label": "連番",
     "en": "Sequence Number",
     "dataType": "Long",
     "required": true,
     "readOnly": true,
     "desc": "同じ日の報酬情報の順番",
     "syn": [
      "同日連番"
     ]
    },
    "event": {
     "label": "イベント",
     "en": "Event",
     "dataType": "Picklist",
     "source": "event",
     "required": true,
     "desc": "報酬を変更した人事イベントの種類",
     "syn": [
      "人事イベント"
     ]
    },
    "eventReason": {
     "label": "イベント事由",
     "en": "Event Reason",
     "dataType": "FoundationObject",
     "source": "FOEventReason",
     "required": true,
     "desc": "報酬を変更した理由（FOEventReason）",
     "syn": [
      "発令事由"
     ]
    },
    "payGroup": {
     "label": "給与グループ",
     "en": "Pay Group",
     "dataType": "FoundationObject",
     "source": "FOPayGroup",
     "desc": "給与計算のグループ（FOPayGroup）",
     "syn": [
      "給与区分",
      "支給グループ"
     ]
    },
    "isEligibleForBenefit": {
     "label": "福利厚生対象",
     "en": "Benefits Eligible",
     "dataType": "Boolean",
     "desc": "福利厚生制度の対象かどうか",
     "syn": [
      "福利厚生対象者"
     ]
    },
    "isEligibleForCar": {
     "label": "社用車対象",
     "en": "Company Car Eligible",
     "dataType": "Boolean",
     "desc": "社用車を貸与する対象かどうか",
     "syn": [
      "社有車対象"
     ]
    },
    "customString1": {
     "label": "給与形態",
     "en": "Salary Type",
     "dataType": "Picklist",
     "source": "JP_SalaryType",
     "desc": "給与の支払形態（月給・日給・時給）",
     "syn": [
      "給与体系",
      "賃金形態"
     ]
    }
   }
  },
  "EmpPayCompRecurring": {
   "label": "定期報酬",
   "en": "Recurring Pay Component",
   "desc": "基本給や毎月の手当など、繰り返し支給する報酬項目と金額。報酬情報の子",
   "syn": [
    "定期報酬",
    "毎月の手当",
    "定期支給項目"
   ],
   "kind": "EC",
   "status": "active",
   "effectiveDated": true,
   "keys": [
    "payComponent",
    "seqNumber",
    "startDate",
    "userId"
   ],
   "baseObject": true,
   "events": [
    "onInit",
    "onChange",
    "onSave",
    "onView",
    "saveAlert"
   ],
   "crossWrite": {
    "targets": [
     "EmpJobRelationships",
     "EmpPayCompNonRecurring"
    ],
    "events": [
     "onChange",
     "onSave"
    ]
   },
   "fields": {
    "userId": {
     "label": "ユーザーID",
     "en": "User ID",
     "dataType": "User",
     "source": "User",
     "required": true,
     "readOnly": true,
     "desc": "定期報酬の持ち主のユーザー",
     "syn": [
      "従業員"
     ]
    },
    "startDate": {
     "label": "発令日",
     "en": "Event Date",
     "dataType": "Date",
     "required": true,
     "desc": "この定期報酬の支給開始日",
     "syn": [
      "支給開始日"
     ]
    },
    "seqNumber": {
     "label": "連番",
     "en": "Sequence Number",
     "dataType": "Long",
     "required": true,
     "readOnly": true,
     "desc": "同じ日の定期報酬の順番",
     "syn": [
      "同日連番"
     ]
    },
    "payComponent": {
     "label": "報酬項目",
     "en": "Pay Component",
     "dataType": "FoundationObject",
     "source": "FOPayComponent",
     "required": true,
     "desc": "毎月支給する報酬項目（FOPayComponent：基本給・各種手当）",
     "syn": [
      "手当",
      "給与項目",
      "支給項目"
     ]
    },
    "paycompvalue": {
     "label": "金額",
     "en": "Amount",
     "dataType": "Decimal",
     "decimals": 2,
     "required": true,
     "desc": "定期報酬の 1 回あたりの金額",
     "syn": [
      "手当額",
      "支給額"
     ]
    },
    "currencyCode": {
     "label": "通貨",
     "en": "Currency",
     "dataType": "GenericObject",
     "source": "Currency",
     "required": true,
     "desc": "金額の通貨（Currency）",
     "syn": [
      "通貨コード"
     ]
    },
    "frequency": {
     "label": "頻度",
     "en": "Frequency",
     "dataType": "FoundationObject",
     "source": "FOFrequency",
     "required": true,
     "desc": "支給の頻度（FOFrequency：月次など）",
     "syn": [
      "支給頻度"
     ]
    }
   }
  },
  "EmpPayCompNonRecurring": {
   "label": "一時報酬",
   "en": "Spot Bonus / Non-Recurring Pay Component",
   "desc": "賞与・一時金など、1 回だけ支給する報酬項目と金額",
   "syn": [
    "一時報酬",
    "一時金",
    "スポット支給"
   ],
   "kind": "EC",
   "status": "active",
   "effectiveDated": false,
   "keys": [
    "payComponentCode",
    "payDate",
    "userId"
   ],
   "baseObject": true,
   "events": [
    "onInit",
    "onChange",
    "onSave",
    "onView",
    "saveAlert"
   ],
   "crossWrite": {
    "targets": [
     "EmpPayCompRecurring"
    ],
    "events": [
     "onSave"
    ]
   },
   "fields": {
    "userId": {
     "label": "ユーザーID",
     "en": "User ID",
     "dataType": "User",
     "source": "User",
     "required": true,
     "readOnly": true,
     "desc": "一時報酬の受取人のユーザー",
     "syn": [
      "従業員"
     ]
    },
    "payComponentCode": {
     "label": "報酬項目",
     "en": "Pay Component",
     "dataType": "FoundationObject",
     "source": "FOPayComponent",
     "required": true,
     "desc": "一時的に支給する報酬項目（FOPayComponent：賞与など）",
     "syn": [
      "一時金の種類",
      "賞与項目"
     ]
    },
    "value": {
     "label": "金額",
     "en": "Amount",
     "dataType": "Decimal",
     "decimals": 2,
     "required": true,
     "desc": "一時報酬の金額",
     "syn": [
      "一時金額",
      "賞与額"
     ]
    },
    "currencyCode": {
     "label": "通貨",
     "en": "Currency",
     "dataType": "GenericObject",
     "source": "Currency",
     "required": true,
     "desc": "金額の通貨（Currency）",
     "syn": [
      "通貨コード"
     ]
    },
    "payDate": {
     "label": "支給日",
     "en": "Issue Date",
     "dataType": "Date",
     "required": true,
     "desc": "一時報酬を支払う日",
     "syn": [
      "支払日",
      "賞与支給日"
     ]
    },
    "notes": {
     "label": "備考",
     "en": "Notes",
     "dataType": "String",
     "maxLength": 255,
     "desc": "一時報酬の備考（自由入力）",
     "syn": [
      "メモ"
     ]
    }
   }
  },
  "EmpJobRelationships": {
   "label": "職務上の関係",
   "en": "Job Relationships",
   "desc": "ライン上の上司以外の関係者（マトリクス上長・メンター・人事担当）を記録する",
   "syn": [
    "職務上の関係",
    "ジョブリレーション",
    "関係者情報"
   ],
   "kind": "EC",
   "status": "active",
   "effectiveDated": true,
   "keys": [
    "relationshipType",
    "startDate",
    "userId"
   ],
   "baseObject": true,
   "events": [
    "onInit",
    "onChange",
    "onSave",
    "onView"
   ],
   "fields": {
    "userId": {
     "label": "ユーザーID",
     "en": "User ID",
     "dataType": "User",
     "source": "User",
     "required": true,
     "readOnly": true,
     "desc": "関係を持つ本人のユーザー",
     "syn": [
      "従業員"
     ]
    },
    "startDate": {
     "label": "有効開始日",
     "en": "Start Date",
     "dataType": "Date",
     "required": true,
     "desc": "この関係の有効開始日",
     "syn": [
      "関係開始日"
     ]
    },
    "relationshipType": {
     "label": "関係の種類",
     "en": "Relationship Type",
     "dataType": "Picklist",
     "source": "jobRelType",
     "required": true,
     "desc": "関係の種類（人事担当・マトリクス上長・メンター）",
     "syn": [
      "関係区分"
     ]
    },
    "relUserId": {
     "label": "関係者",
     "en": "Name",
     "dataType": "User",
     "source": "User",
     "required": true,
     "desc": "マトリクス上長・メンター・人事担当など、ライン上の直属の上司以外の関係者（User）。直属の上司は職務情報の上長（managerId）",
     "syn": [
      "マトリクス上長",
      "メンター",
      "人事担当者"
     ]
    }
   }
  },
  "User": {
   "label": "ユーザー",
   "en": "User",
   "desc": "システムのユーザー（ログインアカウント）。人事データから連携される写しの項目が多く、ルールで設定できる項目は少ない",
   "syn": [
    "ユーザー",
    "アカウント",
    "従業員アカウント"
   ],
   "kind": "User",
   "status": "active",
   "effectiveDated": false,
   "keys": [
    "userId"
   ],
   "baseObject": false,
   "events": [],
   "associations": [
    {
     "id": "personKeyNav",
     "target": "PerPerson",
     "multiplicity": "1:1",
     "type": "association"
    },
    {
     "id": "empInfo",
     "target": "EmpEmployment",
     "multiplicity": "1:1",
     "type": "association"
    }
   ],
   "fields": {
    "userId": {
     "label": "ユーザーID",
     "en": "User ID",
     "dataType": "String",
     "maxLength": 128,
     "required": true,
     "readOnly": true,
     "desc": "ユーザーを識別する ID（例：EMP0001）。数値の社員番号ではない",
     "syn": [
      "ユーザーコード",
      "ログインID"
     ]
    },
    "username": {
     "label": "ログイン名",
     "en": "Username",
     "dataType": "String",
     "maxLength": 100,
     "required": true,
     "desc": "ログインに使う名前",
     "syn": [
      "アカウント名"
     ]
    },
    "lastName": {
     "label": "姓",
     "en": "Last Name",
     "dataType": "String",
     "maxLength": 128,
     "readOnly": true,
     "desc": "姓。個人情報から連携される",
     "syn": [
      "苗字"
     ]
    },
    "firstName": {
     "label": "名",
     "en": "First Name",
     "dataType": "String",
     "maxLength": 128,
     "readOnly": true,
     "desc": "名。個人情報から連携される",
     "syn": [
      "下の名前"
     ]
    },
    "email": {
     "label": "メールアドレス",
     "en": "Email",
     "dataType": "String",
     "maxLength": 100,
     "desc": "業務用のメールアドレス",
     "syn": [
      "会社メール"
     ]
    },
    "status": {
     "label": "ステータス",
     "en": "Status",
     "dataType": "String",
     "maxLength": 128,
     "required": true,
     "readOnly": true,
     "desc": "ユーザーが有効かどうか（active / inactive）",
     "syn": [
      "アカウント状態"
     ]
    },
    "hireDate": {
     "label": "入社日",
     "en": "Hire Date",
     "dataType": "Date",
     "readOnly": true,
     "desc": "入社日。雇用情報から連携される写しのため、ルールでは設定できない",
     "syn": [
      "入社日（ユーザー）"
     ]
    },
    "manager": {
     "label": "上長",
     "en": "Manager",
     "dataType": "User",
     "source": "User",
     "readOnly": true,
     "desc": "ユーザーデータ上の上長。職務情報の上長（managerId）から自動で連携される写しのため、ルールでは設定しない",
     "syn": [
      "上長（ユーザー）"
     ]
    }
   }
  },
  "FOCompany": {
   "label": "会社",
   "en": "Company",
   "desc": "雇用契約を結ぶ法人（会社）。国と標準通貨を持つ",
   "syn": [
    "会社",
    "法人",
    "リーガルエンティティ"
   ],
   "kind": "Foundation",
   "status": "active",
   "effectiveDated": true,
   "keys": [
    "externalCode",
    "startDate"
   ],
   "baseObject": true,
   "events": [
    "onInit",
    "onSave"
   ],
   "fields": {
    "externalCode": {
     "label": "コード",
     "en": "Code",
     "dataType": "String",
     "maxLength": 128,
     "required": true,
     "readOnly": true,
     "desc": "会社を一意に識別するコード（externalCode）。ルールでは {\"object\":\"FOCompany\",\"codes\":[...]} の値として使う",
     "syn": [
      "会社コード",
      "会社ID"
     ]
    },
    "startDate": {
     "label": "有効開始日",
     "en": "Start Date",
     "dataType": "Date",
     "required": true,
     "desc": "会社レコードの有効開始日",
     "syn": [
      "会社の開始日"
     ]
    },
    "endDate": {
     "label": "有効終了日",
     "en": "End Date",
     "dataType": "Date",
     "readOnly": true,
     "desc": "会社レコードの有効終了日。システムが設定する",
     "syn": [
      "会社の終了日"
     ]
    },
    "name": {
     "label": "名称",
     "en": "Name",
     "dataType": "String",
     "maxLength": 128,
     "required": true,
     "desc": "会社の名称",
     "syn": [
      "会社名"
     ]
    },
    "description": {
     "label": "説明",
     "en": "Description",
     "dataType": "String",
     "maxLength": 255,
     "desc": "会社の説明（自由入力）",
     "syn": [
      "会社の備考"
     ]
    },
    "status": {
     "label": "ステータス",
     "en": "Status",
     "dataType": "Picklist",
     "source": "status",
     "required": true,
     "desc": "会社レコードが有効か無効か",
     "syn": [
      "会社の有効・無効"
     ]
    },
    "country": {
     "label": "国",
     "en": "Country",
     "dataType": "GenericObject",
     "source": "Country",
     "required": true,
     "desc": "会社の所在国（Country）",
     "syn": [
      "所在国"
     ]
    },
    "currency": {
     "label": "通貨",
     "en": "Default Currency",
     "dataType": "GenericObject",
     "source": "Currency",
     "desc": "会社の標準通貨（Currency）",
     "syn": [
      "既定通貨"
     ]
    }
   }
  },
  "FOBusinessUnit": {
   "label": "事業本部",
   "en": "Business Unit",
   "desc": "組織の最上位の区分である事業本部",
   "syn": [
    "事業本部",
    "ビジネスユニット"
   ],
   "kind": "Foundation",
   "status": "active",
   "effectiveDated": true,
   "keys": [
    "externalCode",
    "startDate"
   ],
   "baseObject": true,
   "events": [
    "onInit",
    "onSave"
   ],
   "fields": {
    "externalCode": {
     "label": "コード",
     "en": "Code",
     "dataType": "String",
     "maxLength": 128,
     "required": true,
     "readOnly": true,
     "desc": "事業本部を一意に識別するコード（externalCode）。ルールでは {\"object\":\"FOBusinessUnit\",\"codes\":[...]} の値として使う",
     "syn": [
      "事業本部コード",
      "事業本部ID"
     ]
    },
    "startDate": {
     "label": "有効開始日",
     "en": "Start Date",
     "dataType": "Date",
     "required": true,
     "desc": "事業本部レコードの有効開始日",
     "syn": [
      "事業本部の開始日"
     ]
    },
    "endDate": {
     "label": "有効終了日",
     "en": "End Date",
     "dataType": "Date",
     "readOnly": true,
     "desc": "事業本部レコードの有効終了日。システムが設定する",
     "syn": [
      "事業本部の終了日"
     ]
    },
    "name": {
     "label": "名称",
     "en": "Name",
     "dataType": "Translatable",
     "maxLength": 128,
     "required": true,
     "desc": "事業本部の名称",
     "syn": [
      "事業本部名"
     ]
    },
    "description": {
     "label": "説明",
     "en": "Description",
     "dataType": "String",
     "maxLength": 255,
     "desc": "事業本部の説明（自由入力）",
     "syn": [
      "事業本部の備考"
     ]
    },
    "status": {
     "label": "ステータス",
     "en": "Status",
     "dataType": "Picklist",
     "source": "status",
     "required": true,
     "desc": "事業本部レコードが有効か無効か",
     "syn": [
      "事業本部の有効・無効"
     ]
    },
    "headOfUnit": {
     "label": "本部長",
     "en": "Head of Unit",
     "dataType": "User",
     "source": "User",
     "desc": "事業本部の長（User）。役職 picklist の「本部長」（JP_Position EXE）とは別で、こちらは特定の人を指す",
     "syn": [
      "事業本部長",
      "本部のトップ"
     ]
    }
   }
  },
  "FODivision": {
   "label": "事業部",
   "en": "Division",
   "desc": "事業本部の下の事業部",
   "syn": [
    "事業部",
    "ディビジョン"
   ],
   "kind": "Foundation",
   "status": "active",
   "effectiveDated": true,
   "keys": [
    "externalCode",
    "startDate"
   ],
   "baseObject": true,
   "events": [
    "onInit",
    "onSave"
   ],
   "fields": {
    "externalCode": {
     "label": "コード",
     "en": "Code",
     "dataType": "String",
     "maxLength": 128,
     "required": true,
     "readOnly": true,
     "desc": "事業部を一意に識別するコード（externalCode）。ルールでは {\"object\":\"FODivision\",\"codes\":[...]} の値として使う",
     "syn": [
      "事業部コード",
      "事業部ID"
     ]
    },
    "startDate": {
     "label": "有効開始日",
     "en": "Start Date",
     "dataType": "Date",
     "required": true,
     "desc": "事業部レコードの有効開始日",
     "syn": [
      "事業部の開始日"
     ]
    },
    "endDate": {
     "label": "有効終了日",
     "en": "End Date",
     "dataType": "Date",
     "readOnly": true,
     "desc": "事業部レコードの有効終了日。システムが設定する",
     "syn": [
      "事業部の終了日"
     ]
    },
    "name": {
     "label": "名称",
     "en": "Name",
     "dataType": "Translatable",
     "maxLength": 128,
     "required": true,
     "desc": "事業部の名称",
     "syn": [
      "事業部名"
     ]
    },
    "description": {
     "label": "説明",
     "en": "Description",
     "dataType": "String",
     "maxLength": 255,
     "desc": "事業部の説明（自由入力）",
     "syn": [
      "事業部の備考"
     ]
    },
    "status": {
     "label": "ステータス",
     "en": "Status",
     "dataType": "Picklist",
     "source": "status",
     "required": true,
     "desc": "事業部レコードが有効か無効か",
     "syn": [
      "事業部の有効・無効"
     ]
    },
    "parentBusinessUnit": {
     "label": "上位の事業本部",
     "en": "Parent Business Unit",
     "dataType": "FoundationObject",
     "source": "FOBusinessUnit",
     "desc": "この事業部が属する事業本部",
     "syn": [
      "所属本部"
     ]
    },
    "headOfUnit": {
     "label": "事業部長",
     "en": "Head of Unit",
     "dataType": "User",
     "source": "User",
     "desc": "事業部の長（User）",
     "syn": [
      "事業部の長"
     ]
    }
   }
  },
  "FODepartment": {
   "label": "部署",
   "en": "Department",
   "desc": "事業部の下の部・課などの部署。部署長とコストセンターを持ち、階層（上位部署）を作れる",
   "syn": [
    "部署",
    "部門",
    "組織"
   ],
   "kind": "Foundation",
   "status": "active",
   "effectiveDated": true,
   "keys": [
    "externalCode",
    "startDate"
   ],
   "baseObject": true,
   "events": [
    "onInit",
    "onSave"
   ],
   "associations": [
    {
     "id": "cust_toDivision",
     "target": "FODivision",
     "multiplicity": "1:n",
     "type": "valid-when"
    }
   ],
   "fields": {
    "externalCode": {
     "label": "コード",
     "en": "Code",
     "dataType": "String",
     "maxLength": 128,
     "required": true,
     "readOnly": true,
     "desc": "部署を一意に識別するコード（externalCode）。ルールでは {\"object\":\"FODepartment\",\"codes\":[...]} の値として使う",
     "syn": [
      "部署コード",
      "部署ID"
     ]
    },
    "startDate": {
     "label": "有効開始日",
     "en": "Start Date",
     "dataType": "Date",
     "required": true,
     "desc": "部署レコードの有効開始日",
     "syn": [
      "部署の開始日"
     ]
    },
    "endDate": {
     "label": "有効終了日",
     "en": "End Date",
     "dataType": "Date",
     "readOnly": true,
     "desc": "部署レコードの有効終了日。システムが設定する",
     "syn": [
      "部署の終了日"
     ]
    },
    "name": {
     "label": "名称",
     "en": "Name",
     "dataType": "Translatable",
     "maxLength": 128,
     "required": true,
     "desc": "部署の名称",
     "syn": [
      "部署名"
     ]
    },
    "description": {
     "label": "説明",
     "en": "Description",
     "dataType": "String",
     "maxLength": 255,
     "desc": "部署の説明（自由入力）",
     "syn": [
      "部署の備考"
     ]
    },
    "status": {
     "label": "ステータス",
     "en": "Status",
     "dataType": "Picklist",
     "source": "status",
     "required": true,
     "desc": "部署レコードが有効か無効か",
     "syn": [
      "部署の有効・無効"
     ]
    },
    "parent": {
     "label": "上位部署",
     "en": "Parent Department",
     "dataType": "FoundationObject",
     "source": "FODepartment",
     "desc": "一つ上の階層の部署",
     "syn": [
      "親部署",
      "上位組織"
     ]
    },
    "headOfUnit": {
     "label": "部署長",
     "en": "Head of Unit",
     "dataType": "User",
     "source": "User",
     "desc": "部署の長（User）。社員の直属の上司（EmpJob.managerId）と同じ人とは限らない",
     "syn": [
      "部署長",
      "部門長",
      "所属長",
      "所属組織の長",
      "組織長"
     ]
    },
    "costCenter": {
     "label": "コストセンター",
     "en": "Cost Center",
     "dataType": "FoundationObject",
     "source": "FOCostCenter",
     "desc": "部署の標準のコストセンター",
     "syn": [
      "部署の原価センター"
     ]
    }
   }
  },
  "FOLocation": {
   "label": "勤務地",
   "en": "Location",
   "desc": "社員が働く事業所（本社・支社・営業所）。所定労働時間とタイムゾーンを持つ",
   "syn": [
    "勤務地",
    "事業所",
    "ロケーション"
   ],
   "kind": "Foundation",
   "status": "active",
   "effectiveDated": true,
   "keys": [
    "externalCode",
    "startDate"
   ],
   "baseObject": true,
   "events": [
    "onInit",
    "onSave"
   ],
   "associations": [
    {
     "id": "companyFlxNav",
     "target": "FOCompany",
     "multiplicity": "1:n",
     "type": "valid-when"
    }
   ],
   "fields": {
    "externalCode": {
     "label": "コード",
     "en": "Code",
     "dataType": "String",
     "maxLength": 128,
     "required": true,
     "readOnly": true,
     "desc": "勤務地を一意に識別するコード（externalCode）。ルールでは {\"object\":\"FOLocation\",\"codes\":[...]} の値として使う",
     "syn": [
      "勤務地コード",
      "勤務地ID"
     ]
    },
    "startDate": {
     "label": "有効開始日",
     "en": "Start Date",
     "dataType": "Date",
     "required": true,
     "desc": "勤務地レコードの有効開始日",
     "syn": [
      "勤務地の開始日"
     ]
    },
    "endDate": {
     "label": "有効終了日",
     "en": "End Date",
     "dataType": "Date",
     "readOnly": true,
     "desc": "勤務地レコードの有効終了日。システムが設定する",
     "syn": [
      "勤務地の終了日"
     ]
    },
    "name": {
     "label": "名称",
     "en": "Name",
     "dataType": "String",
     "maxLength": 128,
     "required": true,
     "desc": "勤務地の名称",
     "syn": [
      "勤務地名"
     ]
    },
    "description": {
     "label": "説明",
     "en": "Description",
     "dataType": "String",
     "maxLength": 255,
     "desc": "勤務地の説明（自由入力）",
     "syn": [
      "勤務地の備考"
     ]
    },
    "status": {
     "label": "ステータス",
     "en": "Status",
     "dataType": "Picklist",
     "source": "status",
     "required": true,
     "desc": "勤務地レコードが有効か無効か",
     "syn": [
      "勤務地の有効・無効"
     ]
    },
    "standardHours": {
     "label": "所定労働時間（週）",
     "en": "Standard Weekly Hours",
     "dataType": "Decimal",
     "decimals": 2,
     "desc": "その勤務地の標準の週所定労働時間",
     "syn": [
      "事業所の所定時間"
     ]
    },
    "timezone": {
     "label": "タイムゾーン",
     "en": "Time Zone",
     "dataType": "String",
     "maxLength": 40,
     "desc": "勤務地のタイムゾーン",
     "syn": [
      "TZ"
     ]
    }
   }
  },
  "FOCostCenter": {
   "label": "コストセンター",
   "en": "Cost Center",
   "desc": "人件費を計上する単位",
   "syn": [
    "コストセンター",
    "原価センター"
   ],
   "kind": "Foundation",
   "status": "active",
   "effectiveDated": true,
   "keys": [
    "externalCode",
    "startDate"
   ],
   "baseObject": true,
   "events": [
    "onInit",
    "onSave"
   ],
   "fields": {
    "externalCode": {
     "label": "コード",
     "en": "Code",
     "dataType": "String",
     "maxLength": 128,
     "required": true,
     "readOnly": true,
     "desc": "コストセンターを一意に識別するコード（externalCode）。ルールでは {\"object\":\"FOCostCenter\",\"codes\":[...]} の値として使う",
     "syn": [
      "コストセンターコード",
      "コストセンターID"
     ]
    },
    "startDate": {
     "label": "有効開始日",
     "en": "Start Date",
     "dataType": "Date",
     "required": true,
     "desc": "コストセンターレコードの有効開始日",
     "syn": [
      "コストセンターの開始日"
     ]
    },
    "endDate": {
     "label": "有効終了日",
     "en": "End Date",
     "dataType": "Date",
     "readOnly": true,
     "desc": "コストセンターレコードの有効終了日。システムが設定する",
     "syn": [
      "コストセンターの終了日"
     ]
    },
    "name": {
     "label": "名称",
     "en": "Name",
     "dataType": "String",
     "maxLength": 128,
     "required": true,
     "desc": "コストセンターの名称",
     "syn": [
      "コストセンター名"
     ]
    },
    "description": {
     "label": "説明",
     "en": "Description",
     "dataType": "String",
     "maxLength": 255,
     "desc": "コストセンターの説明（自由入力）",
     "syn": [
      "コストセンターの備考"
     ]
    },
    "status": {
     "label": "ステータス",
     "en": "Status",
     "dataType": "Picklist",
     "source": "status",
     "required": true,
     "desc": "コストセンターレコードが有効か無効か",
     "syn": [
      "コストセンターの有効・無効"
     ]
    },
    "legalEntity": {
     "label": "会社",
     "en": "Legal Entity",
     "dataType": "FoundationObject",
     "source": "FOCompany",
     "desc": "コストセンターが属する会社",
     "syn": [
      "計上会社"
     ]
    }
   }
  },
  "FOJobCode": {
   "label": "職務コード",
   "en": "Job Classification",
   "desc": "職務の種類（営業・エンジニア・人事など）と、その標準の条件（等級・所定時間・フルタイムか）",
   "syn": [
    "職務コード",
    "ジョブコード",
    "職種"
   ],
   "kind": "Foundation",
   "status": "active",
   "effectiveDated": true,
   "keys": [
    "externalCode",
    "startDate"
   ],
   "baseObject": true,
   "events": [
    "onInit",
    "onSave"
   ],
   "fields": {
    "externalCode": {
     "label": "コード",
     "en": "Code",
     "dataType": "String",
     "maxLength": 128,
     "required": true,
     "readOnly": true,
     "desc": "職務コードを一意に識別するコード（externalCode）。ルールでは {\"object\":\"FOJobCode\",\"codes\":[...]} の値として使う",
     "syn": [
      "職務コードコード",
      "職務コードID"
     ]
    },
    "startDate": {
     "label": "有効開始日",
     "en": "Start Date",
     "dataType": "Date",
     "required": true,
     "desc": "職務コードレコードの有効開始日",
     "syn": [
      "職務コードの開始日"
     ]
    },
    "endDate": {
     "label": "有効終了日",
     "en": "End Date",
     "dataType": "Date",
     "readOnly": true,
     "desc": "職務コードレコードの有効終了日。システムが設定する",
     "syn": [
      "職務コードの終了日"
     ]
    },
    "name": {
     "label": "名称",
     "en": "Name",
     "dataType": "Translatable",
     "maxLength": 128,
     "required": true,
     "desc": "職務コードの名称",
     "syn": [
      "職務コード名"
     ]
    },
    "description": {
     "label": "説明",
     "en": "Description",
     "dataType": "String",
     "maxLength": 255,
     "desc": "職務コードの説明（自由入力）",
     "syn": [
      "職務コードの備考"
     ]
    },
    "status": {
     "label": "ステータス",
     "en": "Status",
     "dataType": "Picklist",
     "source": "status",
     "required": true,
     "desc": "職務コードレコードが有効か無効か",
     "syn": [
      "職務コードの有効・無効"
     ]
    },
    "grade": {
     "label": "標準の等級",
     "en": "Pay Grade",
     "dataType": "FoundationObject",
     "source": "FOPayGrade",
     "desc": "その職務の標準の等級（FOPayGrade）",
     "syn": [
      "基準等級"
     ]
    },
    "isFulltimeEmployee": {
     "label": "フルタイム",
     "en": "Is Full-Time Employee",
     "dataType": "Boolean",
     "desc": "その職務がフルタイムかどうかの既定値",
     "syn": [
      "フルタイム職務"
     ]
    },
    "isRegular": {
     "label": "正規雇用",
     "en": "Regular/Temporary",
     "dataType": "Boolean",
     "desc": "その職務が正規雇用かどうかの既定値",
     "syn": [
      "正規職務"
     ]
    },
    "standardHours": {
     "label": "所定労働時間（週）",
     "en": "Standard Weekly Hours",
     "dataType": "Decimal",
     "decimals": 2,
     "desc": "その職務の標準の週所定労働時間",
     "syn": [
      "職務の所定時間"
     ]
    }
   }
  },
  "FOPayGrade": {
   "label": "等級",
   "en": "Pay Grade",
   "desc": "給与テーブル上の等級（G1〜G8）。等級レベルで上下を比較できる",
   "syn": [
    "等級",
    "グレード",
    "給与等級"
   ],
   "kind": "Foundation",
   "status": "active",
   "effectiveDated": true,
   "keys": [
    "externalCode",
    "startDate"
   ],
   "baseObject": true,
   "events": [
    "onInit",
    "onSave"
   ],
   "fields": {
    "externalCode": {
     "label": "コード",
     "en": "Code",
     "dataType": "String",
     "maxLength": 128,
     "required": true,
     "readOnly": true,
     "desc": "等級を一意に識別するコード（externalCode）。ルールでは {\"object\":\"FOPayGrade\",\"codes\":[...]} の値として使う",
     "syn": [
      "等級コード",
      "等級ID"
     ]
    },
    "startDate": {
     "label": "有効開始日",
     "en": "Start Date",
     "dataType": "Date",
     "required": true,
     "desc": "等級レコードの有効開始日",
     "syn": [
      "等級の開始日"
     ]
    },
    "endDate": {
     "label": "有効終了日",
     "en": "End Date",
     "dataType": "Date",
     "readOnly": true,
     "desc": "等級レコードの有効終了日。システムが設定する",
     "syn": [
      "等級の終了日"
     ]
    },
    "name": {
     "label": "名称",
     "en": "Name",
     "dataType": "String",
     "maxLength": 128,
     "required": true,
     "desc": "等級の名称",
     "syn": [
      "等級名"
     ]
    },
    "description": {
     "label": "説明",
     "en": "Description",
     "dataType": "String",
     "maxLength": 255,
     "desc": "等級の説明（自由入力）",
     "syn": [
      "等級の備考"
     ]
    },
    "status": {
     "label": "ステータス",
     "en": "Status",
     "dataType": "Picklist",
     "source": "status",
     "required": true,
     "desc": "等級レコードが有効か無効か",
     "syn": [
      "等級の有効・無効"
     ]
    },
    "paygradeLevel": {
     "label": "等級レベル",
     "en": "Pay Grade Level",
     "dataType": "Long",
     "desc": "等級の高さを表す数値（1〜8）。等級の上下比較に使う",
     "syn": [
      "等級の序列",
      "グレードレベル"
     ]
    }
   }
  },
  "FOEventReason": {
   "label": "イベント事由",
   "en": "Event Reason",
   "desc": "人事イベントの理由（新卒入社・定期昇格・出向など）。どのイベントに属し、発令後の在籍ステータスが何かを持つ",
   "syn": [
    "イベント事由",
    "発令事由"
   ],
   "kind": "Foundation",
   "status": "active",
   "effectiveDated": true,
   "keys": [
    "externalCode",
    "startDate"
   ],
   "baseObject": true,
   "events": [
    "onInit",
    "onSave"
   ],
   "fields": {
    "externalCode": {
     "label": "コード",
     "en": "Code",
     "dataType": "String",
     "maxLength": 128,
     "required": true,
     "readOnly": true,
     "desc": "イベント事由を一意に識別するコード（externalCode）。ルールでは {\"object\":\"FOEventReason\",\"codes\":[...]} の値として使う",
     "syn": [
      "イベント事由コード",
      "イベント事由ID"
     ]
    },
    "startDate": {
     "label": "有効開始日",
     "en": "Start Date",
     "dataType": "Date",
     "required": true,
     "desc": "イベント事由レコードの有効開始日",
     "syn": [
      "イベント事由の開始日"
     ]
    },
    "endDate": {
     "label": "有効終了日",
     "en": "End Date",
     "dataType": "Date",
     "readOnly": true,
     "desc": "イベント事由レコードの有効終了日。システムが設定する",
     "syn": [
      "イベント事由の終了日"
     ]
    },
    "name": {
     "label": "名称",
     "en": "Name",
     "dataType": "String",
     "maxLength": 128,
     "required": true,
     "desc": "イベント事由の名称",
     "syn": [
      "イベント事由名"
     ]
    },
    "description": {
     "label": "説明",
     "en": "Description",
     "dataType": "String",
     "maxLength": 255,
     "desc": "イベント事由の説明（自由入力）",
     "syn": [
      "イベント事由の備考"
     ]
    },
    "status": {
     "label": "ステータス",
     "en": "Status",
     "dataType": "Picklist",
     "source": "status",
     "required": true,
     "desc": "イベント事由レコードが有効か無効か",
     "syn": [
      "イベント事由の有効・無効"
     ]
    },
    "event": {
     "label": "イベント",
     "en": "Event",
     "dataType": "Picklist",
     "source": "event",
     "required": true,
     "desc": "このイベント事由が属するイベント",
     "syn": [
      "対象イベント"
     ]
    },
    "emplStatus": {
     "label": "在籍ステータス",
     "en": "Employee Status",
     "dataType": "Picklist",
     "source": "employee-status",
     "desc": "この事由で発令したときの在籍ステータス",
     "syn": [
      "発令後の在籍状況"
     ]
    }
   }
  },
  "FOPayGroup": {
   "label": "給与グループ",
   "en": "Pay Group",
   "desc": "給与計算をまとめて行う単位と、その支払頻度",
   "syn": [
    "給与グループ",
    "支給グループ"
   ],
   "kind": "Foundation",
   "status": "active",
   "effectiveDated": true,
   "keys": [
    "externalCode",
    "startDate"
   ],
   "baseObject": true,
   "events": [
    "onInit",
    "onSave"
   ],
   "fields": {
    "externalCode": {
     "label": "コード",
     "en": "Code",
     "dataType": "String",
     "maxLength": 128,
     "required": true,
     "readOnly": true,
     "desc": "給与グループを一意に識別するコード（externalCode）。ルールでは {\"object\":\"FOPayGroup\",\"codes\":[...]} の値として使う",
     "syn": [
      "給与グループコード",
      "給与グループID"
     ]
    },
    "startDate": {
     "label": "有効開始日",
     "en": "Start Date",
     "dataType": "Date",
     "required": true,
     "desc": "給与グループレコードの有効開始日",
     "syn": [
      "給与グループの開始日"
     ]
    },
    "endDate": {
     "label": "有効終了日",
     "en": "End Date",
     "dataType": "Date",
     "readOnly": true,
     "desc": "給与グループレコードの有効終了日。システムが設定する",
     "syn": [
      "給与グループの終了日"
     ]
    },
    "name": {
     "label": "名称",
     "en": "Name",
     "dataType": "String",
     "maxLength": 128,
     "required": true,
     "desc": "給与グループの名称",
     "syn": [
      "給与グループ名"
     ]
    },
    "description": {
     "label": "説明",
     "en": "Description",
     "dataType": "String",
     "maxLength": 255,
     "desc": "給与グループの説明（自由入力）",
     "syn": [
      "給与グループの備考"
     ]
    },
    "status": {
     "label": "ステータス",
     "en": "Status",
     "dataType": "Picklist",
     "source": "status",
     "required": true,
     "desc": "給与グループレコードが有効か無効か",
     "syn": [
      "給与グループの有効・無効"
     ]
    },
    "payFrequency": {
     "label": "支払頻度",
     "en": "Payment Frequency",
     "dataType": "FoundationObject",
     "source": "FOFrequency",
     "desc": "給与を支払う頻度",
     "syn": [
      "給与支払サイクル"
     ]
    }
   }
  },
  "FOPayComponent": {
   "label": "報酬項目",
   "en": "Pay Component",
   "desc": "基本給・手当・賞与などの報酬項目の定義（種類・定期か・標準の金額）",
   "syn": [
    "報酬項目",
    "給与項目",
    "手当マスタ"
   ],
   "kind": "Foundation",
   "status": "active",
   "effectiveDated": true,
   "keys": [
    "externalCode",
    "startDate"
   ],
   "baseObject": true,
   "events": [
    "onInit",
    "onSave"
   ],
   "fields": {
    "externalCode": {
     "label": "コード",
     "en": "Code",
     "dataType": "String",
     "maxLength": 128,
     "required": true,
     "readOnly": true,
     "desc": "報酬項目を一意に識別するコード（externalCode）。ルールでは {\"object\":\"FOPayComponent\",\"codes\":[...]} の値として使う",
     "syn": [
      "報酬項目コード",
      "報酬項目ID"
     ]
    },
    "startDate": {
     "label": "有効開始日",
     "en": "Start Date",
     "dataType": "Date",
     "required": true,
     "desc": "報酬項目レコードの有効開始日",
     "syn": [
      "報酬項目の開始日"
     ]
    },
    "endDate": {
     "label": "有効終了日",
     "en": "End Date",
     "dataType": "Date",
     "readOnly": true,
     "desc": "報酬項目レコードの有効終了日。システムが設定する",
     "syn": [
      "報酬項目の終了日"
     ]
    },
    "name": {
     "label": "名称",
     "en": "Name",
     "dataType": "String",
     "maxLength": 128,
     "required": true,
     "desc": "報酬項目の名称",
     "syn": [
      "報酬項目名"
     ]
    },
    "description": {
     "label": "説明",
     "en": "Description",
     "dataType": "String",
     "maxLength": 255,
     "desc": "報酬項目の説明（自由入力）",
     "syn": [
      "報酬項目の備考"
     ]
    },
    "status": {
     "label": "ステータス",
     "en": "Status",
     "dataType": "Picklist",
     "source": "status",
     "required": true,
     "desc": "報酬項目レコードが有効か無効か",
     "syn": [
      "報酬項目の有効・無効"
     ]
    },
    "payComponentType": {
     "label": "種類",
     "en": "Pay Component Type",
     "dataType": "Picklist",
     "source": "payComponentType",
     "required": true,
     "desc": "金額で払うか割合で払うか",
     "syn": [
      "支給方法"
     ]
    },
    "isRecurring": {
     "label": "定期",
     "en": "Recurring",
     "dataType": "Boolean",
     "desc": "毎月支給する報酬項目かどうか",
     "syn": [
      "定期支給"
     ]
    },
    "currency": {
     "label": "通貨",
     "en": "Currency",
     "dataType": "GenericObject",
     "source": "Currency",
     "desc": "報酬項目の標準の通貨",
     "syn": [
      "既定通貨"
     ]
    },
    "frequencyCode": {
     "label": "頻度",
     "en": "Frequency",
     "dataType": "FoundationObject",
     "source": "FOFrequency",
     "desc": "報酬項目の標準の支給頻度",
     "syn": [
      "既定の頻度"
     ]
    },
    "payComponentValue": {
     "label": "標準の金額",
     "en": "Value",
     "dataType": "Decimal",
     "decimals": 2,
     "desc": "報酬項目の標準の金額",
     "syn": [
      "標準額",
      "既定額"
     ]
    }
   }
  },
  "FOFrequency": {
   "label": "頻度",
   "en": "Frequency",
   "desc": "支給の頻度（月次・年次など）と年換算の係数",
   "syn": [
    "頻度",
    "支給頻度"
   ],
   "kind": "Foundation",
   "status": "active",
   "effectiveDated": true,
   "keys": [
    "externalCode",
    "startDate"
   ],
   "baseObject": true,
   "events": [
    "onInit",
    "onSave"
   ],
   "fields": {
    "externalCode": {
     "label": "コード",
     "en": "Code",
     "dataType": "String",
     "maxLength": 128,
     "required": true,
     "readOnly": true,
     "desc": "頻度を一意に識別するコード（externalCode）。ルールでは {\"object\":\"FOFrequency\",\"codes\":[...]} の値として使う",
     "syn": [
      "頻度コード",
      "頻度ID"
     ]
    },
    "startDate": {
     "label": "有効開始日",
     "en": "Start Date",
     "dataType": "Date",
     "required": true,
     "desc": "頻度レコードの有効開始日",
     "syn": [
      "頻度の開始日"
     ]
    },
    "endDate": {
     "label": "有効終了日",
     "en": "End Date",
     "dataType": "Date",
     "readOnly": true,
     "desc": "頻度レコードの有効終了日。システムが設定する",
     "syn": [
      "頻度の終了日"
     ]
    },
    "name": {
     "label": "名称",
     "en": "Name",
     "dataType": "String",
     "maxLength": 128,
     "required": true,
     "desc": "頻度の名称",
     "syn": [
      "頻度名"
     ]
    },
    "description": {
     "label": "説明",
     "en": "Description",
     "dataType": "String",
     "maxLength": 255,
     "desc": "頻度の説明（自由入力）",
     "syn": [
      "頻度の備考"
     ]
    },
    "status": {
     "label": "ステータス",
     "en": "Status",
     "dataType": "Picklist",
     "source": "status",
     "required": true,
     "desc": "頻度レコードが有効か無効か",
     "syn": [
      "頻度の有効・無効"
     ]
    },
    "annualizationFactor": {
     "label": "年換算係数",
     "en": "Annualization Factor",
     "dataType": "Decimal",
     "decimals": 4,
     "required": true,
     "desc": "年額に換算するときの係数（月次なら 12）",
     "syn": [
      "年換算"
     ]
    }
   }
  },
  "Country": {
   "label": "国",
   "en": "Country",
   "desc": "国。標準の通貨を持つ",
   "syn": [
    "国",
    "国マスタ"
   ],
   "kind": "GO",
   "status": "active",
   "effectiveDated": false,
   "keys": [
    "externalCode"
   ],
   "baseObject": true,
   "events": [
    "onInit",
    "onValidate",
    "onChange",
    "onSave",
    "onPostSave",
    "onDelete",
    "onLoad"
   ],
   "fields": {
    "externalCode": {
     "label": "コード",
     "en": "Code",
     "dataType": "String",
     "maxLength": 128,
     "required": true,
     "readOnly": true,
     "desc": "国を一意に識別するコード（externalCode）。ルールでは {\"object\":\"Country\",\"codes\":[...]} の値として使う",
     "syn": [
      "国コード",
      "国ID"
     ]
    },
    "externalName": {
     "label": "名称",
     "en": "Name",
     "dataType": "String",
     "maxLength": 255,
     "desc": "国の名称",
     "syn": [
      "国名"
     ]
    },
    "mdfSystemStatus": {
     "label": "ステータス",
     "en": "Status",
     "dataType": "Picklist",
     "source": "status",
     "required": true,
     "desc": "国レコードが有効か無効か",
     "syn": [
      "国の有効・無効"
     ]
    },
    "currency": {
     "label": "通貨",
     "en": "Currency",
     "dataType": "GenericObject",
     "source": "Currency",
     "desc": "その国の通貨",
     "syn": [
      "国の通貨"
     ]
    }
   }
  },
  "Currency": {
   "label": "通貨",
   "en": "Currency",
   "desc": "通貨",
   "syn": [
    "通貨",
    "通貨マスタ"
   ],
   "kind": "GO",
   "status": "active",
   "effectiveDated": false,
   "keys": [
    "externalCode"
   ],
   "baseObject": true,
   "events": [
    "onInit",
    "onValidate",
    "onChange",
    "onSave",
    "onPostSave",
    "onDelete",
    "onLoad"
   ],
   "fields": {
    "externalCode": {
     "label": "コード",
     "en": "Code",
     "dataType": "String",
     "maxLength": 128,
     "required": true,
     "readOnly": true,
     "desc": "通貨を一意に識別するコード（externalCode）。ルールでは {\"object\":\"Currency\",\"codes\":[...]} の値として使う",
     "syn": [
      "通貨コード",
      "通貨ID"
     ]
    },
    "externalName": {
     "label": "名称",
     "en": "Name",
     "dataType": "String",
     "maxLength": 255,
     "desc": "通貨の名称",
     "syn": [
      "通貨名"
     ]
    },
    "mdfSystemStatus": {
     "label": "ステータス",
     "en": "Status",
     "dataType": "Picklist",
     "source": "status",
     "required": true,
     "desc": "通貨レコードが有効か無効か",
     "syn": [
      "通貨の有効・無効"
     ]
    },
    "symbol": {
     "label": "記号",
     "en": "Symbol",
     "dataType": "String",
     "maxLength": 5,
     "desc": "通貨記号（¥、$ など）",
     "syn": [
      "記号"
     ]
    }
   }
  },
  "Position": {
   "label": "ポジション",
   "en": "Position",
   "desc": "ポジション管理のポジション。組織上の席で、会社・部署・職務・等級と上位ポジションを持つ",
   "syn": [
    "ポジション",
    "ポスト",
    "席"
   ],
   "kind": "GO",
   "status": "active",
   "effectiveDated": true,
   "keys": [
    "externalCode",
    "effectiveStartDate"
   ],
   "baseObject": true,
   "events": [
    "onInit",
    "onValidate",
    "onChange",
    "onSave",
    "onPostSave",
    "onDelete",
    "onLoad",
    "onInsert"
   ],
   "fields": {
    "externalCode": {
     "label": "ポジションコード",
     "en": "Position Code",
     "dataType": "String",
     "maxLength": 128,
     "required": true,
     "readOnly": true,
     "desc": "ポジションを一意に識別するコード（externalCode）。ルールでは {\"object\":\"Position\",\"codes\":[...]} の値として使う",
     "syn": [
      "ポジションコード",
      "ポジションID"
     ]
    },
    "effectiveStartDate": {
     "label": "有効開始日",
     "en": "Effective Start Date",
     "dataType": "Date",
     "required": true,
     "desc": "ポジションレコードの有効開始日",
     "syn": [
      "ポジションの開始日"
     ]
    },
    "externalName": {
     "label": "名称",
     "en": "Name",
     "dataType": "Translatable",
     "maxLength": 255,
     "desc": "ポジションの名称",
     "syn": [
      "ポジション名"
     ]
    },
    "mdfSystemStatus": {
     "label": "ステータス",
     "en": "Status",
     "dataType": "Picklist",
     "source": "status",
     "required": true,
     "desc": "ポジションレコードが有効か無効か",
     "syn": [
      "ポジションの有効・無効"
     ]
    },
    "company": {
     "label": "会社",
     "en": "Company",
     "dataType": "FoundationObject",
     "source": "FOCompany",
     "required": true,
     "desc": "ポジションが属する会社",
     "syn": [
      "ポジションの会社"
     ]
    },
    "department": {
     "label": "部署",
     "en": "Department",
     "dataType": "FoundationObject",
     "source": "FODepartment",
     "desc": "ポジションが属する部署",
     "syn": [
      "ポジションの部署"
     ]
    },
    "jobCode": {
     "label": "職務コード",
     "en": "Job Classification",
     "dataType": "FoundationObject",
     "source": "FOJobCode",
     "required": true,
     "desc": "ポジションの職務",
     "syn": [
      "ポジションの職務コード"
     ]
    },
    "payGrade": {
     "label": "等級",
     "en": "Pay Grade",
     "dataType": "FoundationObject",
     "source": "FOPayGrade",
     "desc": "ポジションの等級",
     "syn": [
      "ポジションの等級"
     ]
    },
    "location": {
     "label": "勤務地",
     "en": "Location",
     "dataType": "FoundationObject",
     "source": "FOLocation",
     "desc": "ポジションの勤務地",
     "syn": [
      "ポジションの勤務地"
     ]
    },
    "costCenter": {
     "label": "コストセンター",
     "en": "Cost Center",
     "dataType": "FoundationObject",
     "source": "FOCostCenter",
     "desc": "ポジションのコストセンター",
     "syn": [
      "ポジションの原価センター"
     ]
    },
    "parentPosition": {
     "label": "上位ポジション",
     "en": "Parent Position",
     "dataType": "GenericObject",
     "source": "Position",
     "desc": "組織図上で一つ上のポジション",
     "syn": [
      "親ポジション"
     ]
    },
    "vacant": {
     "label": "空席",
     "en": "To Be Hired",
     "dataType": "Boolean",
     "desc": "採用予定の空席ポジションかどうか",
     "syn": [
      "空きポスト",
      "欠員"
     ]
    },
    "targetFTE": {
     "label": "目標 FTE",
     "en": "Target FTE",
     "dataType": "Decimal",
     "decimals": 2,
     "desc": "ポジションの目標 FTE",
     "syn": [
      "定員FTE"
     ]
    },
    "standardHours": {
     "label": "所定労働時間（週）",
     "en": "Standard Weekly Hours",
     "dataType": "Decimal",
     "decimals": 2,
     "desc": "ポジションの週所定労働時間",
     "syn": [
      "ポジションの所定時間"
     ]
    },
    "cust_managerialTitle": {
     "label": "役職",
     "en": "Managerial Title",
     "dataType": "Picklist",
     "source": "JP_Position",
     "desc": "ポジションに付く役職（picklist JP_Position）",
     "syn": [
      "ポジションの役職"
     ]
    }
   }
  },
  "cust_JobFamily": {
   "label": "職群",
   "en": "Job Family",
   "desc": "職群のマスタ（営業職群・技術職群など）。職務情報の職群（customString4）から参照される",
   "syn": [
    "職群",
    "ジョブファミリー",
    "職種群"
   ],
   "kind": "MDF",
   "status": "active",
   "effectiveDated": true,
   "keys": [
    "externalCode",
    "effectiveStartDate"
   ],
   "baseObject": true,
   "events": [
    "onInit",
    "onValidate",
    "onChange",
    "onSave",
    "onPostSave",
    "onDelete",
    "onLoad",
    "onInsert"
   ],
   "fields": {
    "externalCode": {
     "label": "コード",
     "en": "Code",
     "dataType": "String",
     "maxLength": 128,
     "required": true,
     "readOnly": true,
     "desc": "職群を一意に識別するコード（externalCode）。ルールでは {\"object\":\"cust_JobFamily\",\"codes\":[...]} の値として使う",
     "syn": [
      "職群コード",
      "職群ID"
     ]
    },
    "effectiveStartDate": {
     "label": "有効開始日",
     "en": "Effective Start Date",
     "dataType": "Date",
     "required": true,
     "desc": "職群レコードの有効開始日",
     "syn": [
      "職群の開始日"
     ]
    },
    "externalName": {
     "label": "名称",
     "en": "Name",
     "dataType": "String",
     "maxLength": 255,
     "desc": "職群の名称",
     "syn": [
      "職群名"
     ]
    },
    "mdfSystemStatus": {
     "label": "ステータス",
     "en": "Status",
     "dataType": "Picklist",
     "source": "status",
     "required": true,
     "desc": "職群レコードが有効か無効か",
     "syn": [
      "職群の有効・無効"
     ]
    },
    "cust_defaultHRCategory": {
     "label": "標準の人事区分",
     "en": "Default HR Category",
     "dataType": "Picklist",
     "source": "JP_HRCategory",
     "desc": "その職群の標準のコース区分",
     "syn": [
      "既定の人事区分"
     ]
    }
   }
  },
  "cust_QualificationMaster": {
   "label": "資格マスタ",
   "en": "Qualification Master",
   "desc": "資格の種類ごとのマスタ（分類・レベル・資格手当の月額）。保有資格から参照される",
   "syn": [
    "資格マスタ",
    "資格の一覧"
   ],
   "kind": "MDF",
   "status": "active",
   "effectiveDated": true,
   "keys": [
    "externalCode",
    "effectiveStartDate"
   ],
   "baseObject": true,
   "events": [
    "onInit",
    "onValidate",
    "onChange",
    "onSave",
    "onPostSave",
    "onDelete",
    "onLoad",
    "onInsert"
   ],
   "fields": {
    "externalCode": {
     "label": "コード",
     "en": "Code",
     "dataType": "String",
     "maxLength": 128,
     "required": true,
     "readOnly": true,
     "desc": "資格マスタを一意に識別するコード（externalCode）。ルールでは {\"object\":\"cust_QualificationMaster\",\"codes\":[...]} の値として使う",
     "syn": [
      "資格マスタコード",
      "資格マスタID"
     ]
    },
    "effectiveStartDate": {
     "label": "有効開始日",
     "en": "Effective Start Date",
     "dataType": "Date",
     "required": true,
     "desc": "資格マスタレコードの有効開始日",
     "syn": [
      "資格マスタの開始日"
     ]
    },
    "externalName": {
     "label": "名称",
     "en": "Name",
     "dataType": "Translatable",
     "maxLength": 255,
     "desc": "資格マスタの名称",
     "syn": [
      "資格マスタ名"
     ]
    },
    "mdfSystemStatus": {
     "label": "ステータス",
     "en": "Status",
     "dataType": "Picklist",
     "source": "status",
     "required": true,
     "desc": "資格マスタレコードが有効か無効か",
     "syn": [
      "資格マスタの有効・無効"
     ]
    },
    "cust_category": {
     "label": "資格分類",
     "en": "Category",
     "dataType": "Picklist",
     "source": "JP_QualCategory",
     "required": true,
     "desc": "資格の分類（会計・語学・法務・IT）",
     "syn": [
      "資格の種類"
     ]
    },
    "cust_level": {
     "label": "レベル",
     "en": "Level",
     "dataType": "Picklist",
     "source": "JP_QualLevel",
     "parentField": "cust_category",
     "desc": "資格の難易度のレベル（1級・2級など）。親は資格分類。給与の等級とは無関係",
     "syn": [
      "資格の級",
      "難易度"
     ]
    },
    "cust_allowanceAmount": {
     "label": "資格手当（月額）",
     "en": "Monthly Allowance",
     "dataType": "Decimal",
     "decimals": 0,
     "desc": "その資格の資格手当の月額（円、マスタの金額）",
     "syn": [
      "資格手当額",
      "手当単価"
     ]
    },
    "cust_currency": {
     "label": "通貨",
     "en": "Currency",
     "dataType": "GenericObject",
     "source": "Currency",
     "desc": "資格手当の通貨",
     "syn": [
      "手当の通貨"
     ]
    }
   }
  },
  "cust_Qualification": {
   "label": "保有資格",
   "en": "Qualification",
   "desc": "社員が保有する免許・検定の記録（取得日・有効期限・資格手当）。雇用保険の資格とは無関係",
   "syn": [
    "保有資格",
    "資格情報",
    "免許"
   ],
   "kind": "MDF",
   "status": "active",
   "effectiveDated": true,
   "keys": [
    "externalCode",
    "effectiveStartDate"
   ],
   "baseObject": true,
   "events": [
    "onInit",
    "onValidate",
    "onChange",
    "onSave",
    "onPostSave",
    "onDelete",
    "onLoad",
    "onInsert"
   ],
   "fields": {
    "externalCode": {
     "label": "コード",
     "en": "Code",
     "dataType": "AutoNumber",
     "required": true,
     "readOnly": true,
     "desc": "保有資格を一意に識別するコード（externalCode）。ルールでは {\"object\":\"cust_Qualification\",\"codes\":[...]} の値として使う",
     "syn": [
      "保有資格コード",
      "保有資格ID"
     ]
    },
    "effectiveStartDate": {
     "label": "有効開始日",
     "en": "Effective Start Date",
     "dataType": "Date",
     "required": true,
     "desc": "保有資格レコードの有効開始日",
     "syn": [
      "保有資格の開始日"
     ]
    },
    "externalName": {
     "label": "名称",
     "en": "Name",
     "dataType": "String",
     "maxLength": 255,
     "desc": "保有資格の名称",
     "syn": [
      "保有資格名"
     ]
    },
    "mdfSystemStatus": {
     "label": "ステータス",
     "en": "Status",
     "dataType": "Picklist",
     "source": "status",
     "required": true,
     "desc": "保有資格レコードが有効か無効か",
     "syn": [
      "保有資格の有効・無効"
     ]
    },
    "cust_user": {
     "label": "対象者",
     "en": "Employee",
     "dataType": "User",
     "source": "User",
     "required": true,
     "desc": "資格を持っている社員（User）",
     "syn": [
      "保有者",
      "従業員"
     ]
    },
    "cust_qualification": {
     "label": "資格",
     "en": "Qualification",
     "dataType": "GenericObject",
     "source": "cust_QualificationMaster",
     "required": true,
     "desc": "保有資格。カスタム MDF cust_QualificationMaster を参照する Generic Object 項目",
     "syn": [
      "資格名",
      "免許名"
     ]
    },
    "cust_category": {
     "label": "資格分類",
     "en": "Category",
     "dataType": "Picklist",
     "source": "JP_QualCategory",
     "desc": "保有資格の分類（会計・語学など）",
     "syn": [
      "資格の種類"
     ]
    },
    "cust_level": {
     "label": "レベル",
     "en": "Level",
     "dataType": "Picklist",
     "source": "JP_QualLevel",
     "parentField": "cust_category",
     "desc": "資格レベル。親の picklist（資格分類）に連動する",
     "syn": [
      "級",
      "資格の級"
     ]
    },
    "cust_acquiredDate": {
     "label": "取得日",
     "en": "Acquired Date",
     "dataType": "Date",
     "desc": "免許・検定などの資格を取得した（合格した）日。雇用保険の資格取得日（EmpEmployment.customDate4）とは別物",
     "syn": [
      "資格取得日",
      "免許取得日",
      "合格日"
     ]
    },
    "cust_expiryDate": {
     "label": "有効期限",
     "en": "Expiry Date",
     "dataType": "Date",
     "desc": "資格の有効期限。雇用契約の満了日やレコードの有効終了日ではない",
     "syn": [
      "資格有効期限",
      "免許の期限",
      "更新期限"
     ]
    },
    "cust_allowanceEligible": {
     "label": "資格手当対象",
     "en": "Allowance Eligible",
     "dataType": "Boolean",
     "desc": "資格手当を支給する対象かどうか",
     "syn": [
      "手当支給対象"
     ]
    },
    "cust_allowanceAmount": {
     "label": "資格手当（月額）",
     "en": "Monthly Allowance",
     "dataType": "Decimal",
     "decimals": 0,
     "desc": "資格手当の月額（小数、資格マスタの金額を転記する）。社員プロファイルの資格手当（cust_qualificationAllowance）は整数で持つ",
     "syn": [
      "資格手当",
      "手当額"
     ]
    }
   }
  },
  "cust_PromotionHistory": {
   "label": "昇進昇格履歴",
   "en": "Promotion History",
   "desc": "昇進・昇格の記録（変更前後の等級・昇格区分・承認者）",
   "syn": [
    "昇進昇格履歴",
    "昇格履歴"
   ],
   "kind": "MDF",
   "status": "active",
   "effectiveDated": true,
   "keys": [
    "externalCode",
    "effectiveStartDate"
   ],
   "baseObject": true,
   "events": [
    "onInit",
    "onValidate",
    "onChange",
    "onSave",
    "onPostSave",
    "onDelete",
    "onLoad",
    "onInsert"
   ],
   "fields": {
    "externalCode": {
     "label": "コード",
     "en": "Code",
     "dataType": "AutoNumber",
     "required": true,
     "readOnly": true,
     "desc": "昇進昇格履歴を一意に識別するコード（externalCode）。ルールでは {\"object\":\"cust_PromotionHistory\",\"codes\":[...]} の値として使う",
     "syn": [
      "昇進昇格履歴コード",
      "昇進昇格履歴ID"
     ]
    },
    "effectiveStartDate": {
     "label": "有効開始日",
     "en": "Effective Start Date",
     "dataType": "Date",
     "required": true,
     "desc": "昇進昇格履歴レコードの有効開始日",
     "syn": [
      "昇進昇格履歴の開始日"
     ]
    },
    "externalName": {
     "label": "名称",
     "en": "Name",
     "dataType": "String",
     "maxLength": 255,
     "desc": "昇進昇格履歴の名称",
     "syn": [
      "昇進昇格履歴名"
     ]
    },
    "mdfSystemStatus": {
     "label": "ステータス",
     "en": "Status",
     "dataType": "Picklist",
     "source": "status",
     "required": true,
     "desc": "昇進昇格履歴レコードが有効か無効か",
     "syn": [
      "昇進昇格履歴の有効・無効"
     ]
    },
    "cust_user": {
     "label": "対象者",
     "en": "Employee",
     "dataType": "User",
     "source": "User",
     "required": true,
     "desc": "昇進・昇格した社員（User）",
     "syn": [
      "対象社員"
     ]
    },
    "cust_fromGrade": {
     "label": "変更前等級",
     "en": "Previous Grade",
     "dataType": "FoundationObject",
     "source": "FOPayGrade",
     "desc": "昇格する前の等級（FOPayGrade）",
     "syn": [
      "旧等級"
     ]
    },
    "cust_toGrade": {
     "label": "変更後等級",
     "en": "New Grade",
     "dataType": "FoundationObject",
     "source": "FOPayGrade",
     "desc": "昇格した後の等級（FOPayGrade）",
     "syn": [
      "新等級"
     ]
    },
    "cust_promotionType": {
     "label": "昇格区分",
     "en": "Promotion Type",
     "dataType": "Picklist",
     "source": "JP_PromotionType",
     "desc": "昇格の区分（定期・抜擢・試験）",
     "syn": [
      "昇格種別"
     ]
    },
    "cust_approvedDate": {
     "label": "承認日",
     "en": "Approval Date",
     "dataType": "Date",
     "desc": "昇格を承認した日。発令日（effectiveStartDate）とは別",
     "syn": [
      "決裁日"
     ]
    },
    "cust_approver": {
     "label": "承認者",
     "en": "Approver",
     "dataType": "User",
     "source": "User",
     "desc": "昇格を承認した人（User）。直属の上司とは限らない",
     "syn": [
      "決裁者",
      "承認権者"
     ]
    }
   }
  },
  "cust_TrainingPlan": {
   "label": "研修計画",
   "en": "Training Plan",
   "desc": "社員の年度ごとの研修計画。明細（cust_TrainingItem）を子に持つコンポジット",
   "syn": [
    "研修計画",
    "教育計画"
   ],
   "kind": "MDF",
   "status": "active",
   "effectiveDated": true,
   "keys": [
    "externalCode",
    "effectiveStartDate"
   ],
   "baseObject": true,
   "events": [
    "onInit",
    "onValidate",
    "onChange",
    "onSave",
    "onPostSave",
    "onDelete",
    "onLoad",
    "onInsert"
   ],
   "associations": [
    {
     "id": "cust_items",
     "target": "cust_TrainingItem",
     "multiplicity": "1:n",
     "type": "composite"
    }
   ],
   "fields": {
    "externalCode": {
     "label": "コード",
     "en": "Code",
     "dataType": "AutoNumber",
     "required": true,
     "readOnly": true,
     "desc": "研修計画を一意に識別するコード（externalCode）。ルールでは {\"object\":\"cust_TrainingPlan\",\"codes\":[...]} の値として使う",
     "syn": [
      "研修計画コード",
      "研修計画ID"
     ]
    },
    "effectiveStartDate": {
     "label": "有効開始日",
     "en": "Effective Start Date",
     "dataType": "Date",
     "required": true,
     "desc": "研修計画レコードの有効開始日",
     "syn": [
      "研修計画の開始日"
     ]
    },
    "externalName": {
     "label": "名称",
     "en": "Name",
     "dataType": "String",
     "maxLength": 255,
     "desc": "研修計画の名称",
     "syn": [
      "研修計画名"
     ]
    },
    "mdfSystemStatus": {
     "label": "ステータス",
     "en": "Status",
     "dataType": "Picklist",
     "source": "status",
     "required": true,
     "desc": "研修計画レコードが有効か無効か",
     "syn": [
      "研修計画の有効・無効"
     ]
    },
    "cust_user": {
     "label": "対象者",
     "en": "Employee",
     "dataType": "User",
     "source": "User",
     "required": true,
     "desc": "研修計画の対象社員（User）",
     "syn": [
      "受講者"
     ]
    },
    "cust_fiscalYear": {
     "label": "年度",
     "en": "Fiscal Year",
     "dataType": "Long",
     "required": true,
     "desc": "研修計画の年度（例：2026、整数）。評価結果の年度（cust_AppraisalResult.cust_fiscalYear）は「FY2026」のような文字で持つ",
     "syn": [
      "計画年度"
     ]
    },
    "cust_status": {
     "label": "計画の状態",
     "en": "Plan Status",
     "dataType": "Picklist",
     "source": "JP_PlanStatus",
     "desc": "研修計画の承認の状態",
     "syn": [
      "計画ステータス"
     ]
    },
    "cust_totalHours": {
     "label": "合計時間",
     "en": "Total Hours",
     "dataType": "Decimal",
     "decimals": 1,
     "readOnly": true,
     "desc": "明細の時間の合計。システムが計算する",
     "syn": [
      "総研修時間"
     ]
    }
   }
  },
  "cust_EmployeeProfile": {
   "label": "社員プロファイル",
   "en": "Employee Profile (Legacy)",
   "desc": "旧人事システムから移行した社員ごとのデータ。現行の項目と同じ名前・意味の項目が多いが、データ型が違う（文字列の日付など）。比較・代入には変換の関数が必要",
   "syn": [
    "社員プロファイル",
    "移行データ",
    "旧人事データ"
   ],
   "kind": "MDF",
   "status": "active",
   "effectiveDated": true,
   "keys": [
    "externalCode",
    "effectiveStartDate"
   ],
   "baseObject": true,
   "events": [
    "onInit",
    "onValidate",
    "onChange",
    "onSave",
    "onPostSave",
    "onDelete",
    "onLoad",
    "onInsert"
   ],
   "fields": {
    "externalCode": {
     "label": "社員",
     "en": "Employee",
     "dataType": "User",
     "source": "User",
     "required": true,
     "readOnly": true,
     "desc": "プロファイルの持ち主の社員（User 型の externalCode）",
     "syn": [
      "社員",
      "従業員"
     ]
    },
    "effectiveStartDate": {
     "label": "有効開始日",
     "en": "Effective Start Date",
     "dataType": "Date",
     "required": true,
     "desc": "社員プロファイルレコードの有効開始日",
     "syn": [
      "社員プロファイルの開始日"
     ]
    },
    "mdfSystemStatus": {
     "label": "ステータス",
     "en": "Status",
     "dataType": "Picklist",
     "source": "status",
     "required": true,
     "desc": "社員プロファイルレコードが有効か無効か",
     "syn": [
      "社員プロファイルの有効・無効"
     ]
    },
    "cust_employeeNo": {
     "label": "社員番号",
     "en": "Employee Number",
     "dataType": "Long",
     "desc": "旧人事システムから移行した値。社員番号を数値（先頭の 0 なし、例：123）で持つ。雇用情報の社員番号（EmpEmployment.customString2）は同じ番号を文字列で持つ",
     "syn": [
      "従業員番号",
      "社員コード"
     ]
    },
    "cust_hireDate": {
     "label": "入社日",
     "en": "Hire Date",
     "dataType": "String",
     "maxLength": 8,
     "desc": "旧人事システムから移行した値。入社日を \"YYYYMMDD\" の文字列（例：20200401）で持つ。日付として比較・計算するには Text to Date で変換する。雇用情報の入社日（EmpEmployment.startDate）と同じ意味",
     "syn": [
      "入社年月日",
      "雇入れ日"
     ]
    },
    "cust_hireYear": {
     "label": "入社年度",
     "en": "Hire Fiscal Year",
     "dataType": "String",
     "maxLength": 4,
     "desc": "旧人事システムから移行した値。入社年度を文字列（例：\"2020\"）で持つ。雇用情報の入社年度（EmpEmployment.customLong2）は整数",
     "syn": [
      "採用年度",
      "入社年"
     ]
    },
    "cust_serviceYears": {
     "label": "勤続年数",
     "en": "Years of Service",
     "dataType": "Decimal",
     "decimals": 1,
     "desc": "旧人事システムから移行した値。勤続年数を小数（例：5.5）で持つ。雇用情報の勤続年数（customLong3）は整数",
     "syn": [
      "勤続",
      "在籍年数"
     ]
    },
    "cust_retirementAge": {
     "label": "定年年齢",
     "en": "Retirement Age",
     "dataType": "String",
     "maxLength": 3,
     "desc": "旧人事システムから移行した値。定年年齢を文字列（例：\"60\"）で持つ。雇用情報の定年年齢（customLong1）は整数",
     "syn": [
      "定年"
     ]
    },
    "cust_remoteFlag": {
     "label": "テレワーク対象",
     "en": "Remote Work Eligible",
     "dataType": "String",
     "maxLength": 1,
     "desc": "旧人事システムから移行した値。テレワーク対象かどうかを \"Y\" / \"N\" の文字で持つ。職務情報のテレワーク対象（customBoolean2）は、はい/いいえ",
     "syn": [
      "在宅勤務対象",
      "在宅勤務可否"
     ]
    },
    "cust_lastPromotionDate": {
     "label": "最終等級変更日",
     "en": "Last Grade Change Date",
     "dataType": "DateTime",
     "desc": "旧人事システムから移行した値。等級が最後に変わった日を日時で持つ。職務情報の最終等級変更日（customDate1）は日付。比べるときは Date Of で日付にする",
     "syn": [
      "等級変更日",
      "最終昇格日"
     ]
    },
    "cust_grade": {
     "label": "等級",
     "en": "Grade (Legacy)",
     "dataType": "String",
     "maxLength": 10,
     "desc": "旧人事システムから移行した値。旧人事制度の等級（例：\"3-2\"）。現行の等級（FOPayGrade）とはコード体系が違うため、そのまま比較・転記できない",
     "syn": [
      "旧等級",
      "旧グレード"
     ]
    },
    "cust_position": {
     "label": "役職",
     "en": "Title (Legacy)",
     "dataType": "String",
     "maxLength": 20,
     "desc": "旧人事システムから移行した値。役職名の文字列（例：\"課長\"）。現行の役職（picklist JP_Position）のコードとは違う",
     "syn": [
      "旧役職"
     ]
    },
    "cust_department": {
     "label": "部署",
     "en": "Department (Legacy)",
     "dataType": "String",
     "maxLength": 10,
     "desc": "旧人事システムから移行した値。旧システムの部署コード（例：\"S-110\"）。現行の部署（FODepartment）のコードとは違う",
     "syn": [
      "旧部署コード",
      "旧所属"
     ]
    },
    "cust_qualificationAllowance": {
     "label": "資格手当",
     "en": "Qualification Allowance",
     "dataType": "Long",
     "desc": "旧人事システムから移行した値。資格手当の月額を整数で持つ。保有資格の資格手当（cust_Qualification.cust_allowanceAmount）は小数",
     "syn": [
      "資格手当額"
     ]
    },
    "cust_syncedOn": {
     "label": "最終同期日",
     "en": "Last Synced On",
     "dataType": "Date",
     "desc": "雇用情報と最後に突き合わせた日",
     "syn": [
      "同期日",
      "突合日"
     ]
    }
   }
  },
  "cust_AppraisalResult": {
   "label": "評価結果",
   "en": "Appraisal Result",
   "desc": "年度ごとの人事評価の結果（評価ランク・評価点・確定日）",
   "syn": [
    "評価結果",
    "人事評価",
    "考課結果"
   ],
   "kind": "MDF",
   "status": "active",
   "effectiveDated": true,
   "keys": [
    "externalCode",
    "effectiveStartDate"
   ],
   "baseObject": true,
   "events": [
    "onInit",
    "onValidate",
    "onChange",
    "onSave",
    "onPostSave",
    "onDelete",
    "onLoad",
    "onInsert"
   ],
   "fields": {
    "externalCode": {
     "label": "コード",
     "en": "Code",
     "dataType": "String",
     "maxLength": 128,
     "required": true,
     "readOnly": true,
     "desc": "評価結果を一意に識別するコード（externalCode）。ルールでは {\"object\":\"cust_AppraisalResult\",\"codes\":[...]} の値として使う",
     "syn": [
      "評価結果コード",
      "評価結果ID"
     ]
    },
    "effectiveStartDate": {
     "label": "有効開始日",
     "en": "Effective Start Date",
     "dataType": "Date",
     "required": true,
     "desc": "評価結果レコードの有効開始日",
     "syn": [
      "評価結果の開始日"
     ]
    },
    "externalName": {
     "label": "名称",
     "en": "Name",
     "dataType": "String",
     "maxLength": 255,
     "desc": "評価結果の名称",
     "syn": [
      "評価結果名"
     ]
    },
    "mdfSystemStatus": {
     "label": "ステータス",
     "en": "Status",
     "dataType": "Picklist",
     "source": "status",
     "required": true,
     "desc": "評価結果レコードが有効か無効か",
     "syn": [
      "評価結果の有効・無効"
     ]
    },
    "cust_user": {
     "label": "対象者",
     "en": "Employee",
     "dataType": "User",
     "source": "User",
     "required": true,
     "desc": "評価された社員（User）",
     "syn": [
      "被評価者"
     ]
    },
    "cust_fiscalYear": {
     "label": "年度",
     "en": "Fiscal Year",
     "dataType": "String",
     "maxLength": 6,
     "required": true,
     "desc": "評価の年度を「FY2026」のような文字で持つ。研修計画の年度（cust_TrainingPlan.cust_fiscalYear）は整数",
     "syn": [
      "評価年度",
      "査定年度"
     ]
    },
    "cust_rank": {
     "label": "評価ランク",
     "en": "Rating",
     "dataType": "String",
     "maxLength": 2,
     "desc": "評価ランクを文字（S・A・B・C・D）で持つ。職務情報の評価ランク（customString2）は同じ意味の選択肢（picklist）",
     "syn": [
      "人事評価",
      "考課ランク",
      "評価結果"
     ]
    },
    "cust_score": {
     "label": "評価点",
     "en": "Score",
     "dataType": "Decimal",
     "decimals": 1,
     "desc": "評価の点数（例：3.5）。賞与係数（EmpJob.customDouble1）とは別",
     "syn": [
      "評価点数",
      "考課点"
     ]
    },
    "cust_finalized": {
     "label": "確定",
     "en": "Finalized",
     "dataType": "Boolean",
     "desc": "評価が確定したかどうか",
     "syn": [
      "確定済み"
     ]
    },
    "cust_finalizedDate": {
     "label": "確定日",
     "en": "Finalized On",
     "dataType": "Date",
     "desc": "評価が確定した日",
     "syn": [
      "評価確定日"
     ]
    }
   }
  },
  "cust_TrainingItem": {
   "label": "研修計画の明細",
   "en": "Training Plan Item",
   "desc": "研修計画の明細（研修名・時間・受講状況）。研修計画と一緒に保存する子オブジェクト",
   "syn": [
    "研修計画の明細",
    "研修明細"
   ],
   "kind": "MDF",
   "status": "active",
   "effectiveDated": false,
   "keys": [
    "externalCode"
   ],
   "baseObject": false,
   "events": [
    "onInit",
    "onValidate",
    "onChange",
    "onSave",
    "onPostSave",
    "onDelete",
    "onLoad"
   ],
   "fields": {
    "externalCode": {
     "label": "明細番号",
     "en": "Item No.",
     "dataType": "AutoNumber",
     "required": true,
     "readOnly": true,
     "desc": "研修計画の明細を一意に識別するコード（externalCode）。ルールでは {\"object\":\"cust_TrainingItem\",\"codes\":[...]} の値として使う",
     "syn": [
      "研修計画の明細コード",
      "研修計画の明細ID"
     ]
    },
    "cust_course": {
     "label": "研修名",
     "en": "Course",
     "dataType": "String",
     "maxLength": 255,
     "required": true,
     "desc": "受講する研修の名前",
     "syn": [
      "コース名",
      "講座名"
     ]
    },
    "cust_hours": {
     "label": "時間",
     "en": "Hours",
     "dataType": "Decimal",
     "decimals": 1,
     "desc": "研修の時間",
     "syn": [
      "研修時間"
     ]
    },
    "cust_completed": {
     "label": "受講済み",
     "en": "Completed",
     "dataType": "Boolean",
     "desc": "受講を終えたかどうか",
     "syn": [
      "修了"
     ]
    },
    "cust_completedDate": {
     "label": "受講日",
     "en": "Completed On",
     "dataType": "Date",
     "desc": "受講を終えた日",
     "syn": [
      "修了日"
     ]
    }
   }
  },
  "EmployeeInformation": {
   "label": "社員情報（入社・再入社）",
   "en": "Employee Information",
   "desc": "入社・再入社の画面（Add New Employee）で、まだ保存されていない個人情報・雇用情報・職務情報などをまとめて扱う入れ物。入社・再入社のルールシナリオでだけ base object にできる。Model（Employee Information Model）にすると、項目の必須・表示も設定できる",
   "syn": [
    "社員情報",
    "入社情報",
    "新規入社",
    "Employee Information"
   ],
   "kind": "EC",
   "status": "active",
   "effectiveDated": false,
   "keys": [
    "userId"
   ],
   "baseObject": true,
   "events": [
    "onInit",
    "onChange",
    "onSave"
   ],
   "associations": [
    {
     "id": "perPersonNav",
     "target": "PerPerson",
     "multiplicity": "1:1",
     "type": "composite"
    },
    {
     "id": "perPersonalNav",
     "target": "PerPersonal",
     "multiplicity": "1:1",
     "type": "composite"
    },
    {
     "id": "empEmploymentNav",
     "target": "EmpEmployment",
     "multiplicity": "1:1",
     "type": "composite"
    },
    {
     "id": "empJobNav",
     "target": "EmpJob",
     "multiplicity": "1:1",
     "type": "composite"
    },
    {
     "id": "empCompensationNav",
     "target": "EmpCompensation",
     "multiplicity": "1:1",
     "type": "composite"
    },
    {
     "id": "empJobRelationshipsNav",
     "target": "EmpJobRelationships",
     "multiplicity": "1:n",
     "type": "composite"
    },
    {
     "id": "empPayCompRecurringNav",
     "target": "EmpPayCompRecurring",
     "multiplicity": "1:n",
     "type": "composite"
    },
    {
     "id": "empPayCompNonRecurringNav",
     "target": "EmpPayCompNonRecurring",
     "multiplicity": "1:n",
     "type": "composite"
    },
    {
     "id": "perEmailNav",
     "target": "PerEmail",
     "multiplicity": "1:n",
     "type": "composite"
    },
    {
     "id": "perNationalIdNav",
     "target": "PerNationalId",
     "multiplicity": "1:n",
     "type": "composite"
    }
   ],
   "crossWrite": {
    "targets": [
     "PerPerson",
     "PerPersonal",
     "EmpEmployment",
     "EmpJob",
     "EmpCompensation",
     "EmpJobRelationships",
     "EmpPayCompRecurring",
     "EmpPayCompNonRecurring",
     "PerEmail",
     "PerNationalId"
    ],
    "events": [
     "onInit",
     "onChange",
     "onSave"
    ]
   },
   "fields": {
    "userId": {
     "label": "ユーザーID",
     "en": "User ID",
     "dataType": "String",
     "maxLength": 100,
     "required": true,
     "desc": "入社する社員のユーザーID。Generate Employee ID for Hire/Rehire のシナリオで、MDF の Sequence から採番して設定できる",
     "syn": [
      "社員ID",
      "ユーザーID"
     ]
    }
   }
  }
 },
 "picklists": {
  "event": {
   "label": "イベント",
   "en": "Event",
   "status": "A",
   "desc": "人事イベントの種類（入社・昇格・異動・退職など）。イベント事由はいずれかのイベントに属する",
   "syn": [
    "人事イベント",
    "発令の種類"
   ],
   "values": {
    "H": {
     "ja": "入社",
     "en": "Hire",
     "status": "A"
    },
    "R": {
     "ja": "再入社",
     "en": "Rehire",
     "status": "A"
    },
    "5": {
     "ja": "職務変更",
     "en": "Job Change",
     "status": "A"
    },
    "PRM": {
     "ja": "昇進・昇格",
     "en": "Promotion",
     "status": "A"
    },
    "DEM": {
     "ja": "降格",
     "en": "Demotion",
     "status": "A"
    },
    "TRN": {
     "ja": "異動",
     "en": "Transfer",
     "status": "A"
    },
    "9": {
     "ja": "データ変更",
     "en": "Data Change",
     "status": "A"
    },
    "LOA": {
     "ja": "休職",
     "en": "Leave of Absence",
     "status": "A"
    },
    "RTW": {
     "ja": "復職",
     "en": "Return to Work",
     "status": "A"
    },
    "26": {
     "ja": "退職",
     "en": "Termination",
     "status": "A"
    },
    "SUS": {
     "ja": "停職",
     "en": "Suspension",
     "status": "I"
    }
   }
  },
  "employeeclass": {
   "label": "社員区分",
   "en": "Employee Class",
   "status": "A",
   "desc": "社員の身分の区分（正社員・契約社員・嘱託・パート）。有期か無期かは契約種別で判断する",
   "syn": [
    "社員区分",
    "雇用区分",
    "身分区分"
   ],
   "values": {
    "1": {
     "ja": "正社員",
     "en": "Regular",
     "status": "A"
    },
    "2": {
     "ja": "契約社員",
     "en": "Fixed-term",
     "status": "A"
    },
    "3": {
     "ja": "嘱託社員",
     "en": "Re-employed Senior",
     "status": "A"
    },
    "4": {
     "ja": "パートタイマー",
     "en": "Part-time",
     "status": "A"
    },
    "5": {
     "ja": "派遣社員",
     "en": "Temporary Agency Worker",
     "status": "I"
    }
   }
  },
  "employmentType": {
   "label": "雇用形態",
   "en": "Employment Type",
   "status": "A",
   "desc": "労働時間の区分（フルタイム・パートタイム）",
   "syn": [
    "雇用形態",
    "勤務時間区分"
   ],
   "values": {
    "FT": {
     "ja": "フルタイム",
     "en": "Full Time",
     "status": "A"
    },
    "PT": {
     "ja": "パートタイム",
     "en": "Part Time",
     "status": "A"
    }
   }
  },
  "employee-status": {
   "label": "在籍ステータス",
   "en": "Employee Status",
   "status": "A",
   "desc": "在籍ステータス（在籍・休職・退職）。イベント事由から決まる",
   "syn": [
    "在籍状況",
    "就業状態"
   ],
   "values": {
    "A": {
     "ja": "在籍",
     "en": "Active",
     "status": "A"
    },
    "U": {
     "ja": "休職中",
     "en": "Unpaid Leave",
     "status": "A"
    },
    "P": {
     "ja": "休職中（有給）",
     "en": "Paid Leave",
     "status": "A"
    },
    "T": {
     "ja": "退職",
     "en": "Terminated",
     "status": "A"
    }
   }
  },
  "GENDER": {
   "label": "性別",
   "en": "Gender",
   "status": "A",
   "desc": "性別",
   "syn": [
    "性別"
   ],
   "values": {
    "M": {
     "ja": "男性",
     "en": "Male",
     "status": "A"
    },
    "F": {
     "ja": "女性",
     "en": "Female",
     "status": "A"
    },
    "O": {
     "ja": "その他",
     "en": "Other",
     "status": "A"
    },
    "U": {
     "ja": "未回答",
     "en": "Undeclared",
     "status": "A"
    }
   }
  },
  "ecMaritalStatus": {
   "label": "婚姻状況",
   "en": "Marital Status",
   "status": "A",
   "desc": "婚姻状況",
   "syn": [
    "婚姻状況",
    "配偶者の有無"
   ],
   "values": {
    "S": {
     "ja": "独身",
     "en": "Single",
     "status": "A"
    },
    "M": {
     "ja": "既婚",
     "en": "Married",
     "status": "A"
    },
    "D": {
     "ja": "離別",
     "en": "Divorced",
     "status": "A"
    },
    "W": {
     "ja": "死別",
     "en": "Widowed",
     "status": "A"
    }
   }
  },
  "status": {
   "label": "ステータス",
   "en": "Status",
   "status": "A",
   "desc": "レコードが有効か無効かを表す共通のステータス",
   "syn": [
    "ステータス",
    "有効・無効"
   ],
   "values": {
    "A": {
     "ja": "有効",
     "en": "Active",
     "status": "A"
    },
    "I": {
     "ja": "無効",
     "en": "Inactive",
     "status": "A"
    }
   }
  },
  "JP_HRCategory": {
   "label": "人事区分",
   "en": "HR Category",
   "status": "A",
   "desc": "人事制度上のコース区分（総合職・一般職・専門職）",
   "syn": [
    "人事区分",
    "コース区分",
    "職掌"
   ],
   "values": {
    "G": {
     "ja": "総合職",
     "en": "Career Track",
     "status": "A"
    },
    "A": {
     "ja": "一般職",
     "en": "Clerical Track",
     "status": "A"
    },
    "S": {
     "ja": "専門職",
     "en": "Specialist Track",
     "status": "A"
    }
   }
  },
  "JP_AppraisalRank": {
   "label": "評価ランク",
   "en": "Appraisal Rank",
   "status": "A",
   "desc": "人事評価のランク（S〜D）",
   "syn": [
    "評価ランク",
    "考課ランク"
   ],
   "values": {
    "S": {
     "ja": "S",
     "en": "S",
     "status": "A"
    },
    "A": {
     "ja": "A",
     "en": "A",
     "status": "A"
    },
    "B": {
     "ja": "B",
     "en": "B",
     "status": "A"
    },
    "C": {
     "ja": "C",
     "en": "C",
     "status": "A"
    },
    "D": {
     "ja": "D",
     "en": "D",
     "status": "A"
    }
   }
  },
  "JP_Position": {
   "label": "役職",
   "en": "Managerial Title",
   "status": "A",
   "desc": "管理職の役職（主任〜本部長）。値の「本部長」は役職名で、事業本部の長という人を指すものではない",
   "syn": [
    "役職",
    "ポスト",
    "職位"
   ],
   "values": {
    "NONE": {
     "ja": "なし",
     "en": "None",
     "status": "A"
    },
    "CHIEF": {
     "ja": "主任",
     "en": "Chief",
     "status": "A"
    },
    "SEC": {
     "ja": "係長",
     "en": "Section Chief",
     "status": "I"
    },
    "DMGR": {
     "ja": "課長代理",
     "en": "Deputy Manager",
     "status": "A"
    },
    "MGR": {
     "ja": "課長",
     "en": "Manager",
     "status": "A"
    },
    "SMGR": {
     "ja": "部長",
     "en": "Senior Manager",
     "status": "A"
    },
    "EXE": {
     "ja": "本部長",
     "en": "Executive",
     "status": "A"
    }
   }
  },
  "JP_PromotionType": {
   "label": "昇格区分",
   "en": "Promotion Type",
   "status": "A",
   "desc": "昇格の区分（定期・抜擢・試験）",
   "syn": [
    "昇格区分",
    "昇格種別"
   ],
   "values": {
    "REG": {
     "ja": "定期昇格",
     "en": "Regular Promotion",
     "status": "A"
    },
    "SPC": {
     "ja": "抜擢昇格",
     "en": "Special Promotion",
     "status": "A"
    },
    "EXM": {
     "ja": "試験昇格",
     "en": "Exam-based Promotion",
     "status": "A"
    }
   }
  },
  "JP_HireRoute": {
   "label": "入社経路",
   "en": "Hire Route",
   "status": "A",
   "desc": "入社の経路（新卒・中途・グループ転籍）",
   "syn": [
    "入社経路",
    "採用区分"
   ],
   "values": {
    "NEWGRAD": {
     "ja": "新卒",
     "en": "New Graduate",
     "status": "A"
    },
    "MID": {
     "ja": "中途",
     "en": "Experienced",
     "status": "A"
    },
    "GROUP": {
     "ja": "グループ転籍",
     "en": "Group Transfer",
     "status": "A"
    }
   }
  },
  "JP_TermReasonDetail": {
   "label": "退職理由（詳細）",
   "en": "Termination Reason Detail",
   "status": "A",
   "desc": "退職理由の詳細",
   "syn": [
    "退職理由",
    "離職理由"
   ],
   "values": {
    "CAREER": {
     "ja": "キャリアアップ",
     "en": "Career Change",
     "status": "A"
    },
    "FAMILY": {
     "ja": "家庭の事情",
     "en": "Family Reasons",
     "status": "A"
    },
    "HEALTH": {
     "ja": "健康上の理由",
     "en": "Health",
     "status": "A"
    },
    "RETIRE": {
     "ja": "定年",
     "en": "Retirement",
     "status": "A"
    }
   }
  },
  "JP_SalaryType": {
   "label": "給与形態",
   "en": "Salary Type",
   "status": "A",
   "desc": "給与の支払形態（月給・日給・時給）",
   "syn": [
    "給与形態",
    "賃金形態"
   ],
   "values": {
    "M": {
     "ja": "月給",
     "en": "Monthly",
     "status": "A"
    },
    "D": {
     "ja": "日給",
     "en": "Daily",
     "status": "A"
    },
    "H": {
     "ja": "時給",
     "en": "Hourly",
     "status": "A"
    }
   }
  },
  "JP_QualCategory": {
   "label": "資格分類",
   "en": "Qualification Category",
   "status": "A",
   "desc": "資格の分類（会計・語学・法務・IT）。資格レベル（JP_QualLevel）の親",
   "syn": [
    "資格分類",
    "資格の種類"
   ],
   "values": {
    "ACC": {
     "ja": "会計",
     "en": "Accounting",
     "status": "A"
    },
    "LANG": {
     "ja": "語学",
     "en": "Language",
     "status": "A"
    },
    "LAW": {
     "ja": "法務・労務",
     "en": "Legal",
     "status": "A"
    },
    "IT": {
     "ja": "IT",
     "en": "IT",
     "status": "A"
    }
   }
  },
  "JP_QualLevel": {
   "label": "資格レベル",
   "en": "Qualification Level",
   "status": "A",
   "desc": "資格の難易度のレベル。親の資格分類によって選べる値が変わるカスケードのピックリスト。給与の等級とは無関係",
   "syn": [
    "資格レベル",
    "資格の級"
   ],
   "parent": "JP_QualCategory",
   "values": {
    "ACC_1": {
     "ja": "1級",
     "en": "Level 1",
     "status": "A",
     "parent": "ACC"
    },
    "ACC_2": {
     "ja": "2級",
     "en": "Level 2",
     "status": "A",
     "parent": "ACC"
    },
    "LANG_800": {
     "ja": "800点以上",
     "en": "800+",
     "status": "A",
     "parent": "LANG"
    },
    "LANG_900": {
     "ja": "900点以上",
     "en": "900+",
     "status": "A",
     "parent": "LANG"
    },
    "LAW_PRO": {
     "ja": "国家資格",
     "en": "National License",
     "status": "A",
     "parent": "LAW"
    },
    "IT_ADV": {
     "ja": "高度",
     "en": "Advanced",
     "status": "A",
     "parent": "IT"
    },
    "IT_BAS": {
     "ja": "基本",
     "en": "Basic",
     "status": "A",
     "parent": "IT"
    },
    "IT_OLD": {
     "ja": "旧区分",
     "en": "Legacy",
     "status": "I",
     "parent": "IT"
    }
   }
  },
  "JP_PlanStatus": {
   "label": "計画の状態",
   "en": "Plan Status",
   "status": "A",
   "desc": "研修計画の承認の状態",
   "syn": [
    "計画の状態",
    "計画ステータス"
   ],
   "values": {
    "DRAFT": {
     "ja": "下書き",
     "en": "Draft",
     "status": "A"
    },
    "SUBMITTED": {
     "ja": "申請中",
     "en": "Submitted",
     "status": "A"
    },
    "APPROVED": {
     "ja": "承認済み",
     "en": "Approved",
     "status": "A"
    }
   }
  },
  "ecEmailType": {
   "label": "メールの種類",
   "en": "Email Type",
   "status": "A",
   "desc": "メールアドレスの種類（会社・個人）",
   "syn": [
    "メールの種類"
   ],
   "values": {
    "B": {
     "ja": "会社",
     "en": "Business",
     "status": "A"
    },
    "P": {
     "ja": "個人",
     "en": "Personal",
     "status": "A"
    }
   }
  },
  "ecNationalIdCardType": {
   "label": "ID の種類",
   "en": "National ID Card Type",
   "status": "A",
   "desc": "国民 ID の種類（マイナンバー・パスポート）",
   "syn": [
    "ID の種類",
    "身分証の種類"
   ],
   "values": {
    "MYNUM": {
     "ja": "マイナンバー",
     "en": "My Number",
     "status": "A"
    },
    "PASS": {
     "ja": "パスポート",
     "en": "Passport",
     "status": "A"
    }
   }
  },
  "jobRelType": {
   "label": "関係の種類",
   "en": "Relationship Type",
   "status": "A",
   "desc": "職務上の関係の種類（人事担当・マトリクス上長・メンター）。ライン上の上司は含まない",
   "syn": [
    "関係の種類",
    "関係区分"
   ],
   "values": {
    "HRBP": {
     "ja": "人事担当",
     "en": "HR Business Partner",
     "status": "A"
    },
    "MATRIX": {
     "ja": "マトリクス上長",
     "en": "Matrix Manager",
     "status": "A"
    },
    "MENTOR": {
     "ja": "メンター",
     "en": "Mentor",
     "status": "A"
    }
   }
  },
  "payComponentType": {
   "label": "報酬項目の種類",
   "en": "Pay Component Type",
   "status": "A",
   "desc": "報酬項目を金額で払うか割合で払うか",
   "syn": [
    "報酬項目の種類",
    "支給方法"
   ],
   "values": {
    "AMOUNT": {
     "ja": "金額",
     "en": "Amount",
     "status": "A"
    },
    "PERCENT": {
     "ja": "割合",
     "en": "Percentage",
     "status": "A"
    }
   }
  },
  "contractType": {
   "label": "契約種別",
   "en": "Contract Type",
   "status": "A",
   "desc": "雇用期間の定めの有無（有期・無期）",
   "syn": [
    "契約種別",
    "有期・無期",
    "雇用期間の定め"
   ],
   "values": {
    "PERM": {
     "ja": "無期",
     "en": "Permanent",
     "status": "A"
    },
    "FIXED": {
     "ja": "有期",
     "en": "Fixed Term",
     "status": "A"
    }
   }
  },
  "JP_JobLevel": {
   "label": "職級",
   "en": "Job Level",
   "status": "A",
   "desc": "職責の大きさを表す職級（L1〜M2）。給与テーブルの等級（FOPayGrade）とは別の体系",
   "syn": [
    "職級",
    "ジョブレベル"
   ],
   "values": {
    "L1": {
     "ja": "L1（担当）",
     "en": "L1",
     "status": "A"
    },
    "L2": {
     "ja": "L2（主任相当）",
     "en": "L2",
     "status": "A"
    },
    "L3": {
     "ja": "L3（係長相当）",
     "en": "L3",
     "status": "A"
    },
    "M1": {
     "ja": "M1（課長相当）",
     "en": "M1",
     "status": "A"
    },
    "M2": {
     "ja": "M2（部長相当）",
     "en": "M2",
     "status": "A"
    }
   }
  },
  "JP_WorkStyle": {
   "label": "勤務形態",
   "en": "Work Style",
   "status": "A",
   "desc": "働き方（出社・ハイブリッド・在宅）。働く場所（勤務地）ではない",
   "syn": [
    "勤務形態",
    "働き方"
   ],
   "values": {
    "OFFICE": {
     "ja": "出社",
     "en": "Office",
     "status": "A"
    },
    "HYBRID": {
     "ja": "ハイブリッド",
     "en": "Hybrid",
     "status": "A"
    },
    "REMOTE": {
     "ja": "在宅",
     "en": "Remote",
     "status": "A"
    }
   }
  }
 },
 "records": {
  "Country": {
   "JPN": {
    "name": "日本",
    "en": "Japan",
    "status": "A",
    "start": "2000-01-01",
    "attrs": {
     "currency": "JPY"
    }
   },
   "USA": {
    "name": "アメリカ合衆国",
    "en": "United States",
    "status": "A",
    "start": "2000-01-01",
    "attrs": {
     "currency": "USD"
    }
   },
   "CHN": {
    "name": "中国",
    "en": "China",
    "status": "A",
    "start": "2000-01-01",
    "attrs": {
     "currency": "CNY"
    }
   },
   "GBR": {
    "name": "イギリス",
    "en": "United Kingdom",
    "status": "A",
    "start": "2000-01-01",
    "attrs": {
     "currency": "GBP"
    }
   }
  },
  "Currency": {
   "JPY": {
    "name": "日本円",
    "en": "Japanese Yen",
    "status": "A",
    "start": "2000-01-01",
    "attrs": {
     "symbol": "¥"
    }
   },
   "USD": {
    "name": "米ドル",
    "en": "US Dollar",
    "status": "A",
    "start": "2000-01-01",
    "attrs": {
     "symbol": "$"
    }
   },
   "CNY": {
    "name": "人民元",
    "en": "Chinese Yuan",
    "status": "A",
    "start": "2000-01-01",
    "attrs": {
     "symbol": "元"
    }
   },
   "GBP": {
    "name": "英ポンド",
    "en": "British Pound",
    "status": "A",
    "start": "2000-01-01",
    "attrs": {
     "symbol": "£"
    }
   },
   "EUR": {
    "name": "ユーロ",
    "en": "Euro",
    "status": "A",
    "start": "2000-01-01",
    "attrs": {
     "symbol": "€"
    }
   }
  },
  "FOCompany": {
   "JP01": {
    "name": "デモ株式会社",
    "en": "Demo Corp Japan",
    "status": "A",
    "start": "2000-01-01",
    "attrs": {
     "country": "JPN",
     "currency": "JPY"
    }
   },
   "JP02": {
    "name": "デモソリューションズ株式会社",
    "en": "Demo Solutions Japan",
    "status": "A",
    "start": "2000-01-01",
    "attrs": {
     "country": "JPN",
     "currency": "JPY"
    }
   },
   "US01": {
    "name": "Demo Corp USA",
    "en": "Demo Corp USA",
    "status": "A",
    "start": "2000-01-01",
    "attrs": {
     "country": "USA",
     "currency": "USD"
    }
   },
   "JP09": {
    "name": "デモ物流株式会社（清算済み）",
    "en": "Demo Logistics (Liquidated)",
    "status": "I",
    "start": "2000-01-01",
    "attrs": {
     "country": "JPN",
     "currency": "JPY"
    }
   }
  },
  "FOBusinessUnit": {
   "BU_SAL": {
    "name": "営業本部",
    "en": "Sales",
    "status": "A",
    "start": "2000-01-01",
    "attrs": {
     "headOfUnit": "EMP0002"
    }
   },
   "BU_ENG": {
    "name": "技術本部",
    "en": "Engineering",
    "status": "A",
    "start": "2000-01-01",
    "attrs": {
     "headOfUnit": "EMP0003"
    }
   },
   "BU_ADM": {
    "name": "管理本部",
    "en": "Corporate",
    "status": "A",
    "start": "2000-01-01",
    "attrs": {
     "headOfUnit": "EMP0004"
    }
   }
  },
  "FODivision": {
   "DV_SAL1": {
    "name": "第一営業事業部",
    "en": "Sales Division 1",
    "status": "A",
    "start": "2000-01-01",
    "attrs": {
     "parentBusinessUnit": "BU_SAL"
    }
   },
   "DV_SAL2": {
    "name": "第二営業事業部",
    "en": "Sales Division 2",
    "status": "A",
    "start": "2000-01-01",
    "attrs": {
     "parentBusinessUnit": "BU_SAL"
    }
   },
   "DV_ENG": {
    "name": "開発事業部",
    "en": "Development",
    "status": "A",
    "start": "2000-01-01",
    "attrs": {
     "parentBusinessUnit": "BU_ENG"
    }
   },
   "DV_ADM": {
    "name": "管理事業部",
    "en": "Administration",
    "status": "A",
    "start": "2000-01-01",
    "attrs": {
     "parentBusinessUnit": "BU_ADM"
    }
   }
  },
  "FOCostCenter": {
   "CC1100": {
    "name": "第一営業部",
    "en": "Sales Dept. 1",
    "status": "A",
    "start": "2000-01-01",
    "attrs": {
     "legalEntity": "JP01"
    }
   },
   "CC1200": {
    "name": "第二営業部",
    "en": "Sales Dept. 2",
    "status": "A",
    "start": "2000-01-01",
    "attrs": {
     "legalEntity": "JP01"
    }
   },
   "CC2100": {
    "name": "開発部",
    "en": "Development",
    "status": "A",
    "start": "2000-01-01",
    "attrs": {
     "legalEntity": "JP01"
    }
   },
   "CC3100": {
    "name": "人事部",
    "en": "Human Resources",
    "status": "A",
    "start": "2000-01-01",
    "attrs": {
     "legalEntity": "JP01"
    }
   },
   "CC3200": {
    "name": "経理部",
    "en": "Accounting",
    "status": "A",
    "start": "2000-01-01",
    "attrs": {
     "legalEntity": "JP01"
    }
   },
   "CC9000": {
    "name": "旧管理部",
    "en": "Old Admin",
    "status": "I",
    "start": "2000-01-01",
    "attrs": {
     "legalEntity": "JP01"
    }
   }
  },
  "FODepartment": {
   "D1000": {
    "name": "営業本部",
    "en": "Sales HQ",
    "status": "A",
    "start": "2000-01-01",
    "attrs": {
     "headOfUnit": "EMP0002"
    }
   },
   "D1100": {
    "name": "第一営業部",
    "en": "Sales Dept. 1",
    "status": "A",
    "start": "2000-01-01",
    "attrs": {
     "parent": "D1000",
     "headOfUnit": "EMP0005",
     "costCenter": "CC1100"
    }
   },
   "D1110": {
    "name": "第一営業部 東京課",
    "en": "Sales 1 Tokyo",
    "status": "A",
    "start": "2000-01-01",
    "attrs": {
     "parent": "D1100",
     "costCenter": "CC1100"
    }
   },
   "D1120": {
    "name": "第一営業部 大阪課",
    "en": "Sales 1 Osaka",
    "status": "A",
    "start": "2000-01-01",
    "attrs": {
     "parent": "D1100",
     "costCenter": "CC1100"
    }
   },
   "D1200": {
    "name": "第二営業部",
    "en": "Sales Dept. 2",
    "status": "A",
    "start": "2000-01-01",
    "attrs": {
     "parent": "D1000",
     "headOfUnit": "EMP0006",
     "costCenter": "CC1200"
    }
   },
   "D2000": {
    "name": "技術本部",
    "en": "Engineering HQ",
    "status": "A",
    "start": "2000-01-01",
    "attrs": {
     "headOfUnit": "EMP0003"
    }
   },
   "D2100": {
    "name": "開発部",
    "en": "Development",
    "status": "A",
    "start": "2000-01-01",
    "attrs": {
     "parent": "D2000",
     "headOfUnit": "EMP0007",
     "costCenter": "CC2100"
    }
   },
   "D2200": {
    "name": "品質保証部",
    "en": "Quality Assurance",
    "status": "A",
    "start": "2000-01-01",
    "attrs": {
     "parent": "D2000",
     "costCenter": "CC2100"
    }
   },
   "D3000": {
    "name": "管理本部",
    "en": "Corporate HQ",
    "status": "A",
    "start": "2000-01-01",
    "attrs": {
     "headOfUnit": "EMP0004"
    }
   },
   "D3100": {
    "name": "人事部",
    "en": "Human Resources",
    "status": "A",
    "start": "2000-01-01",
    "attrs": {
     "parent": "D3000",
     "headOfUnit": "EMP0008",
     "costCenter": "CC3100"
    }
   },
   "D3200": {
    "name": "経理部",
    "en": "Accounting",
    "status": "A",
    "start": "2000-01-01",
    "attrs": {
     "parent": "D3000",
     "costCenter": "CC3200"
    }
   },
   "D3900": {
    "name": "旧総務部",
    "en": "Old General Affairs",
    "status": "I",
    "start": "2000-01-01",
    "attrs": {
     "parent": "D3000"
    }
   },
   "D4000": {
    "name": "新規事業準備室",
    "en": "New Business Office",
    "status": "A",
    "start": "2027-04-01",
    "attrs": {
     "parent": "D3000"
    }
   }
  },
  "FOLocation": {
   "LOC_TKY": {
    "name": "東京本社",
    "en": "Tokyo HQ",
    "status": "A",
    "start": "2000-01-01",
    "attrs": {
     "standardHours": 40,
     "timezone": "Asia/Tokyo"
    }
   },
   "LOC_OSK": {
    "name": "大阪支社",
    "en": "Osaka Branch",
    "status": "A",
    "start": "2000-01-01",
    "attrs": {
     "standardHours": 40,
     "timezone": "Asia/Tokyo"
    }
   },
   "LOC_NGY": {
    "name": "名古屋営業所",
    "en": "Nagoya Office",
    "status": "A",
    "start": "2000-01-01",
    "attrs": {
     "standardHours": 37.5,
     "timezone": "Asia/Tokyo"
    }
   },
   "LOC_NYC": {
    "name": "ニューヨーク",
    "en": "New York",
    "status": "A",
    "start": "2000-01-01",
    "attrs": {
     "standardHours": 40,
     "timezone": "America/New_York"
    }
   },
   "LOC_SDI": {
    "name": "仙台営業所（閉鎖）",
    "en": "Sendai Office (Closed)",
    "status": "A",
    "start": "2010-04-01",
    "end": "2024-03-31",
    "attrs": {
     "standardHours": 40,
     "timezone": "Asia/Tokyo"
    }
   }
  },
  "FOPayGrade": {
   "G1": {
    "name": "1等級",
    "en": "Grade 1",
    "status": "A",
    "start": "2000-01-01",
    "attrs": {
     "paygradeLevel": 1
    }
   },
   "G2": {
    "name": "2等級",
    "en": "Grade 2",
    "status": "A",
    "start": "2000-01-01",
    "attrs": {
     "paygradeLevel": 2
    }
   },
   "G3": {
    "name": "3等級",
    "en": "Grade 3",
    "status": "A",
    "start": "2000-01-01",
    "attrs": {
     "paygradeLevel": 3
    }
   },
   "G4": {
    "name": "4等級",
    "en": "Grade 4",
    "status": "A",
    "start": "2000-01-01",
    "attrs": {
     "paygradeLevel": 4
    }
   },
   "G5": {
    "name": "5等級",
    "en": "Grade 5",
    "status": "A",
    "start": "2000-01-01",
    "attrs": {
     "paygradeLevel": 5
    }
   },
   "G6": {
    "name": "6等級（管理職）",
    "en": "Grade 6 (Manager)",
    "status": "A",
    "start": "2000-01-01",
    "attrs": {
     "paygradeLevel": 6
    }
   },
   "G7": {
    "name": "7等級（管理職）",
    "en": "Grade 7 (Manager)",
    "status": "A",
    "start": "2000-01-01",
    "attrs": {
     "paygradeLevel": 7
    }
   },
   "G8": {
    "name": "8等級（上級管理職）",
    "en": "Grade 8 (Senior Manager)",
    "status": "A",
    "start": "2000-01-01",
    "attrs": {
     "paygradeLevel": 8
    }
   },
   "GX": {
    "name": "旧等級",
    "en": "Legacy Grade",
    "status": "I",
    "start": "2000-01-01",
    "attrs": {
     "paygradeLevel": 0
    }
   }
  },
  "FOJobCode": {
   "JC_SALES": {
    "name": "営業",
    "en": "Sales",
    "status": "A",
    "start": "2000-01-01",
    "attrs": {
     "grade": "G3",
     "isFulltimeEmployee": true,
     "isRegular": true,
     "standardHours": 40
    }
   },
   "JC_ENG": {
    "name": "エンジニア",
    "en": "Engineer",
    "status": "A",
    "start": "2000-01-01",
    "attrs": {
     "grade": "G3",
     "isFulltimeEmployee": true,
     "isRegular": true,
     "standardHours": 40
    }
   },
   "JC_HR": {
    "name": "人事",
    "en": "HR Specialist",
    "status": "A",
    "start": "2000-01-01",
    "attrs": {
     "grade": "G3",
     "isFulltimeEmployee": true,
     "isRegular": true,
     "standardHours": 40
    }
   },
   "JC_ACC": {
    "name": "経理",
    "en": "Accountant",
    "status": "A",
    "start": "2000-01-01",
    "attrs": {
     "grade": "G3",
     "isFulltimeEmployee": true,
     "isRegular": true,
     "standardHours": 40
    }
   },
   "JC_MGR": {
    "name": "管理職",
    "en": "Manager",
    "status": "A",
    "start": "2000-01-01",
    "attrs": {
     "grade": "G6",
     "isFulltimeEmployee": true,
     "isRegular": true,
     "standardHours": 40
    }
   },
   "JC_PT": {
    "name": "パートスタッフ",
    "en": "Part-time Staff",
    "status": "A",
    "start": "2000-01-01",
    "attrs": {
     "grade": "G1",
     "isFulltimeEmployee": false,
     "isRegular": false,
     "standardHours": 20
    }
   }
  },
  "FOPayGroup": {
   "PG_JP_M": {
    "name": "日本・月給",
    "en": "Japan Monthly",
    "status": "A",
    "start": "2000-01-01",
    "attrs": {
     "payFrequency": "MON"
    }
   },
   "PG_JP_H": {
    "name": "日本・時給",
    "en": "Japan Hourly",
    "status": "A",
    "start": "2000-01-01",
    "attrs": {
     "payFrequency": "MON"
    }
   },
   "PG_US": {
    "name": "米国・隔週",
    "en": "US Bi-weekly",
    "status": "A",
    "start": "2000-01-01",
    "attrs": {
     "payFrequency": "BIW"
    }
   }
  },
  "FOFrequency": {
   "MON": {
    "name": "月次",
    "en": "Monthly",
    "status": "A",
    "start": "2000-01-01",
    "attrs": {
     "annualizationFactor": 12
    }
   },
   "ANN": {
    "name": "年次",
    "en": "Annual",
    "status": "A",
    "start": "2000-01-01",
    "attrs": {
     "annualizationFactor": 1
    }
   },
   "BIW": {
    "name": "隔週",
    "en": "Bi-weekly",
    "status": "A",
    "start": "2000-01-01",
    "attrs": {
     "annualizationFactor": 26
    }
   },
   "ONE": {
    "name": "一回",
    "en": "One-time",
    "status": "A",
    "start": "2000-01-01",
    "attrs": {
     "annualizationFactor": 1
    }
   }
  },
  "FOPayComponent": {
   "BASE": {
    "name": "基本給",
    "en": "Base Salary",
    "status": "A",
    "start": "2000-01-01",
    "attrs": {
     "payComponentType": "AMOUNT",
     "isRecurring": true,
     "currency": "JPY",
     "frequencyCode": "MON"
    }
   },
   "ALW_POS": {
    "name": "役職手当",
    "en": "Position Allowance",
    "status": "A",
    "start": "2000-01-01",
    "attrs": {
     "payComponentType": "AMOUNT",
     "isRecurring": true,
     "currency": "JPY",
     "frequencyCode": "MON"
    }
   },
   "ALW_QUAL": {
    "name": "資格手当",
    "en": "Qualification Allowance",
    "status": "A",
    "start": "2000-01-01",
    "attrs": {
     "payComponentType": "AMOUNT",
     "isRecurring": true,
     "currency": "JPY",
     "frequencyCode": "MON"
    }
   },
   "ALW_COMM": {
    "name": "通勤手当",
    "en": "Commuting Allowance",
    "status": "A",
    "start": "2000-01-01",
    "attrs": {
     "payComponentType": "AMOUNT",
     "isRecurring": true,
     "currency": "JPY",
     "frequencyCode": "MON"
    }
   },
   "ALW_REMOTE": {
    "name": "在宅勤務手当",
    "en": "Remote Work Allowance",
    "status": "A",
    "start": "2000-01-01",
    "attrs": {
     "payComponentType": "AMOUNT",
     "isRecurring": true,
     "currency": "JPY",
     "frequencyCode": "MON"
    }
   },
   "BONUS": {
    "name": "賞与",
    "en": "Bonus",
    "status": "A",
    "start": "2000-01-01",
    "attrs": {
     "payComponentType": "AMOUNT",
     "isRecurring": false,
     "currency": "JPY",
     "frequencyCode": "ONE"
    }
   },
   "ALW_OLD": {
    "name": "旧調整手当",
    "en": "Legacy Adjustment Allowance",
    "status": "I",
    "start": "2000-01-01",
    "attrs": {
     "payComponentType": "AMOUNT",
     "isRecurring": true,
     "currency": "JPY",
     "frequencyCode": "MON"
    }
   }
  },
  "Position": {
   "POS1000": {
    "name": "営業本部長",
    "en": "Head of Sales",
    "status": "A",
    "start": "2000-01-01",
    "attrs": {
     "company": "JP01",
     "department": "D1000",
     "jobCode": "JC_MGR",
     "payGrade": "G8",
     "location": "LOC_TKY",
     "cust_managerialTitle": "EXE"
    }
   },
   "POS1100": {
    "name": "第一営業部長",
    "en": "Sales Dept. 1 Head",
    "status": "A",
    "start": "2000-01-01",
    "attrs": {
     "company": "JP01",
     "department": "D1100",
     "jobCode": "JC_MGR",
     "payGrade": "G7",
     "location": "LOC_TKY",
     "parentPosition": "POS1000",
     "cust_managerialTitle": "SMGR"
    }
   },
   "POS1110": {
    "name": "東京課長",
    "en": "Tokyo Section Manager",
    "status": "A",
    "start": "2000-01-01",
    "attrs": {
     "company": "JP01",
     "department": "D1110",
     "jobCode": "JC_MGR",
     "payGrade": "G6",
     "location": "LOC_TKY",
     "parentPosition": "POS1100",
     "cust_managerialTitle": "MGR"
    }
   },
   "POS1111": {
    "name": "営業担当（東京）",
    "en": "Sales Rep (Tokyo)",
    "status": "A",
    "start": "2000-01-01",
    "attrs": {
     "company": "JP01",
     "department": "D1110",
     "jobCode": "JC_SALES",
     "payGrade": "G3",
     "location": "LOC_TKY",
     "parentPosition": "POS1110",
     "cust_managerialTitle": "NONE",
     "vacant": true
    }
   },
   "POS2100": {
    "name": "開発部長",
    "en": "Development Head",
    "status": "A",
    "start": "2000-01-01",
    "attrs": {
     "company": "JP01",
     "department": "D2100",
     "jobCode": "JC_MGR",
     "payGrade": "G7",
     "location": "LOC_TKY",
     "cust_managerialTitle": "SMGR"
    }
   },
   "POS2101": {
    "name": "エンジニア",
    "en": "Engineer",
    "status": "A",
    "start": "2000-01-01",
    "attrs": {
     "company": "JP01",
     "department": "D2100",
     "jobCode": "JC_ENG",
     "payGrade": "G3",
     "location": "LOC_TKY",
     "parentPosition": "POS2100",
     "cust_managerialTitle": "NONE"
    }
   },
   "POS3100": {
    "name": "人事部長",
    "en": "HR Head",
    "status": "A",
    "start": "2000-01-01",
    "attrs": {
     "company": "JP01",
     "department": "D3100",
     "jobCode": "JC_MGR",
     "payGrade": "G7",
     "location": "LOC_TKY",
     "cust_managerialTitle": "SMGR"
    }
   },
   "POS3999": {
    "name": "旧総務担当",
    "en": "Old GA Staff",
    "status": "I",
    "start": "2000-01-01",
    "attrs": {
     "company": "JP01",
     "department": "D3900",
     "jobCode": "JC_HR",
     "payGrade": "G3",
     "location": "LOC_TKY",
     "cust_managerialTitle": "NONE"
    }
   }
  },
  "cust_JobFamily": {
   "JF_SALES": {
    "name": "営業職群",
    "en": "Sales",
    "status": "A",
    "start": "2000-01-01",
    "attrs": {
     "cust_defaultHRCategory": "G"
    }
   },
   "JF_ENG": {
    "name": "技術職群",
    "en": "Engineering",
    "status": "A",
    "start": "2000-01-01",
    "attrs": {
     "cust_defaultHRCategory": "S"
    }
   },
   "JF_CORP": {
    "name": "コーポレート職群",
    "en": "Corporate",
    "status": "A",
    "start": "2000-01-01",
    "attrs": {
     "cust_defaultHRCategory": "G"
    }
   },
   "JF_OPS": {
    "name": "業務職群",
    "en": "Operations",
    "status": "A",
    "start": "2000-01-01",
    "attrs": {
     "cust_defaultHRCategory": "A"
    }
   }
  },
  "cust_QualificationMaster": {
   "Q_BOKI1": {
    "name": "日商簿記1級",
    "en": "Bookkeeping Level 1",
    "status": "A",
    "start": "2000-01-01",
    "attrs": {
     "cust_category": "ACC",
     "cust_level": "ACC_1",
     "cust_allowanceAmount": 20000,
     "cust_currency": "JPY"
    }
   },
   "Q_BOKI2": {
    "name": "日商簿記2級",
    "en": "Bookkeeping Level 2",
    "status": "A",
    "start": "2000-01-01",
    "attrs": {
     "cust_category": "ACC",
     "cust_level": "ACC_2",
     "cust_allowanceAmount": 5000,
     "cust_currency": "JPY"
    }
   },
   "Q_TOEIC800": {
    "name": "TOEIC 800点以上",
    "en": "TOEIC 800+",
    "status": "A",
    "start": "2000-01-01",
    "attrs": {
     "cust_category": "LANG",
     "cust_level": "LANG_800",
     "cust_allowanceAmount": 5000,
     "cust_currency": "JPY"
    }
   },
   "Q_TOEIC900": {
    "name": "TOEIC 900点以上",
    "en": "TOEIC 900+",
    "status": "A",
    "start": "2000-01-01",
    "attrs": {
     "cust_category": "LANG",
     "cust_level": "LANG_900",
     "cust_allowanceAmount": 10000,
     "cust_currency": "JPY"
    }
   },
   "Q_SR": {
    "name": "社会保険労務士",
    "en": "Labor and Social Security Attorney",
    "status": "A",
    "start": "2000-01-01",
    "attrs": {
     "cust_category": "LAW",
     "cust_level": "LAW_PRO",
     "cust_allowanceAmount": 30000,
     "cust_currency": "JPY"
    }
   },
   "Q_PMP": {
    "name": "PMP",
    "en": "PMP",
    "status": "A",
    "start": "2000-01-01",
    "attrs": {
     "cust_category": "IT",
     "cust_level": "IT_ADV",
     "cust_allowanceAmount": 15000,
     "cust_currency": "JPY"
    }
   },
   "Q_FE": {
    "name": "基本情報技術者",
    "en": "Fundamental IT Engineer",
    "status": "A",
    "start": "2000-01-01",
    "attrs": {
     "cust_category": "IT",
     "cust_level": "IT_BAS",
     "cust_allowanceAmount": 3000,
     "cust_currency": "JPY"
    }
   },
   "Q_SYSAD": {
    "name": "初級シスアド（廃止）",
    "en": "Systems Administrator (Discontinued)",
    "status": "I",
    "start": "2000-01-01",
    "attrs": {
     "cust_category": "IT",
     "cust_level": "IT_OLD",
     "cust_allowanceAmount": 0,
     "cust_currency": "JPY"
    }
   }
  },
  "FOEventReason": {
   "HIRNEW": {
    "name": "新卒入社",
    "en": "New Graduate Hire",
    "status": "A",
    "start": "2000-01-01",
    "attrs": {
     "event": "H",
     "emplStatus": "A"
    }
   },
   "HIRMID": {
    "name": "中途入社",
    "en": "Experienced Hire",
    "status": "A",
    "start": "2000-01-01",
    "attrs": {
     "event": "H",
     "emplStatus": "A"
    }
   },
   "HIRGRP": {
    "name": "グループ転籍入社",
    "en": "Group Transfer Hire",
    "status": "A",
    "start": "2000-01-01",
    "attrs": {
     "event": "H",
     "emplStatus": "A"
    }
   },
   "REHIRE": {
    "name": "再雇用",
    "en": "Rehire after Retirement",
    "status": "A",
    "start": "2000-01-01",
    "attrs": {
     "event": "R",
     "emplStatus": "A"
    }
   },
   "PRM_REG": {
    "name": "定期昇格",
    "en": "Regular Promotion",
    "status": "A",
    "start": "2000-01-01",
    "attrs": {
     "event": "PRM",
     "emplStatus": "A"
    }
   },
   "PRM_SPC": {
    "name": "抜擢昇格",
    "en": "Special Promotion",
    "status": "A",
    "start": "2000-01-01",
    "attrs": {
     "event": "PRM",
     "emplStatus": "A"
    }
   },
   "PRM_TTL": {
    "name": "役職昇進",
    "en": "Title Promotion",
    "status": "A",
    "start": "2000-01-01",
    "attrs": {
     "event": "PRM",
     "emplStatus": "A"
    }
   },
   "PRM_OLD": {
    "name": "昇格（旧制度）",
    "en": "Promotion (Legacy)",
    "status": "I",
    "start": "2000-01-01",
    "attrs": {
     "event": "PRM",
     "emplStatus": "A"
    }
   },
   "DEM_GRD": {
    "name": "降格",
    "en": "Grade Demotion",
    "status": "A",
    "start": "2000-01-01",
    "attrs": {
     "event": "DEM",
     "emplStatus": "A"
    }
   },
   "JOB_CHG": {
    "name": "職務変更",
    "en": "Job Change",
    "status": "A",
    "start": "2000-01-01",
    "attrs": {
     "event": "5",
     "emplStatus": "A"
    }
   },
   "TRN_INT": {
    "name": "社内異動",
    "en": "Internal Transfer",
    "status": "A",
    "start": "2000-01-01",
    "attrs": {
     "event": "TRN",
     "emplStatus": "A"
    }
   },
   "TRN_SEC": {
    "name": "出向",
    "en": "Secondment",
    "status": "A",
    "start": "2000-01-01",
    "attrs": {
     "event": "TRN",
     "emplStatus": "A"
    }
   },
   "TRN_RTN": {
    "name": "出向復帰",
    "en": "Return from Secondment",
    "status": "A",
    "start": "2000-01-01",
    "attrs": {
     "event": "TRN",
     "emplStatus": "A"
    }
   },
   "DATA_COR": {
    "name": "データ修正",
    "en": "Data Correction",
    "status": "A",
    "start": "2000-01-01",
    "attrs": {
     "event": "9",
     "emplStatus": "A"
    }
   },
   "PROB_END": {
    "name": "試用期間終了",
    "en": "Probation Completed",
    "status": "A",
    "start": "2000-01-01",
    "attrs": {
     "event": "9",
     "emplStatus": "A"
    }
   },
   "LOA_SICK": {
    "name": "私傷病休職",
    "en": "Sick Leave",
    "status": "A",
    "start": "2000-01-01",
    "attrs": {
     "event": "LOA",
     "emplStatus": "U"
    }
   },
   "LOA_CARE": {
    "name": "育児休業",
    "en": "Childcare Leave",
    "status": "A",
    "start": "2000-01-01",
    "attrs": {
     "event": "LOA",
     "emplStatus": "U"
    }
   },
   "LOA_MAT": {
    "name": "産前産後休業",
    "en": "Maternity Leave",
    "status": "A",
    "start": "2000-01-01",
    "attrs": {
     "event": "LOA",
     "emplStatus": "P"
    }
   },
   "RTW": {
    "name": "復職",
    "en": "Return to Work",
    "status": "A",
    "start": "2000-01-01",
    "attrs": {
     "event": "RTW",
     "emplStatus": "A"
    }
   },
   "TER_VOL": {
    "name": "自己都合退職",
    "en": "Voluntary Resignation",
    "status": "A",
    "start": "2000-01-01",
    "attrs": {
     "event": "26",
     "emplStatus": "T"
    }
   },
   "TER_INV": {
    "name": "会社都合退職",
    "en": "Involuntary Termination",
    "status": "A",
    "start": "2000-01-01",
    "attrs": {
     "event": "26",
     "emplStatus": "T"
    }
   },
   "TER_RET": {
    "name": "定年退職",
    "en": "Retirement",
    "status": "A",
    "start": "2000-01-01",
    "attrs": {
     "event": "26",
     "emplStatus": "T"
    }
   }
  },
  "User": {
   "EMP0001": {
    "name": "山田 太郎",
    "en": "Taro Yamada",
    "status": "A",
    "attrs": {
     "username": "emp0001",
     "email": "emp0001@demo-corp.example"
    }
   },
   "EMP0002": {
    "name": "佐藤 健一",
    "en": "Kenichi Sato",
    "status": "A",
    "attrs": {
     "username": "emp0002",
     "email": "emp0002@demo-corp.example"
    }
   },
   "EMP0003": {
    "name": "鈴木 美咲",
    "en": "Misaki Suzuki",
    "status": "A",
    "attrs": {
     "username": "emp0003",
     "email": "emp0003@demo-corp.example"
    }
   },
   "EMP0004": {
    "name": "高橋 誠",
    "en": "Makoto Takahashi",
    "status": "A",
    "attrs": {
     "username": "emp0004",
     "email": "emp0004@demo-corp.example"
    }
   },
   "EMP0005": {
    "name": "田中 裕子",
    "en": "Yuko Tanaka",
    "status": "A",
    "attrs": {
     "username": "emp0005",
     "email": "emp0005@demo-corp.example"
    }
   },
   "EMP0006": {
    "name": "伊藤 大輔",
    "en": "Daisuke Ito",
    "status": "A",
    "attrs": {
     "username": "emp0006",
     "email": "emp0006@demo-corp.example"
    }
   },
   "EMP0007": {
    "name": "渡辺 直樹",
    "en": "Naoki Watanabe",
    "status": "A",
    "attrs": {
     "username": "emp0007",
     "email": "emp0007@demo-corp.example"
    }
   },
   "EMP0008": {
    "name": "中村 恵",
    "en": "Megumi Nakamura",
    "status": "A",
    "attrs": {
     "username": "emp0008",
     "email": "emp0008@demo-corp.example"
    }
   },
   "EMP0009": {
    "name": "小林 翔",
    "en": "Sho Kobayashi",
    "status": "A",
    "attrs": {
     "username": "emp0009",
     "email": "emp0009@demo-corp.example"
    }
   },
   "EMP0010": {
    "name": "加藤 彩",
    "en": "Aya Kato",
    "status": "A",
    "attrs": {
     "username": "emp0010",
     "email": "emp0010@demo-corp.example"
    }
   },
   "EMP0011": {
    "name": "吉田 拓也",
    "en": "Takuya Yoshida",
    "status": "A",
    "attrs": {
     "username": "emp0011",
     "email": "emp0011@demo-corp.example"
    }
   },
   "EMP0012": {
    "name": "山本 千尋",
    "en": "Chihiro Yamamoto",
    "status": "A",
    "attrs": {
     "username": "emp0012",
     "email": "emp0012@demo-corp.example"
    }
   },
   "HR_ADMIN": {
    "name": "人事 管理者",
    "en": "Admin HR",
    "status": "A",
    "attrs": {
     "username": "hr_admin",
     "email": "hr_admin@demo-corp.example"
    }
   },
   "EMP0099": {
    "name": "松本 浩二",
    "en": "Koji Matsumoto",
    "status": "I",
    "attrs": {
     "username": "emp0099",
     "email": "emp0099@demo-corp.example"
    }
   }
  }
 }
};
