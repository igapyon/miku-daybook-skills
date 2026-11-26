# miku-daybook-skills

daybook は、**人とAIが、日をまたぎ、作業場所をまたいで使える仕事帳**です。
`igapyon-miku-daybook` は、その仕事帳を Markdown でつけるための Agent Skill です。
何かを発見したとき、方針を決めたとき、作業を中断するときに、AIが試したことや判断の理由を記録します。

## 昨日の気づきから、今日の仕事を始める

たとえば「同じデータを読み込んだのに、一覧の並び順が変わった」と気づいたら、そのときの入力と結果を `activity` に残せます。
中断するときは、「現象は再現できました。原因はまだ分かっていません。次は並べ替え前の入力を比較します」と、ここまでの結果と次の一手を記録します。
翌日、別の会話で「昨日の並び順の件、もう少し調べよう」と頼めば、その記録を手がかりに調査を再開できます。
日付や件名を思い出せないときは「前回どこまで？」と聞けます。AIは記録のある最新日から必要な範囲をたどり、作業の到達点と次の一手を根拠となる記録とともに示します。

その場で片づく仕事は `activity` 一件で完結します。あとで確かめることは `todo` に、修正の完了まで追いたい仕事は `task` にできます。
調査をもとに一覧の並び順を仕様として決めたら、その仕様は `topic` にまとめます。
現在の仕様は `topic` で確認できます。どの案を試し、なぜその順番を選んだかは、元の `activity` に残ります。

「今日は何から始めよう」とAIに相談することもできます。`task` と日付のある予定（`schedule`）から作る `day-plan` には、今日の作業や予定、日程が仮の作業候補、Backlog が表示されます。
AIはそれらと未完了の `todo` を見て、最初の一歩を提案します。

## project root と daybook root

daybook を使う最初の操作で、`launch root` の名前から `project root` と `daybook root` を決めます。

- `launch root` は、起動した場所を含む Git リポジトリのルートです。Git 管理外では、開いている作業ルートを使います。
- `project root` は、調査や修正などの作業を行うルートです。
- `daybook root` は、`activity` や `task` などの主な記録を保存するルートです。

| `launch root` | 同じ親ディレクトリにあるもの | `project root` | `daybook root` |
| --- | --- | --- | --- |
| `daybook` | — | 起動した `daybook` | 起動した `daybook` |
| `ProjectName-daybook` | `ProjectName` | `ProjectName` | `ProjectName-daybook` |
| `ProjectName` | `ProjectName-daybook` | `ProjectName` | `ProjectName-daybook` |
| `ProjectName` | `daybook` があり、`ProjectName-daybook` がない | `ProjectName` | `daybook` |

利用者が `project root` や `daybook root` を指定した場合は、その指定を優先します。今回の作業で確認済みの `daybook root` があれば、引き続き使います。
`daybook root` を特定できない場合は、書き込む前に確認します。

`attachments/` と `topics/` は、それぞれ上から順に判定し、最初に該当した場所を使います。

1. 利用者の指定があれば、その指定を優先します。
2. 指定がなければ、`project root` の直下にすでにある同名ディレクトリを使います。
3. 利用者の指定がなく、`project root` の直下に同名ディレクトリもなければ、`daybook root` 側を使います。

たとえば `project root` に `topics/` だけがある場合、topic はそこで読み書きし、添付資料には `daybook root/attachments/` を使います。リンクやパスで指定された既存ファイルは、保存済みの場所で扱います。

`project root` と `daybook root` が別ディレクトリの場合は、参照を `daybook root` 側に置きます。たとえば `project root` の topic を activity と結び付ける場合は、activity から topic を参照します。`project root` 側の Markdown やその他のファイルには、daybook のリンク、パス、再開先などの参照を加えません。

複数のプロジェクトで `daybook root` を共有するときも、activity に作業先の `project root` を記録します。プロジェクトから「前回どこまで？」と聞けば、その作業先の記録をたどります。

Git 管理外の `daybook root` では、task ID を作成前に `task-ids/` に予約します。task 本体を削除したあとも予約を残します。

## daybook を開いたまま、別のリポジトリで作業する

調査や修正は対象のリポジトリで進め、その経緯は daybook に残せます。
たとえば別のリポジトリで並び順を修正したあとに `miku-scm git add commit` を頼むと、AIは作業の文脈から修正先を選び、対象のパスとブランチを示してからコミットします。
`miku-scm draft recommit` を続けて頼むと、同じ作業先の差分から PR 文面を作り、その文面でローカルのコミットをまとめ直します。
次の会話でも、daybook の記録から作業先と調査の続きをたどれます。

## 導入

[GitHub Releases](https://github.com/igapyon/miku-daybook-skills/releases) で配布ZIPを取得して展開し、
`skills/igapyon-miku-daybook/` ディレクトリ全体を
`~/.codex/skills/` など、利用するエージェントのスキル配置先にコピーします。
ソースから使う場合も同じディレクトリをコピーします。CLIは Node.js と
同梱ファイルで動作します。miku-scm で Git 操作を行う場合や GitHub Issue を取り込む場合は、`igapyon-miku-scm` スキルも導入してください。

使い方と各操作の前提は [SKILL.md](skills/igapyon-miku-daybook/SKILL.md) を参照してください。
作業記録は利用する daybook のディレクトリに保存します。

## 開発

検査、YAML runtime の再生成、配布ZIPの作成は、上流の [開発手順](https://github.com/igapyon/miku-daybook-skills/blob/devel/DEVELOPMENT.md) を参照してください。

ライセンスは [Apache-2.0](LICENSE) です。同梱 YAML runtime には
[ISC ライセンス](skills/igapyon-miku-daybook/assets/daybook/scripts/vendor/yaml.LICENSE) が適用されます。

## このリポジトリに daybook の記録を作らない

このリポジトリは `igapyon-miku-daybook` スキルのソースと配布物を管理する場所であり、daybook の記録先ではありません。
`activity`、`task`、`todo`、`topic` などの日々の記録は、別の daybook データリポジトリに保存してください。
ソースと記録を混在させると管理対象が分かりにくくなるため、このリポジトリには daybook の記録を作らないでください。
