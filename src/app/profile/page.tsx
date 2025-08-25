'use client'; // Next.js App Routerで「クライアントコンポーネント」として動作させる宣言
import { useState } from 'react';

export default function ProfilePage() {
  // ---- 入力フォームの状態を管理 ----
  // 各フィールドの初期値を定義して useState に入れている
  const [form, setForm] = useState({
    name: '', age: '', weight: '', gender: 'unknown',
    allergies: '', activityLevel: '', furType: '', size: '', lifeStage: '', neutered: false,
  });
  // 成功やエラーを表示するメッセージ
  const [msg, setMsg] = useState<string | null>(null);

  // ---- 入力値変更時の処理 ----
  // input / select の値を state に反映させる
  const onChange = (e: React.ChangeEvent<HTMLInputElement|HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target as any;
    // チェックボックスなら true/false、それ以外は value を更新
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  // ---- フォーム送信時の処理 ----
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // ページリロード防止
    setMsg(null);

    // API `/api/cats` にPOSTで登録リクエストを送信
    const res = await fetch('/api/cats', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: form.name,
        age: Number(form.age),
        weight: form.weight ? Number(form.weight) : null,
        gender: form.gender,            // "male" | "female" | "unknown"
        allergies: form.allergies || null,
        activityLevel: form.activityLevel || null,
        furType: form.furType || null,  // "short" | "long" | "hairless"
        size: form.size || null,        // "small" | "medium" | "large"
        lifeStage: form.lifeStage || null, // "kitten" | "adult" | "senior"
        neutered: !!form.neutered,      // true/false
      }),
    });

    // サーバーからのレスポンスを取得
    const json = await res.json();
    // 成功なら「登録OK」、失敗なら「エラー」と表示
    setMsg(res.ok ? `登録OK: id ${json.id}` : `エラー: ${json.error || res.status}`);
  };

  return (
    <main className="max-w-xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">🐱 プロフィール登録</h1>

      {/* ---- 入力フォーム ---- */}
      <form onSubmit={onSubmit} className="space-y-3">
        {/* 名前 */}
        <input name="name" value={form.name} onChange={onChange} placeholder="名前(必須)"
               className="w-full border p-2 rounded" required />

        {/* 年齢 */}
        <input name="age" value={form.age} onChange={onChange} placeholder="年齢(必須・数値)"
               className="w-full border p-2 rounded" required inputMode="numeric" />

        {/* 体重 */}
        <input name="weight" value={form.weight} onChange={onChange} placeholder="体重(kg)"
               className="w-full border p-2 rounded" inputMode="decimal" />

        {/* 性別 */}
        <select name="gender" value={form.gender} onChange={onChange} className="w-full border p-2 rounded">
          <option value="unknown">性別(不明)</option>
          <option value="male">オス</option>
          <option value="female">メス</option>
        </select>

        {/* アレルギー */}
        <input name="allergies" value={form.allergies} onChange={onChange} placeholder="アレルギー（カンマ区切り）"
               className="w-full border p-2 rounded" />

        {/* 活動量 */}
        <input name="activityLevel" value={form.activityLevel} onChange={onChange} placeholder="活動量(low/normal/high)"
               className="w-full border p-2 rounded" />

        {/* 毛のタイプ */}
        <select name="furType" value={form.furType} onChange={onChange} className="w-full border p-2 rounded">
          <option value="">毛の量(未選択)</option>
          <option value="short">短毛</option>
          <option value="long">長毛</option>
          <option value="hairless">無毛</option>
        </select>

        {/* サイズ */}
        <select name="size" value={form.size} onChange={onChange} className="w-full border p-2 rounded">
          <option value="">サイズ(未選択)</option>
          <option value="small">小型</option>
          <option value="medium">中型</option>
          <option value="large">大型</option>
        </select>

        {/* ライフステージ */}
        <select name="lifeStage" value={form.lifeStage} onChange={onChange} className="w-full border p-2 rounded">
          <option value="">ライフステージ</option>
          <option value="kitten">子猫</option>
          <option value="adult">成猫</option>
          <option value="senior">シニア</option>
        </select>

        {/* 去勢/避妊 */}
        <label className="flex items-center gap-2">
          <input type="checkbox" name="neutered" checked={form.neutered} onChange={onChange} />
          避妊・去勢済み
        </label>

        {/* 登録ボタン */}
        <button className="px-4 py-2 rounded bg-purple-600 text-white">登録</button>
      </form>

      {/* 成功/エラーメッセージ */}
      {msg && <p className="text-sm text-gray-700">{msg}</p>}

      {/* 一覧ページへのリンク */}
      <a href="/cats" className="text-purple-600 underline">一覧を見る</a>
    </main>
  );
}
