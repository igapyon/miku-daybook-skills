# miku-daybook-skills

`igapyon-miku-daybook` は、AIとの作業を Markdown に残し、後から再開するための Agent Skill です。
作業経緯を activity に記録し、あとで行うことを todo、進行中の仕事を task、
再利用する知識や方針を topic にまとめます。task と schedule から日ごとの day-plan を生成できます。

## 導入

[GitHub Releases](https://github.com/igapyon/miku-daybook-skills/releases) で配布ZIPを取得して展開し、
`skills/igapyon-miku-daybook/` ディレクトリ全体を
`~/.codex/skills/` など、利用するエージェントのスキル配置先にコピーします。
ソースから使う場合も同じディレクトリをコピーします。CLIは Node.js と
同梱ファイルで動作します。GitHub Issue を取り込む場合は、対応する `igapyon-miku-scm`
スキルも導入してください。

使い方と各操作の前提は [SKILL.md](skills/igapyon-miku-daybook/SKILL.md) を参照してください。
作業記録は利用する daybook のディレクトリに保存します。

## 開発

検査、YAML runtime の再生成、配布ZIPの作成は、上流の [開発手順](https://github.com/igapyon/miku-daybook-skills/blob/devel/DEVELOPMENT.md) を参照してください。

ライセンスは [Apache-2.0](LICENSE) です。同梱 YAML runtime には
[ISC ライセンス](skills/igapyon-miku-daybook/assets/daybook/scripts/vendor/yaml.LICENSE) が適用されます。
