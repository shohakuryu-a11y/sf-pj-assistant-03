# 架空テナント「Demo Corp」のメタデータ

すべて架空のデータで、実在する顧客のテナントとは関係ありません。
アプリはこれらのファイルを直接読み込みません。`python tools/build_catalog.py` を実行すると、これらと `overlay.json` を合わせて `data/catalog.js`（スキーマ 2）を生成します。元のファイルは `python demo_data/gen.py` で作り直せます。

## ファイル

| ファイル | 内容 | 実環境で対応するもの |
| --- | --- | --- |
| metadata_ja.xml | OData `$metadata`（日本語ラベル）。EntityType・Property・NavigationProperty・Association | `Accept-Language: ja-JP` を付けたリクエストの結果 |
| metadata_en.xml | OData `$metadata`（英語ラベル） | `Accept-Language: en-US` を付けたリクエストの結果 |
| picklists.json | PickListV2 とその値（24 リスト、94 値。親 picklist と親の値を含む） | 実際の API より構造を簡略化 |
| event_reasons.json | FOEventReason（22 件。イベントと在籍ステータスを含む） | 実際の API より構造を簡略化 |
| records.json | Foundation Object・Generic Object・MDF のレコード（93 件） | 各オブジェクトの OData の結果を簡略化 |
| users.json | User（14 人） | User エンティティの結果を簡略化 |
| data_model_demo.xml | 簡略版の Succession Data Model（HRIS 要素と項目 ID） | OData のプロパティ名と HRIS の項目 ID の対応づけに使用 |
| overlay.json | オブジェクトの種類、使える event、クロスエンティティ、アソシエーションの種類、データ型の補正、カスケードの親項目、設定、**全 35 オブジェクト（objects）・全 24 ピックリスト（picklists）・全 322 項目（fields）の意味の説明と同義語**、メタデータにないオブジェクト（extraObjects：入社・再入社の Employee Information） | メタデータに含まれない情報 |
| gen.py | 上記のメタデータファイルを生成するスクリプト | オブジェクト・項目・レコードを追加したいときは、これを変更して再実行 |

規模：36 オブジェクト（Employee Central 12、ユーザー 1、Foundation Object 12、Generic Object 3、カスタム MDF 8）、323 項目。Employee Central のうち 1 つは、メタデータにない入社・再入社用の Employee Information（`EmployeeInformation`、overlay.json の extraObjects で追加）です。

使える event は SAP の仕様に合わせています。Foundation Object は onInit・onSave（onChange は使えない）、MDF・Generic Object は onInit・onValidate・onChange・onSave・onPostSave・onDelete・onLoad（有効日付があれば onInsert も。onView はない）です。

すべての項目に「意味の説明」と「同義語」があります。似た名前で意味が違う項目や、同じ意味で名前・型が違う項目は、意味の説明に「〜とは別」「〜と同じ意味だが型が違う」と明記しています。オブジェクトとピックリストにも、業務上の意味の説明と同義語があります。説明を変えるときは `overlay.json` の `objects` / `picklists` / `fields` を編集し、`python tools/build_catalog.py` を実行します。

## データモデルの構造

- **参照項目**：項目のデータ型が Foundation Object / Generic Object / ユーザーのとき、参照先（Valid Values Source）を持ちます。例：`EmpJob.department` → FODepartment、`EmpJob.position` → Position、`EmpJob.customString4` → cust_JobFamily（カスタム MDF を参照する Generic Object 項目）、`cust_Qualification.cust_qualification` → cust_QualificationMaster、`EmpJob.managerId` → User
- **アソシエーション**：`EmpEmployment.jobInfoNav`（1:n）、`PerPerson.emailNav`（1:n）、`cust_TrainingPlan.cust_items`（コンポジット、1:n）、`FODepartment.cust_toDivision`（Valid When）など
- **カスケード picklist**：`JP_QualLevel` は `JP_QualCategory` を親に持ち、`cust_Qualification.cust_level` の親項目は `cust_category`
- **クロスエンティティ**：職務情報（EmpJob）から報酬情報・職務上の関係・定期報酬・一時報酬・雇用情報へ、報酬情報から職務上の関係・定期報酬・一時報酬へ、定期報酬から職務上の関係・一時報酬へ、一時報酬から定期報酬へ値を設定できる（SAP のドキュメントでサポートされている組み合わせから選んだデモの設定）。Employee Information からは、入社・再入社で扱う個人情報・雇用情報・職務情報などに設定できる
- **読み取り専用**：キー（userId、seqNumber、externalCode など）、システム項目（createdBy、lastModifiedDateTime）、自動採番、在籍ステータス（emplStatus）、退職日（EmpEmployment.endDate）など

