import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-8 p-8 bg-white">
      <h1 className="text-4xl sm:text-5xl font-bold text-purple-600 text-center">
        🐱 ねこレシピへようこそ
      </h1>

      <p className="text-center text-gray-700 max-w-xl">
        猫のプロフィールを登録して、フード情報から不足栄養を解析。
        AIが朝・昼・晩・おやつの献立を提案します。
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-xl">
        <Link
          href="/profile"
          className="rounded-2xl border px-6 py-4 text-center hover:bg-gray-50"
        >
          ① プロフィール登録
          <div className="text-xs text-gray-500">
            体重 / 年齢 / 毛 / 大きさ / 性別 / アレルギー
          </div>
        </Link>
        <Link
          href="/food"
          className="rounded-2xl border px-6 py-4 text-center hover:bg-gray-50"
        >
          ② フード入力
          <div className="text-xs text-gray-500">
            バーコード / 商品名 / 手入力
          </div>
        </Link>
        <Link
          href="/analyze"
          className="rounded-2xl border px-6 py-4 text-center hover:bg-gray-50"
        >
          ③ 栄養解析
          <div className="text-xs text-gray-500">
            RER/MER・不足/過多チェック
          </div>
        </Link>
        <Link
          href="/menu"
          className="rounded-2xl border px-6 py-4 text-center hover:bg-gray-50"
        >
          ④ レシピ提案・献立
          <div className="text-xs text-gray-500">
            朝/昼/晩/おやつ を選択表示
          </div>
        </Link>
      </div>
      <div className="text-sm text-gray-500">v0.1 / MVP プロトタイプ</div>
    </main>
  );
}
