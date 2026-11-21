# SAP の公式ドキュメント（参照用）

このアプリの関数表（`data/knowledge.js` の `functions`）は、次の公式ドキュメントに基づいています。関数を追加・変更するときは、必ずこのドキュメント（または SAP Help Portal の最新版）で名前・引数・戻り値を確認してください。

| ファイル | 内容 | 出典 |
| --- | --- | --- |
| SF_PLT_Implementing_Business_Rules_2611.pdf | Implementing Business Rules in SAP SuccessFactors（2611 版、2H 2026）。全 420 ページ | [SAP Help Portal](https://help.sap.com/doc/8c6720bf5d0b4715ab10fb1b4f69c4f2/2611/en-US/SF_PLT_Implementing_Business_Rules.pdf) |

ルールシナリオ・event・MDF の目的（`data/knowledge.js` の `events`・`scenarios`・`mdfPurposes`・`ecAlwaysRequired`・`crossCreate`）は、次の公式ドキュメントに基づいています。リポジトリには保存していないので、リンク先で確認してください。

| ドキュメント | 主に参照している章 | 出典 |
| --- | --- | --- |
| Implementing Employee Central Core（2611 版、2H 2026） | 7.1 Rule Scenarios for Employee Central Core、7.3 Event Reason Derivation、7.5 Standard and Model Base Objects、7.7 Rule Events、7.8 Common Problems、7.9 Cross-Entity Rules | [SAP Help Portal](https://help.sap.com/doc/cc751d98800d414ca72fc4695a9bf3e7/2611/en-US/SF_EC_Master_Impl.pdf) |
| Implementing the Metadata Framework (MDF)（2611 版、2H 2026） | 4 章の Rule Category、11.1 Configuring Rules for MDF Objects、11.2 Rules for Metadata of MDF Objects、11.3 Supported Purposes for MDF Rule Scenarios、11.4 Order of MDF-Based Rule Execution | [SAP Help Portal](https://help.sap.com/doc/067c84408d824c7382637fc264e11310/2611/en-US/SF_IMP_MDF.pdf) |

上の表の Implementing Business Rules（このフォルダの PDF）では、5.2.1 Actions for Then and Else Statements、5.6 Collection Filters、5.7 Parameters、9 Change of Rule Scenarios、14.2 Common Error Categories も参照しています。

## 主に参照している章

| 章 | ページ | 内容 | アプリで使っている場所 |
| --- | --- | --- | --- |
| 15 Functions By Groups | 92〜108 | 関数の分類（数学・文字列・日付・モジュール固有・Execute・その他） | 関数表に載せる関数の選定 |
| 16 Functions A-Z | 109〜416 | 各関数の説明・入力パラメーター・エラー時の動作 | 関数表の名前・引数・戻り値。各関数の `ref` が 16 章の節番号 |

## 注意

- このファイルは SAP SE の著作物です。社内での参照用に保存しています。リポジトリを公開する場合や GitHub Pages にデプロイする場合は、再配布にあたらないか確認し、必要ならこのファイルを除外して上の URL へのリンクだけにしてください。
- 関数はリリースごとに追加・変更されます。新しいリリースのドキュメントが出たら、このファイルを差し替え、関数表と照らし合わせてください。