## わざと仕込んだテスト用の落とし穴

検索・生成・検証の品質を確かめるため、実際のプロジェクトでよくある状況を入れています。

1. **「昇格日」という項目がない。** いちばん近いのは `EmpJob.customDate1`（最終等級変更日）だけです。正しくは派生概念として扱い、イベント事由が昇格のときに発令日を日付項目に書き込みます。
2. **昇格のイベント事由が複数ある。** `PRM_REG`（定期昇格）、`PRM_SPC`（抜擢昇格）、`PRM_TTL`（役職昇進）は、いずれもイベント `PRM` に属します。
3. **無効のデータがある。** イベント事由 `PRM_OLD`、選択肢 `employeeclass` の `5`（派遣社員）・`JP_Position` の `SEC`（係長）・`event` の `SUS`、部署 `D3900`、等級 `GX`、報酬項目 `ALW_OLD`、ユーザー `EMP0099` などは無効で、バリデーターは拒否するべきです。
4. **有効期間外のレコードがある。** 勤務地 `LOC_SDI`（仙台営業所）は 2024-03-31 で終了、部署 `D4000`（新規事業準備室）は 2027-04-01 から有効です。
5. **同じプロパティ名でも、オブジェクトによって意味が違う。** `customDate1` は EmpJob では「最終等級変更日」、EmpEmployment では「グループ入社日」です。
6. **入社日の候補が複数ある。** `EmpEmployment.startDate`（入社日）、`originalStartDate`（当初入社日）、`customDate1`（グループ入社日）。
7. **別の保存先の候補がある。** カスタム MDF `cust_PromotionHistory`（昇進昇格履歴）でも昇格を記録できます。
8. **集合（1:n）でしか届かない項目がある。** 職務情報からメールアドレス（PerEmail）へは 1:n のため、集合フィルター（where。例：メールの種類が業務用のもの）で 1 件に絞るか、Cardinality・Sum of Collection Field Values などの集計関数で使う必要があります。保有資格（cust_Qualification）へは、職務情報からたどる経路がありません。
9. **読み取り専用の項目がある。** 在籍ステータス（`EmpJob.emplStatus`）はイベント事由から決まるため、ルールで設定できません。退職日は `EmpEmploymentTermination.endDate` で入力します。
10. **同じ意味なのに表現が違う。** 「有期雇用」＝契約種別（contractType）、「就業場所」＝勤務地、「雇止め予定日」＝契約終了日（contractEndDate）、「雇入れ日」＝入社日、「直属の上司」＝上長、「所属組織の長」＝部署長。いずれも同義語に登録しています。
11. **似た表現なのに意味が違う。** 次の組は取り違えやすいように作っています。意味の説明で区別を明記しています。

    | 言葉 | 正しい項目 | 取り違えやすい項目 |
    | --- | --- | --- |
    | 有期雇用 | 契約種別 `EmpJob.contractType` | 社員区分 `employeeClass`（契約社員でも無期の場合あり）、雇用形態 `employmentType`（フルタイム／パート） |
    | 雇止め予定日・契約満了日 | 契約終了日 `EmpJob.contractEndDate` | 契約更新日 `customDate5`、資格の有効期限 `cust_Qualification.cust_expiryDate` |
    | 雇入れ日 | 入社日 `EmpEmployment.startDate` | 入社予定日 `EmpEmployment.customDate3` |
    | 就業場所 | 勤務地 `EmpJob.location` | 勤務形態 `customString6`（出社・在宅の区分） |
    | 直属の上司 | 上長 `EmpJob.managerId` | 関係者 `EmpJobRelationships.relUserId`（マトリクス上長）、`User.manager`（読み取り専用の写し）、承認者 `cust_PromotionHistory.cust_approver` |
    | 所属組織の長 | 部署長 `FODepartment.headOfUnit` | 事業本部長 `FOBusinessUnit.headOfUnit`（ラベル「本部長」）、役職 picklist の値「本部長」（JP_Position EXE） |
    | 資格取得日 | 免許・検定は `cust_Qualification.cust_acquiredDate` | ラベルが同じ「資格取得日」の `EmpEmployment.customDate4`（雇用保険） |
    | 等級 | 給与の等級 `EmpJob.payGrade` | 職級 `customString5`、資格のレベル `cust_level`、旧等級 `cust_EmployeeProfile.cust_grade`（コード体系が違う） |
    | 評価ランクと評価係数 | 評価ランク `customString2` | 賞与係数 `customDouble1`、評価点 `cust_AppraisalResult.cust_score` |

