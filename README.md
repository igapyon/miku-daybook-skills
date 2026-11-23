# miku-daybook-skills

daybook は、**人とAIが、日をまたぎ、作業場所をまたいで使える仕事帳**です。
`igapyon-miku-daybook` は、その仕事帳を Markdown でつけるための Agent Skill です。
何かを発見したとき、方針を決めたとき、作業を中断するときに、AIが試したことや判断の理由を記録します。

## 昨日の気づきから、今日の仕事を始める

たとえば「同じデータを読み込んだのに、一覧の並び順が変わった」と気づいたら、そのときの入力と結果を `activity` に残せます。
翌日、別の会話で「昨日の並び順の件、もう少し調べよう」と頼めば、その記録を手がかりに調査を再開できます。

その場で片づく仕事は `activity` 一件で完結します。あとで確かめることは `todo` に、修正の完了まで追いたい仕事は `task` にできます。
調査をもとに一覧の並び順を仕様として決めたら、その仕様は `topic` にまとめます。
現在の仕様は `topic` で確認でき、そこから元の `activity` をたどれば、当時どの案を試し、なぜその順番を選んだかも分かります。

「今日は何から始めよう」とAIに相談することもできます。`task` と日付のある予定（`schedule`）から作る `day-plan` には、今日の作業や予定、日程が仮の作業候補、Backlog が表示されます。
AIはそれらと未完了の `todo` を見て、最初の一歩を提案します。

## daybook を開いたまま、別のリポジトリで作業する

調査や修正は対象のリポジトリで進め、その経緯は daybook に残せます。
たとえば別のリポジトリで並び順を修正したあとに `miku-scm git add commit` を頼むと、AIは作業の文脈から修正先を選び、対象のパスとブランチを示してからコミットします。
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
