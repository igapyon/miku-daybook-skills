# 開発手順

スキルの正本は `skills/igapyon-miku-daybook/` です。初版は `igapyon-agent-skills`
の `606b1c2593435a6910a8b42fe62066c0d3af4663` から取り込みました。

## 検査

`npm test` で同梱CLIのテストと、Node.jsと同梱ファイルだけで動くことの検査を実行します。
開発用依存は、YAML runtime の再生成と互換性検査で使います。

```sh
npm ci
npm run check:daybook-yaml-runtime
npm run test:daybook-yaml-compatibility
```

固定したYAML実装を更新したときは、`npm run build:daybook-yaml-runtime` で
runtimeとライセンスを再生成し、差分を確認します。

## 版数と配布

`package.json` の版をSemVerで管理し、`package-lock.json` と揃えます。
版数の変更には `npm version <version> --no-git-tag-version` を使えます。
リリースタグは `v<version>` です。

GitHubでReleaseを公開すると、`Build and Upload Daybook ZIP` がタグのソースから
ZIPを作り、展開してCLIを検査してからReleaseに添付します。公開済みReleaseに
ZIPを追加する場合は、既定ブランチ `devel` の Actions でこのWorkflowを選び、
`Run workflow` の `tag_name` に既存タグ（例 `v0.1.0`）を入力します。

`npm run build:bundle:zip` は、システムの `zip` を使って
`bundle/igapyon-miku-daybook-skills-<version>.zip` を生成します。
検査するときは別のディレクトリへ展開し、
`node scripts/check-daybook-runtime.mjs <展開先>/skills/igapyon-miku-daybook/assets/daybook`
を実行します。親リポジトリは、このリポジトリの `devel` にあるコミットを
SHAで固定して、同じスキルディレクトリを取得します。