12. **同じ名前・同じ意味なのに、オブジェクトによって型が違う。** 社員プロファイル（`cust_EmployeeProfile`、旧人事システムの移行データ）などに、現行の項目と同じラベルで型だけ違う項目を置いています。比較・代入では関数で型を揃える必要があります。

    | 項目 | 現行の項目（型） | 別のオブジェクトの同名項目（型） | 揃えるための関数 |
    | --- | --- | --- | --- |
    | 入社日 | `EmpEmployment.startDate`（日付） | `cust_EmployeeProfile.cust_hireDate`（文字列 YYYYMMDD） | Substring → To Number → Create Date ／ Format（"%1$tY%1$tm%1$td"） |
    | 社員番号 | `EmpEmployment.customString2`（文字列、先頭 0 あり） | `cust_EmployeeProfile.cust_employeeNo`（整数） | To Number → Round（精度 0）／ Format Number（"%d"） |
    | 入社年度 | `EmpEmployment.customLong2`（整数） | `cust_EmployeeProfile.cust_hireYear`（文字列） | Format Number（"%d"）／ To Number |
    | 定年年齢 | `EmpEmployment.customLong1`（整数） | `cust_EmployeeProfile.cust_retirementAge`（文字列） | Format Number（"%d"）／ To Number |
    | 勤続年数 | `EmpEmployment.customLong3`（整数） | `cust_EmployeeProfile.cust_serviceYears`（小数） | Round（精度 0、小数 → 整数） |
    | 最終等級変更日 | `EmpJob.customDate1`（日付） | `cust_EmployeeProfile.cust_lastPromotionDate`（日時） | Get Local Date of DateTime |
    | テレワーク対象 | `EmpJob.customBoolean2`（はい/いいえ） | `cust_EmployeeProfile.cust_remoteFlag`（文字 Y/N） | 文字の定数 "Y" と比較 |
    | 資格手当 | `cust_Qualification.cust_allowanceAmount`（小数） | `cust_EmployeeProfile.cust_qualificationAllowance`（整数） | Round（精度 0） |
    | 評価ランク | `EmpJob.customString2`（選択肢） | `cust_AppraisalResult.cust_rank`（文字列） | なし（選択肢と文字列は比較できない） |
    | 年度 | `cust_TrainingPlan.cust_fiscalYear`（整数） | `cust_AppraisalResult.cust_fiscalYear`（文字列 "FY2026"） | なし（書式が違う） |

13. **2 文字の検索語。** 「昇格」「等級」は 2 文字しかないため FTS5 の trigram では検索できず、LIKE に切り替える必要があります。

## 評価用の要件例

- 昇格年月日を自動セットするビジネスルール → 派生概念として、customDate1 を保存先の候補に挙げられるか
- 試用期間終了日を入社日の6か月後に自動セット → EmpJob.probationPeriodEndDate と日付計算の関数
- 役職が課長以上なら裁量労働対象をオン → customString3（JP_Position）と customBoolean1。DMGR 課長代理を含めないか
- 定年到達日を生年月日から計算 → PerPerson.dateOfBirth と EmpEmployment.customDate2（オブジェクトをまたぐ）
- 出向の事由で異動したら出向開始日をセット → TRN_SEC と customDate3
- 第一営業部に異動したらテレワーク対象をオン → `{"object":"FODepartment","codes":["D1100"]}` で比較できるか
- テレワーク対象になったら在宅勤務手当を設定 → クロスエンティティで EmpPayCompRecurring に ALW_REMOTE を設定できるか
