# Repository Guidelines

## Project Structure & Module Organization
- `src/app` は App Router でルートごとの `layout.tsx`/`page.tsx` を管理。`deals` や将来的なページはここに追加して、レイアウトとデータフェッチを同じ階層に置きます。
- `src/components` には `yohaku` ディレクトリ下に `base`/`dashboard`/`ui` などの共通 UI を収め、`.reference/mini-crm-kit` のデザインシステムから持ち込んだコンポーネントをここのコピーで調整します。
- `src/lib`（`cn.ts` など）や `src/hooks` に汎用ロジックを集約し、`tailwind.config.ts` と `postcss.config.cjs` が CSS ツールチェーンを定義しています。
- `src/styles` は `globals.css`（Tailwind のベース）と `fullcalendar.css` を含み、`scripts/` は補助的なセットアップやユーティリティスクリプトを格納します。
- ルートには `README.md`, `GEMINI.md`（UX 方針）、`package.json`/`tsconfig.json` などが集中し、`npm install`→`npm run dev` の流れが直感的になるよう維持しています。

## Build, Test, and Development Commands
- `npm run dev`：`localhost:3000`（デフォルト）で Next.js 開発サーバを立ち上げ、ファイル保存でホットリロード。`--hostname` や `--port` を加えて 3001 などに変更。
- `npm run build`：Next.js の本番ビルド。依存の整合性や最適化済み出力を確認するため CI やリリース前に実行。
- `npm run start`：`npm run build` の成果物を本番モードで起動。`NODE_ENV=production` の環境で確認すると配備先に近くなる。
- `npm run lint`：`eslint-config-next` を使って構文チェックと型互換性を検証。新しいファイルを追加したら必ず実行し、`package-lock.json` の更新も忘れずに。

## Coding Style & Naming Conventions
- React コンポーネントやファイルは PascalCase、関数/変数は camelCase を採用。拡張子は `.tsx`（UI）、`.ts`（ロジック）で統一。
- インデントはスペース2つ、行幅 100～120 字程度。Tailwind クラスは `src/lib/cn.ts` の `cn()` で条件付きに結合し、クラス列は `space` などのユーティリティで整理。
- CSS は Tailwind 主導。直接スタイルを書く必要がある場面では `globals.css` にまとめるか既存のユーティリティを再利用。`components/yohaku` 内は `cn()` で変化を制御。
- 型安全性を高めるため、React の props には明示的な `interface`/`type` を付与し、`as const` などでリテラル型を固定。
- 既存コンポーネントは破壊せずに拡張する形で扱い、必要であればラッパーや新しいヘルパーを作る工夫を優先する。

## Testing Guidelines
- 現在ユニット・統合テストは導入されていないため、`npm run lint` を品質ゲートとして扱います。テストを追加する際は `vitest`/`React Testing Library` を検討し、`src/**/__tests__` か `*.test.tsx` で構成。
- データテーブルや Sheet などの UI は、UI テストに代えて `deals` ページをブラウザで確認し、ステータスやアクションが期待通り動作することをチェック。
- テストケースを追加する場合は `describe`/`it` 構造を採用し、fixtures や mocks を `src/tests` に置くことで再利用性を高める。

## Commit & Pull Request Guidelines
- コミットメッセージは Conventional Commits（例 `feat(deals): ステータス pill を追加`）を基本とし、変更の目的が一目で伝わるようにする。
- プルリク時は「何を」「なぜ」「どうやって」を簡潔に記述し、関連 Issue 番号やローカルでの `npm run lint` などの実行結果を添える。UI 変更にはスクリーンショットを付けて視覚的確認を補強。
- `package-lock.json` や `node_modules` の更新を含む変更は一度 `npm install` で再現し、差分を確認のうえコミット。

## Security & Configuration Tips
- `.env.local` に API キーや環境変数を入れ、`.gitignore` で漏れないようにする。Vercel などでは同じ変数名をデプロイ環境に設定。
- 依存アップデートでは `npm run build`/`npm run lint` を通し、`npm audit` の結果に応じて `package-lock.json` を更新。脆弱性がなくなるまで対応する運用を維持する。
