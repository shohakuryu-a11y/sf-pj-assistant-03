// ナレッジ（event・ルールシナリオ・関数表・概念辞書・知識カード）。
// プロンプトの作成と、バリデーターのチェックに使う。サンプルなので、実際の運用では自分のプロジェクト経験に合わせて書き直すこと。
window.BR_KNOWLEDGE = {
 // event：ルールを実行するタイミング
 //   canSet      … この event で項目に値を設定できるか
 //   needsTrigger … トリガー項目（trigger_field）が必要か
 //   apps        … この event がある領域（EC：Employee Central・Foundation Object、MDF：MDF・Generic Object）
 //   どの base object で使えるかは、データモデルのオブジェクトごとの「使える event」と、ルールシナリオ（scenarios）で決まる
 //   出典：Implementing Employee Central Core（2611 版）7.7「Overview: Rule Events in Employee Central」
 //         Implementing the Metadata Framework（2611 版）11.3「Supported Purposes for MDF Rule Scenarios」
 events: [
  {name: 'onInit',     canSet: true,  apps: ['EC', 'MDF'], desc: '画面を開いたとき（レコードを作るとき）。初期値と項目の必須・表示の設定に使う。Employee Central では入社・再入社の画面と、Foundation Object（Manage Organization, Pay and Job Structures）でだけ実行される'},
  {name: 'onChange',   canSet: true,  apps: ['EC', 'MDF'], needsTrigger: true, desc: '項目の値が変わったとき。結果をその場で画面に反映したい場合に使う。トリガー項目を指定する。インポートと API では実行されない。Foundation Object では使えない'},
  {name: 'onSave',     canSet: true,  apps: ['EC', 'MDF'], desc: '保存するとき。インポートなど画面以外の更新でも確実に値を設定したい場合や、保存を止めるエラーメッセージに使う。項目の必須・表示の設定には使わない'},
  {name: 'onView',     canSet: true,  apps: ['EC'], desc: '画面を表示するとき（Employee Central）。表示・必須の制御と、保存しない一時的な項目（年齢など）の計算に使う。一時的な項目は、保存時に空欄に戻す onSave のルールも必要'},
  {name: 'onPostSave', canSet: false, apps: ['EC', 'MDF'], desc: '保存した後。値は設定できない。Employee Central では職務情報（Job Information Model）で Intelligent Services のイベントを発生させるときだけ、MDF ではメッセージと MDF アラートに使う'},
  {name: 'saveAlert',  canSet: false, apps: ['EC'], desc: '保存した後に Employee Central のアラートを作る（契約の満了前の通知など）。職務情報・雇用情報・報酬情報・定期報酬・一時報酬などでだけ使える'},
  {name: 'onValidate', canSet: false, apps: ['MDF'], desc: '保存の前に入力値を検証するとき（MDF）。メッセージを出すだけで、値は設定しない。インポートの検証でも実行される'},
  {name: 'onDelete',   canSet: false, apps: ['MDF'], desc: 'レコードを削除したとき（MDF）。メッセージとワークフローに使う。インポートでは実行されない'},
  {name: 'onInsert',   canSet: true,  apps: ['MDF'], desc: '有効日付のある MDF で、新しい有効日付のレコードを挿入するとき'},
  {name: 'onLoad',     canSet: true,  apps: ['MDF'], desc: 'MDF の画面を読み込むとき。Manage Data › Object Configuration（Manage Data On Load・Reimagined UI On Load）か Configurable UI の On Load に割り当てる'}
 ],

 // ルールシナリオ：SAP SuccessFactors の Configure Business Rules でルールを作るときに最初に選ぶもの。
 //   シナリオによって、base object・event・使えるアクションが決まる
 //   出典：Implementing Employee Central Core（2611 版）7.1「Rule Scenarios for Employee Central Core」・7.5〜7.9
 //         Implementing the Metadata Framework（2611 版）11 章「Business Rules in MDF」
 //         Implementing Business Rules in SAP SuccessFactors（2611 版）5・6・9・14 章
 //   id      … 設計案 JSON の scenario に書く値
 //   app     … 'EC'（Employee Central）／ 'FO'（Foundation Object）／ 'MDF'（MDF・Generic Object）
 //   name    … SAP の画面に表示される正式名（英語）
 //   kinds   … base object にできるオブジェクトの種類 ／ bases … base object にできるオブジェクト ID（kinds より優先）
 //   notBases … kinds のうち、base object にできないオブジェクト
 //   model   … 'required'（Model の base object が必要）／ 'optional' ／ 'no'
 //   events  … 使える event（null は検証しない）
 //   actions … 設計案 JSON で使えるアクション（set / property / raise / create / delete / workflow）
 //   other   … 設計案 JSON では書けない、このシナリオのアクション（SAP の画面で設定する）
 //   purposes … true なら MDF の目的（mdfPurposes）を選ぶ。使えるアクションは目的で決まる
 //   check   … false なら、base object と Model 以外は詳しく検証しない（ツールの対象外のシナリオ）
 //   assign  … ルールを割り当てる場所 ／ notes … 注意点（プロンプトと設定方法の表示に使う）
 scenarios: [
  {id: 'ec_hire', app: 'EC', name: 'Trigger Rules for Hire/Rehire', ja: '入社・再入社のルール',
   bases: ['EmployeeInformation'], model: 'optional', events: ['onInit', 'onChange', 'onSave'], actions: ['set', 'property', 'raise'],
   assign: 'Manage Business Configuration › 該当の HRIS 要素（jobInfo など）› Trigger Rules に、event を選んで追加する',
   notes: ['入社・再入社の画面（Add New Employee）でだけ実行される', 'まだ保存されていない個人情報・雇用情報・職務情報などを、Employee Information からたどって読み書きできる', '入社だけで動かすルールは、Context を「New Hire/Rehire UI = Yes、Edit UI (ESS/MSS) = No」にする', '項目の必須・表示を設定するときは Employee Information Model（"model": true）にする']},
  {id: 'ec_hire_init', app: 'EC', name: 'Trigger onInit Rules for Hire/Rehire', ja: '入社・再入社の画面を開いたときのルール',
   bases: ['EmployeeInformation'], model: 'required', events: ['onInit'], actions: ['set', 'property'],
   assign: 'Manage Business Configuration › 該当の HRIS 要素 › Trigger Rules（event：onInit）',
   notes: ['すべての入社・再入社（旧雇用・新雇用の両方）で、画面を開いたときに初期値と必須・表示を設定する', 'base object は Employee Information Model', 'クロスエンティティのナビゲーションは使えない']},
  {id: 'ec_change', app: 'EC', name: 'Trigger onChange Rules for HRIS Elements', ja: '項目を変更したときのルール',
   kinds: ['EC'], notBases: ['EmployeeInformation'], model: 'optional', events: ['onChange'], actions: ['set', 'property', 'raise'],
   assign: 'Manage Business Configuration › 該当の HRIS 要素 › 該当の HRIS 項目（トリガー項目）› Trigger Rules（event：onChange）',
   notes: ['インポートと API では実行されない。確実に値を設定するなら onSave のルールも作る', 'メッセージを出しても保存は止まらない（最新の People Profile ではエラーも警告として表示される）。保存を止めるなら onSave にする', '設定した項目に onChange のルールがあれば、続けて実行される（同じ項目に戻ると止まる）', '項目の必須・表示を設定するときは Model（"model": true）にする']},
  {id: 'ec_save', app: 'EC', name: 'Trigger onSave Rules for HRIS Elements', ja: '保存するときのルール',
   kinds: ['EC'], notBases: ['EmployeeInformation'], model: 'optional', events: ['onSave'], actions: ['set', 'raise', 'create', 'delete'],
   assign: 'Manage Business Configuration › 該当の HRIS 要素 › Trigger Rules（event：onSave）',
   notes: ['インポートと API でも実行される', 'ワークフローがあるときは、承認の最後ではなく、申請したときに実行される', 'Employee Central のメッセージは、警告・情報を指定してもエラーとして扱われる', '項目の必須・表示は onSave で設定しない（onInit・onChange・onView で設定する）']},
  {id: 'ec_view', app: 'EC', name: 'Trigger onView Rules for HRIS Elements', ja: '画面を表示するときのルール',
   kinds: ['EC'], notBases: ['EmployeeInformation'], model: 'optional', events: ['onView'], actions: ['set', 'property'],
   assign: 'Manage Business Configuration › 該当の HRIS 要素 › Trigger Rules（event：onView）',
   notes: ['保存しない一時的な項目（年齢など）の計算と、項目の必須・表示の設定に使う', '一時的な項目に値を設定するときは、保存時にその項目を空欄に戻す onSave のルールも必要', '退職（Terminate）の画面では実行されない', '実行後に権限のチェックは行われない']},
  {id: 'ec_validate', app: 'EC', name: 'Validate HRIS Elements', ja: 'HRIS 要素の入力チェック',
   kinds: ['EC'], notBases: ['EmployeeInformation'], model: 'optional', events: ['onChange', 'onSave'], actions: ['raise'],
   assign: 'Manage Business Configuration › 該当の HRIS 要素 › Trigger Rules（保存を止めるなら event：onSave）',
   notes: ['条件に当てはまるときにメッセージを出す。メッセージの文は Message Definition（Manage Data）で先に作る', 'onChange のメッセージでは保存は止まらない。保存を止めるなら onSave にする', 'Employee Central のメッセージは、警告・情報を指定してもエラーとして扱われる']},
  {id: 'ec_erd', app: 'EC', name: 'Trigger Event Reason Derivation', ja: 'イベント事由の自動設定',
   bases: ['EmpJob', 'EmpCompensation'], model: 'required', events: ['onSave'], actions: ['set'], setOnly: ['eventReason', 'event'],
   assign: 'Manage Business Configuration › jobInfo（または compInfo）› Trigger Rules（event：onSave）。Manage Employee Central Settings で Event Reason Derivation をオンにする',
   notes: ['職務情報と報酬情報でだけ使える。設定できるのはイベント事由（とイベント）だけ', '上書きしないよう、イベント事由が空のときだけ設定する', 'ほかの onSave のルールの後、ワークフローの決定の前に実行される', 'HRIS 要素ごとに 1 つのルールにまとめるのがよい。雇用ステータスが変わるイベント事由は設定しない']},
  {id: 'ec_wf', app: 'EC', name: 'Trigger Workflows', ja: 'ワークフローの決定',
   kinds: ['EC', 'Foundation'], notBases: ['EmployeeInformation'], model: 'optional', events: ['onSave'], actions: ['workflow'],
   assign: 'Manage Business Configuration › 該当の HRIS 要素（Foundation Object の場合はそのオブジェクト）› Trigger Rules（event：onSave）',
   notes: ['ほかの onSave のルールとイベント事由の自動設定の後に実行される', 'HRIS 要素ごとに 1 つのルールにまとめるのがよい', 'ワークフロー（Workflow Configuration）は先に作っておく']},
  {id: 'ec_cross', app: 'EC', name: 'Trigger Cross-Entity Rules', ja: '他のエンティティへの反映（クロスエンティティ）',
   bases: ['EmpJob', 'EmpJobRelationships', 'EmpCompensation', 'EmpPayCompRecurring', 'EmpPayCompNonRecurring', 'EmpEmployment', 'EmpEmploymentTermination'], model: 'optional', events: ['onChange', 'onSave'], actions: ['set', 'create', 'delete'],
   assign: 'Manage Business Configuration › 変更元の HRIS 要素（base object）› Trigger Rules（event：onSave または onChange）',
   notes: ['変更元のエンティティを base object にする', 'onChange のクロスエンティティは、Manager Self-Service の画面で両方のエンティティを選んだときだけ動く。インポートと API では動かない', 'クロスエンティティで変更された側の onSave のルールは実行されない', '職務情報・報酬情報には Create を使わず Set で設定する（Set で新しいレコードができる）']},
  {id: 'ec_alert', app: 'EC', name: 'Generate Employee Central Alerts', ja: 'Employee Central のアラート',
   bases: ['EmpCompensation', 'EmpPayCompRecurring', 'EmpPayCompNonRecurring', 'EmpJob', 'EmpEmployment'], model: 'optional', events: ['saveAlert'], actions: [], other: 'アラート（説明・期日・受信者）の設定',
   assign: 'Manage Business Configuration › 該当の HRIS 要素 › Trigger Rules（event：saveAlert）',
   notes: ['base object と同じエンティティの項目だけを読める', 'アラートの内容は SAP の画面で設定する']},
  {id: 'ec_postsave', app: 'EC', name: 'Trigger onPostSave Events for Job Information', ja: '職務情報の保存後のイベント',
   bases: ['EmpJob'], model: 'required', events: ['onPostSave'], actions: [], other: 'Execute（Intelligent Services のイベントを発生させる）',
   assign: 'Manage Business Configuration › jobInfo › Trigger Rules（event：onPostSave）',
   notes: ['base object は Job Information Model だけ', 'ワークフローがあるときは、最後の承認の後に実行される', '保存の後なので、前の値（Previous Value）は現在の値と同じになる']},
  {id: 'ec_rehire_new', app: 'EC', name: 'Enforce New Employment for Rehire', ja: '再入社で新しい雇用を必須にする',
   bases: ['EmployeeInformation'], model: 'optional', events: null, actions: ['raise'], check: false,
   assign: 'Manage Business Configuration（再入社の設定）', notes: ['新しい雇用での再入社の条件を満たさないときに、エラーメッセージを出す']},
  {id: 'ec_empid', app: 'EC', name: 'Generate Employee ID for Hire/Rehire', ja: '入社時の社員 ID の採番',
   bases: ['EmployeeInformation'], model: 'optional', events: null, actions: ['set'], check: false,
   assign: 'Manage Data › Hire/Rehire Configuration に登録する（Onboarding を使うときは Onboarding Configuration にも）',
   notes: ['MDF の Sequence（Get Next Value）で採番し、Employee Information の userId に設定する']},
  {id: 'ec_assignid', app: 'EC', name: 'Generate Assignment ID External', ja: 'Assignment ID External の採番',
   kinds: ['EC'], model: 'optional', events: null, actions: ['set'], check: false,
   assign: 'Assignment ID の設定（Implementing Employee Central Core の Assignment ID を参照）', notes: ['このシナリオのルールは 1 つだけ作る']},
  {id: 'ec_fte', app: 'EC', name: 'Calculate Full-Time Equivalent', ja: 'FTE の計算',
   bases: ['EmpJob'], model: 'required', events: null, actions: ['set'], check: false,
   assign: 'Manage Business Configuration › jobInfo', notes: ['base object は Job Information Model']},
  {id: 'ec_jobhist', app: 'EC', name: 'Display Internal Job History', ja: '社内の職歴の表示',
   bases: ['EmpJob'], model: 'no', events: null, actions: [], other: '条件（IF）だけ。表示する職歴を決める', check: false,
   assign: 'People Profile の Internal Job History ブロックの設定', notes: ['IF の条件だけを書く']},
  {id: 'ec_offcycle', app: 'EC', name: 'Trigger an Off Cycle Event Batch', ja: 'Off Cycle Event Batch',
   bases: ['EmpJob', 'EmpEmployment'], model: 'required', events: null, actions: ['set'], check: false,
   assign: 'Off Cycle Event Batch オブジェクト', notes: ['Off Cycle Event Batch Processing のジョブで実行される']},
  {id: 'ec_offcycle_ev', app: 'EC', name: 'Trigger Event for Off Cycle Event Batch', ja: 'Off Cycle Event Batch のイベント',
   bases: ['EmpJob', 'EmpEmployment'], model: 'required', events: null, actions: [], other: 'Execute', check: false,
   assign: 'Off Cycle Event Batch オブジェクト', notes: ['Off Cycle Event Batch Processing のジョブで実行される']},
  {id: 'fo_basic', app: 'FO', name: 'Basic', ja: 'Foundation Object のルール',
   kinds: ['Foundation'], model: 'no', events: ['onInit', 'onSave'], actions: ['set', 'raise'],
   assign: 'Manage Business Configuration › Foundation Objects › 該当のオブジェクト › Trigger Rules（event：onInit または onSave）',
   notes: ['onChange は Foundation Object では使えない', '値を設定できるのは、base object にした Foundation Object 自身の項目だけ（職務情報から部署の項目を設定することはできない）', 'onInit は Manage Organization, Pay and Job Structures の画面でだけ実行される', 'テナントで Foundation Object が MDF に移行済みなら、MDF のシナリオ（Rules for MDF Objects）を使う']},
  {id: 'mdf_objects', app: 'MDF', name: 'Rules for MDF Objects', ja: 'MDF オブジェクトのルール',
   kinds: ['MDF', 'GO'], model: 'no', events: ['onInit', 'onValidate', 'onChange', 'onSave', 'onPostSave', 'onDelete', 'onInsert', 'onLoad'], purposes: true,
   assign: 'Configure Object Definitions › 該当のオブジェクト › Take Action › Make Correction › Rules（目的に応じた種類の欄）。onChange は項目の Details › Rule、On Load は Manage Data › Object Configuration',
   notes: ['ルールを作るときに目的（Purpose）を選ぶ。目的によって割り当てられる event と使えるアクションが決まる', 'Basic のシナリオでは新しいルールを作れない']},
  {id: 'mdf_meta', app: 'MDF', name: 'Rules for Metadata of MDF Objects', ja: 'MDF の項目の必須・表示',
   kinds: ['MDF', 'GO'], model: 'no', events: ['onInit', 'onInsert', 'onChange', 'onLoad'], actions: ['property'],
   assign: 'Configure Object Definitions › 該当のオブジェクト › Rules（項目の必須・表示）。On Load は Manage Data › Object Configuration › Reimagined UI On Load',
   notes: ['最新の People Profile（Reimagined UI）でだけ有効。Manage Data・ワークフローの承認・入社の画面では動かない', '項目の値は設定できない（値は Rules for MDF Objects で設定する）', 'IF の条件に、項目の必須・表示を使えない']}
 ],

 // MDF の目的（Rules for MDF Objects の Purpose）と、割り当てられる event・使えるアクション
 //   出典：Implementing the Metadata Framework（2611 版）11.3「Supported Purposes for MDF Rule Scenarios」
 mdfPurposes: {
  initialize:  {name: 'Initialize',   ja: '初期値の設定', events: ['onInit'], actions: ['set'], desc: 'レコードを作るときに初期値を設定する。システム項目も設定できる'},
  validate:    {name: 'Validate',     ja: '入力チェック', events: ['onValidate', 'onSave', 'onPostSave', 'onDelete', 'onChange'], actions: ['raise'], desc: '項目の値を検証し、エラー・警告・情報のメッセージを出す'},
  evaluate:    {name: 'Evaluate',     ja: '値の計算', events: ['onSave', 'onChange'], actions: ['set'], desc: 'ほかの項目の値から項目の値を決める。onSave では externalCode などのキーとシステム項目を設定できない'},
  stateUpdate: {name: 'State Update', ja: '状態に応じた値の更新', events: ['onInit', 'onInsert', 'onChange', 'onLoad'], actions: ['set'], desc: 'Evaluate と同じように値を設定する。初期化・挿入・変更・読み込みの複数の event に割り当てられる'},
  alert:       {name: 'Alert',        ja: 'MDF アラート', events: ['onPostSave'], actions: [], other: 'MDF アラートの設定', desc: '保存の後に MDF アラートを作る。ワークフローと組み合わせる'},
  workflow:    {name: 'Workflow',     ja: 'ワークフローの決定', events: ['onSave', 'onDelete'], actions: ['workflow'], desc: 'ワークフローが必要か、どのワークフローを使うかを決める。オブジェクト定義の Save の欄にだけ割り当てられる'},
  onLoad:      {name: 'On Load',      ja: '画面の読み込み時', events: ['onLoad'], actions: ['set', 'raise'], desc: '画面を読み込むときに値を設定したり、検証したりする'}
 },

 // Employee Central で、ルールで「必須でない」にしてはいけない項目（データモデルで必須の項目）
 //   出典：Implementing Employee Central Core（2611 版）7.5.1「Properties of Model Base Objects」
 //   '*' はすべての HRIS 要素に共通
 ecAlwaysRequired: {
  '*': ['startDate', 'externalCode', 'status'],
  EmpCompensation: ['currencyCode'],
  PerEmail: ['emailAddress', 'emailType'],
  EmpEmployment: ['startDate', 'endDate'],
  EmpJob: ['company'],
  EmpJobRelationships: ['relationshipType', 'relUserId'],
  PerNationalId: ['cardType', 'nationalId', 'isPrimary', 'country'],
  EmpPayCompNonRecurring: ['payComponentCode', 'value', 'payDate'],
  EmpPayCompRecurring: ['payComponent', 'frequency', 'paycompvalue'],
  PerPersonal: ['firstName', 'lastName']
 },

 // クロスエンティティで Create（新しいレコードの作成）を使える組み合わせと event
 //   出典：Implementing Employee Central Core（2611 版）7.9「Cross-Entity Rules」の Rules Using the Create Expression
 //   職務情報・報酬情報には Create を使わず、Set で設定する（Set で新しいレコードができる）
 crossCreate: {
  EmpJob:                 {EmpJobRelationships: ['onSave', 'onChange'], EmpPayCompRecurring: ['onSave', 'onChange'], EmpPayCompNonRecurring: ['onSave']},
  EmpCompensation:        {EmpJobRelationships: ['onSave', 'onChange'], EmpPayCompRecurring: ['onSave', 'onChange'], EmpPayCompNonRecurring: ['onSave']},
  EmpPayCompRecurring:    {EmpJobRelationships: ['onSave', 'onChange'], EmpPayCompNonRecurring: ['onSave']},
  EmpPayCompNonRecurring: {EmpPayCompRecurring: ['onSave'], EmpPayCompNonRecurring: ['onSave']},
  EmpJobRelationships:    {},
  EmpEmployment:          {}
 },

 // 関数表：SAP SuccessFactors の公式のルール関数だけを載せる（独自の関数は作らない）
 //   出典：SAP Help Portal「Implementing Business Rules in SAP SuccessFactors」（2611 版）
 //         15 章 Functions By Groups ／ 16 章 Functions A-Z。ref は 16 章の節番号
 //         ローカルの写し：docs/sap/SF_PLT_Implementing_Business_Rules_2611.pdf
 //   ここには、モジュールや機能に依存しない汎用の関数を載せている。Time Off・Payroll・Position Management などの
 //   モジュール固有の関数や Execute 用の関数が必要なときは、同じ出典から名前と引数を確認して追加すること
 //   バリデーターは、ここにない関数と、引数の数・型の誤りをエラーにする
 //   params の型：date / datetime / number（小数）/ int（整数）/ string / boolean / picklist / object / any / collection（1:n の項目）
 //   末尾に ? を付けると省略可能、... を付けると可変長（0 個以上）
 //   intIfIntArgs … 数値の引数がすべて整数なら結果も整数。roundInt … 精度（第 2 引数）が省略・0 以下なら結果は整数
 functions: {
  // 数学関数
  'Add':              {ref: '16.1',   params: ['number', 'number'], ret: 'number', intIfIntArgs: true, desc: '2 つの値を足す（First, Second）'},
  'Minus':            {ref: '16.165', params: ['number', 'number'], ret: 'number', intIfIntArgs: true, desc: '第 1 の値から第 2 の値を引く（First Value, Second Value）'},
  'Multiply':         {ref: '16.168', params: ['number', 'number'], ret: 'number', intIfIntArgs: true, desc: '値に係数を掛ける（Value, Factor）'},
  'Divide':           {ref: '16.40',  params: ['number', 'number'], ret: 'number', desc: '値を割る（Dividend, Divisor）。除数が 0 のときルールは FAIL で止まる'},
  'Round':            {ref: '16.175', params: ['number', 'int?', 'number?'], ret: 'number', roundInt: true, desc: '値を丸める（Value, Precision, Threshold）。Precision は小数の桁数（負の数は整数部の桁、省略時は 0）、Threshold は切り上げの閾値（省略時は 0.5 など）'},
  'Maximum':          {ref: '16.163', params: ['number', 'number', 'number...'], ret: 'number', intIfIntArgs: true, desc: '2 つ以上の値の最大値'},
  'Minimum':          {ref: '16.164', params: ['number', 'number', 'number...'], ret: 'number', intIfIntArgs: true, desc: '2 つ以上の値の最小値'},
  'Treat Null As':    {ref: '16.183', params: ['number', 'number?'], ret: 'number', intIfIntArgs: true, desc: '数値の項目が空（null）のとき、指定した値（通常は 0）として扱う（Number, Treated as Number）'},
  // 文字列関数
  'To Number':        {ref: '16.181', params: ['string'], ret: 'number', desc: '数字の文字列を数値にする（小数点を含んでもよく、先頭の 0 は無視）。数字以外の文字があるとルールが止まる'},
  'Format Number':    {ref: '16.43',  params: ['string', 'int'], ret: 'string', desc: 'Java の書式 %d を含むテンプレートで数値を文字列にする（Template, Number）。例："POS%05d"。小数は使えない'},
  'Format':           {ref: '16.41',  params: ['string', 'any...'], ret: 'string', desc: 'Java の書式（%s、日付は %t、小数は %f）を含むテンプレートで値を組み合わせて文字列にする（Template, Argument...）。例：日付を YYYYMMDD にするには "%1$tY%1$tm%1$td"'},
  'Concatenate':      {ref: '16.21',  params: ['string', 'string', 'string...'], ret: 'string', desc: '2 つ以上の文字列をつなげる。null の部分は無視される'},
  'Substring':        {ref: '16.176', params: ['string', 'int', 'int?'], ret: 'string', desc: '文字列の一部を返す（text, start, length）。位置は 1 から数える'},
  'Length':           {ref: '16.158', params: ['string'], ret: 'int', desc: '文字列の長さ'},
  'Index Of':         {ref: '16.147', params: ['string', 'string', 'int?'], ret: 'int', desc: '文字列の中で、検索文字列が最初に現れる位置（text, searchText, startIndex）。位置は 1 から数え、見つからなければ null'},
  'Replace':          {ref: '16.174', params: ['string', 'string', 'string?'], ret: 'string', desc: 'パターン（文字列または Java の正規表現）に一致する部分を置き換える（Text, Pattern, Replacement）'},
  'Trim':             {ref: '16.190', params: ['string', 'any?'], ret: 'string', desc: '文字列の前後の空白を取り除く（Text, Trim Mode）'},
  'Condense':         {ref: '16.22',  params: ['string', 'any?'], ret: 'string', desc: '連続する空白を 1 つにする、またはすべて取り除く（Text, Condense Mode）'},
  'To Lowercase':     {ref: '16.180', params: ['string', 'any?'], ret: 'string', desc: '小文字にする（text, Locale）'},
  'To Uppercase':     {ref: '16.182', params: ['string', 'any?'], ret: 'string', desc: '大文字にする（Text, Locale）'},
  'Is Empty':         {ref: '16.152', params: ['string'], ret: 'boolean', desc: 'テキストの項目が空（null または空白だけ）なら true'},
  'Get Picklist Value Label': {ref: '16.120', params: ['picklist'], ret: 'string', desc: '選択肢の項目の値のラベルを、ログインユーザーの言語で返す'},
  // 日付・時刻の関数
  'Today':            {ref: '16.179', params: [], ret: 'date', desc: 'テナントの優先タイムゾーンでの当日の日付'},
  'Get Current DateTime': {ref: '16.68', params: [], ret: 'datetime', desc: 'サーバーの現在の日時'},
  'Get Local Date of DateTime': {ref: '16.87', params: ['datetime', 'number?'], ret: 'date', desc: 'UTC の日時を、指定した時差（時間）のローカルの日付にする（DateTime, Offset of Local Time Zone from UTC in Hours）。例：日本時間なら 9'},
  'Date Plus':        {ref: '16.33',  params: ['date', 'int?', 'int?'], ret: 'date', desc: '日付に月数と日数を加算・減算する（Base Date, Number of Months, Number of Days）。年は 12 か月として月数で指定する'},
  'Create Date':      {ref: '16.29',  params: ['number', 'number', 'number'], ret: 'date', desc: '日・月・年から日付を作る（Day, Month, Year）'},
  'Year Of Date':     {ref: '16.196', params: ['date'], ret: 'int', desc: '日付の年（例：2021）'},
  'Month of Year':    {ref: '16.167', params: ['date'], ret: 'int', desc: '日付の月（1〜12）'},
  'Day Of Month':     {ref: '16.34',  params: ['date'], ret: 'int', desc: '日付の日（1〜31）'},
  'Day Of Week':      {ref: '16.35',  params: ['date'], ret: 'int', desc: '曜日の番号（1＝月曜 … 7＝日曜）'},
  'Get First Day Of Month': {ref: '16.76', params: ['date'], ret: 'date', desc: '同じ月の 1 日'},
  'Latest Date':      {ref: '16.157', params: ['date', 'date'], ret: 'date', desc: '2 つの日付のうち遅いほう'},
  'Difference In Calendar Years': {ref: '16.36', params: ['date', 'date'], ret: 'int', desc: '2 つの日付の年の差（暦年だけで計算し、月日は考えない）'},
  'Difference In Years Round Down': {ref: '16.37', params: ['date', 'date'], ret: 'int', desc: '2 つの日付の差を年で求め、切り捨てる（満年数。年齢・勤続年数の計算に使う）'},
  'Difference In Years Round Up': {ref: '16.38', params: ['date', 'date'], ret: 'int', desc: '2 つの日付の差を年で求め、切り上げる'},
  'Get Number Of Calendar Days': {ref: '16.103', params: ['date', 'date'], ret: 'int', desc: '開始日から終了日までの暦日数（両端を含む）'},
  'Get Number Of Months From Start Date Until End Date': {ref: '16.109', params: ['date', 'date'], ret: 'int', desc: '2 つの日付の間の月数（終了日は含まない）'},
  // 集合・その他
  'Cardinality':      {ref: '16.18',  params: ['collection'], ret: 'int', desc: '1:n でたどれる項目（集合）の件数'},
  'Sum of Collection Field Values': {ref: '16.177', params: ['collection'], ret: 'number', desc: '集合（MDF の子オブジェクトなど）の数値項目の合計'},
  'Lookup':           {ref: '16.160', params: ['string', 'string', 'string', 'any'], ret: 'any', desc: 'ルックアップ表（MDF オブジェクト）から値を引く。公式の入力（Base object、Output field、条件）を、この JSON では（オブジェクトID、返す項目ID、条件の項目ID、条件の値）で書く'},
  'Login User':       {ref: '16.159', params: [], ret: 'string', desc: 'ログインしているユーザーのユーザーID'}
 },

 // 概念辞書：要件の言葉を、テナントのデータに結びつける
 // aliases のいずれかが要件に含まれると、その概念と refs の項目がプロンプトに入る
 concepts: [
  {name: '昇格', aliases: ['昇格', '昇進', '升格', 'promotion'], kind: 'derived',
   refs: ['EmpJob.eventReason', 'EmpJob.payGrade', 'EmpJob.customDate1', 'cust_PromotionHistory.effectiveStartDate'],
   hint: 'イベント事由が昇格系（event PRM）かで判定する。PRM_TTL 役職昇進は等級が変わらない。PRM_OLD は無効。昇格日の専用項目はなく、近いのは EmpJob.customDate1（最終等級変更日）'},
  {name: '発令日', aliases: ['発令日', '発令時', '有効日', 'effective date'], kind: 'direct',
   refs: ['EmpJob.startDate'], hint: '職務情報の発令日は EmpJob.startDate'},
  {name: '入社の発令', aliases: ['入社の発令', '入社時', '入社した', '雇い入れ', '雇入れ時', '採用した'], kind: 'direct',
   refs: ['EmpJob.event', 'EmpJob.eventReason'], hint: 'event = H（入社）。事由は HIRNEW 新卒入社、HIRMID 中途入社、HIRGRP グループ転籍入社'},
  {name: '入社日', aliases: ['入社日', '入社年月日', '雇入れ日', '採用日', 'hire date'], kind: 'similar',
   refs: ['EmpEmployment.startDate', 'EmpEmployment.originalStartDate', 'EmpEmployment.customDate1', 'EmpEmployment.customDate3'],
   hint: '候補が複数ある。通常は EmpEmployment.startDate（雇入れ日）。再雇用前を含むなら originalStartDate、グループ入社なら customDate1。customDate3 は入社「予定」日で別物。社員プロファイルの入社日は文字列'},
  {name: '有期雇用', aliases: ['有期', '無期', '契約期間', '雇用期間の定め'], kind: 'direct',
   refs: ['EmpJob.contractType', 'EmpJob.employeeClass'],
   hint: '有期・無期は EmpJob.contractType（FIXED 有期、PERM 無期）で判断する。社員区分（employeeClass）の「契約社員」とは一致しないことがある。雇用形態（employmentType）はフルタイム／パートの区分で無関係'},
  {name: '契約満了', aliases: ['雇止め', '契約満了', '契約終了', '契約期限'], kind: 'direct',
   refs: ['EmpJob.contractEndDate', 'EmpJob.customDate5'],
   hint: '有期契約が終わる日は EmpJob.contractEndDate。customDate5 は契約を「更新した日」で別物。資格の有効期限（cust_expiryDate）や退職日とも違う'},
  {name: '組織の長', aliases: ['組織の長', '所属長', '部署長', '部門長', '本部長', '事業部長'], kind: 'similar',
   refs: ['FODepartment.headOfUnit', 'FODivision.headOfUnit', 'FOBusinessUnit.headOfUnit', 'EmpJob.department'],
   hint: '所属部署の長は EmpJob.department をたどった FODepartment.headOfUnit（User）。事業部長は FODivision、事業本部長は FOBusinessUnit。役職 picklist の「本部長」（JP_Position EXE）は役職名で、人を指す項目ではない'},
  {name: '資格取得日', aliases: ['資格取得日', '取得日'], kind: 'similar',
   refs: ['cust_Qualification.cust_acquiredDate', 'EmpEmployment.customDate4'],
   hint: '免許・検定の取得日は cust_Qualification.cust_acquiredDate。EmpEmployment.customDate4 はラベルが同じ「資格取得日」だが雇用保険の資格取得日で別物'},
  {name: '移行データ', aliases: ['移行', '旧システム', '社員プロファイル', '旧人事'], kind: 'derived',
   refs: ['cust_EmployeeProfile.cust_hireDate', 'cust_EmployeeProfile.cust_hireYear', 'cust_EmployeeProfile.cust_employeeNo', 'cust_EmployeeProfile.cust_retirementAge', 'cust_EmployeeProfile.cust_serviceYears', 'cust_EmployeeProfile.cust_lastPromotionDate'],
   hint: '社員プロファイル（cust_EmployeeProfile）は現行の項目と同じ名前・意味だが型が違う：入社日・入社年度・定年年齢は文字列、社員番号は整数、勤続年数は小数、最終等級変更日は日時。比較・代入では公式の関数で型を合わせる：文字列 → 数値は To Number（整数にするなら Round）、数値 → 文字列は Format Number、文字列 YYYYMMDD → 日付は Substring と To Number で日・月・年を取り出して Create Date、日付 → 文字列は Format（"%1$tY%1$tm%1$td"）、日時 → 日付は Get Local Date of DateTime。雇用情報へは externalCode（User）→ empInfo でたどれる'},
  {name: '退職', aliases: ['退職', '離職'], kind: 'direct',
   refs: ['EmpEmploymentTermination.endDate', 'EmpEmploymentTermination.eventReason', 'EmpJob.event'],
   hint: 'event = 26（退職）。退職日は退職情報 EmpEmploymentTermination.endDate で入力し、EmpEmployment.endDate は読み取り専用'},
  {name: '等級', aliases: ['等級', 'グレード', 'pay grade'], kind: 'direct',
   refs: ['EmpJob.payGrade', 'FOPayGrade.paygradeLevel'], hint: '等級は EmpJob.payGrade（Foundation Object：FOPayGrade）。比較は {"object":"FOPayGrade","codes":[...]}。等級の高低は FOPayGrade.paygradeLevel（数値）で比較できる'},
  {name: '部署', aliases: ['部署', '部門', '所属'], kind: 'direct',
   refs: ['EmpJob.department', 'FODepartment.headOfUnit'], hint: '部署は EmpJob.department（Foundation Object：FODepartment）。部署長は FODepartment.headOfUnit（User）'},
  {name: '勤務地', aliases: ['勤務地', '事業所', '本社', '支社'], kind: 'direct',
   refs: ['EmpJob.location'], hint: '勤務地は EmpJob.location（Foundation Object：FOLocation）'},
  {name: '上長', aliases: ['上長', '上司', 'マネージャー'], kind: 'direct',
   refs: ['EmpJob.managerId'], hint: '直属の上司は EmpJob.managerId（User）。比較は {"object":"User","codes":["ユーザーID"]}。マトリクス上長・メンターは EmpJobRelationships.relUserId、User.manager は読み取り専用の写し'},
  {name: '役職', aliases: ['役職', 'ポスト', '管理職'], kind: 'direct',
   refs: ['EmpJob.customString3'], hint: '役職は EmpJob.customString3（picklist JP_Position）'},
  {name: '課長以上', aliases: ['課長以上'], kind: 'derived',
   refs: ['EmpJob.customString3'], hint: 'JP_Position の MGR 課長、SMGR 部長、EXE 本部長。DMGR 課長代理は含まない。picklist には序列がないので列挙する'},
  {name: '裁量労働', aliases: ['裁量労働', 'みなし労働'], kind: 'direct',
   refs: ['EmpJob.customBoolean1'], hint: '裁量労働対象は EmpJob.customBoolean1（はい/いいえ）'},
  {name: '試用期間', aliases: ['試用期間', '試用'], kind: 'direct',
   refs: ['EmpJob.probationPeriodEndDate'], hint: '試用期間終了日は EmpJob.probationPeriodEndDate'},
  {name: '出向', aliases: ['出向'], kind: 'direct',
   refs: ['EmpJob.customDate3', 'EmpJob.customDate4', 'EmpJob.eventReason'], hint: '出向の事由は TRN_SEC、出向復帰は TRN_RTN。出向開始日は EmpJob.customDate3、終了予定日は customDate4'},
  {name: '定年', aliases: ['定年'], kind: 'derived',
   refs: ['EmpEmployment.customDate2', 'EmpEmployment.customLong1', 'PerPerson.dateOfBirth'], hint: '定年到達日は EmpEmployment.customDate2、定年年齢は customLong1。生年月日は PerPerson.dateOfBirth'},
  {name: '資格', aliases: ['資格'], kind: 'direct',
   refs: ['cust_Qualification.cust_qualification', 'cust_Qualification.cust_acquiredDate', 'cust_Qualification.cust_allowanceEligible', 'cust_Qualification.cust_allowanceAmount', 'cust_QualificationMaster.cust_allowanceAmount'],
   hint: '保有資格はカスタム MDF cust_Qualification。資格そのものは Generic Object 項目 cust_qualification で cust_QualificationMaster を参照し、手当額はマスタの cust_allowanceAmount'},
  {name: 'テレワーク', aliases: ['テレワーク', '在宅勤務', 'リモート'], kind: 'direct',
   refs: ['EmpJob.customBoolean2', 'EmpPayCompRecurring.payComponent'], hint: 'テレワーク対象は EmpJob.customBoolean2。在宅勤務手当は報酬項目 ALW_REMOTE（EmpPayCompRecurring、職務情報からクロスエンティティで設定できる）'}
 ],

 // 知識カード：設計の定石と注意点。すべてプロンプトに入る
 cards: [
  {title: 'onChange と onSave の使い分け',
   body: 'onChange は画面上の項目変更時に実行され、結果をその場で表示できる。トリガー項目（trigger_field）を指定する。インポートや API 経由の更新では実行されないことがあるため、確実に値を設定したい場合は onSave にも設定する。'},
  {title: '選択肢での範囲指定',
   body: 'picklist の値には大小の序列がないため、「課長以上」のような条件は値を列挙して「次のいずれか（in）」で指定する。eq / ne には値を 1 つだけ書く。'},
  {title: 'イベント事由での判定',
   body: '人事イベントの種類はイベント事由で判定するのが一般的。事由はそれぞれ 1 つのイベントに属するので、event と事由を同時に条件にするときは組み合わせを合わせる。無効（status I）の事由は使わない。'},
  {title: 'Foundation Object / Generic Object / User の比較',
   body: '部署・勤務地・等級などの Foundation Object、Position や MDF などの Generic Object、上長などの User の項目は、{"object":"オブジェクトID","codes":["externalCode"]} で比較する。文字列の定数では比較しない。'},
  {title: '型の違う項目の比較と代入',
   body: '同じ名前・同じ意味の項目でも、オブジェクトによってデータ型が違うことがある（例：入社日が文字列、社員番号が整数）。比較の両辺と、設定先と値の型は、公式の関数で必ず揃える：To Number（文字列 → 数値）、Format Number（整数 → 文字列）、Format（日付などを書式付きの文字列に）、Substring + To Number + Create Date（文字列 → 日付）、Get Local Date of DateTime（日時 → 日付）、Year Of Date（日付 → 年）。整数の項目に小数になりうる値（To Number や Divide の結果、小数の項目）を入れるときは Round（精度 0）で整数にする。関数表にない関数は作らない。'},
  {title: '日付の計算',
   body: '日付は関数を入れ子にして計算する。日付の加算・減算は Date Plus（基準日, 月数, 日数）を使う。例：Date Plus(発令日, 6, -1) は「6か月後の前日」、1 年後は月数 12。定数の日付は "YYYY-MM-DD"。'},
  {title: 'base object からアクセスできる範囲',
   body: 'ルールで使える項目は、base object と、参照項目・アソシエーションでたどれるオブジェクトの項目に限られる。1:n でつながるオブジェクトの項目は集合になるため、where（集合フィルター）で使うレコードを 1 件に絞るか、Cardinality（件数）や Sum of Collection Field Values（合計）で使う。集合フィルターで 1 件に絞れないと、最初の 1 件だけが使われる（どれが最初かは決められない）。'},
  {title: '書き込みできる項目',
   body: '値を設定できるのは base object の項目と、クロスエンティティで許可されたオブジェクトの項目だけ。Foundation Object の項目は、その Foundation Object 自身を base object にしたルールでだけ設定できる。読み取り専用の項目（キー、自動採番、システム項目、在籍ステータスなど）は設定できない。必須の項目を空欄にしない。'},
  {title: '自動設定による上書き',
   body: '値を自動設定すると、手動で入力した値も上書きされる。例外がありうる場合は ELSE を使わない、または「空のときだけ設定」の条件を加える。onChange のトリガー項目そのものを設定すると、ルールが繰り返し実行される恐れがある。'}
 ]
};
