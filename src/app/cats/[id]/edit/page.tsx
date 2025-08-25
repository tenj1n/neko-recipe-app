// src/app/cats/[id]/edit/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type Cat = {
  id: number;
  name: string;
  age: number;
  weight: number | null;
  gender: string | null;
  allergies: string | null;
  activityLevel: string | null;
  furType: string | null;
  size: string | null;
  lifeStage: string | null;
  neutered: boolean | null;
};

// 入力用のフォーム型（文字列で保持し、送信時に数値へ変換）
type FormState = {
  name: string;
  age: string;
  weight: string;
  gender: string;
  allergies: string;
  activityLevel: string;
  furType: string;
  size: string;
  lifeStage: string;
  neutered: boolean;
};

export default function EditCatPage() {
  const { id } = useParams();
  const router = useRouter();

  const [form, setForm] = useState<FormState>({
    name: "",
    age: "",
    weight: "",
    gender: "",
    allergies: "",
    activityLevel: "",
    furType: "",
    size: "",
    lifeStage: "",
    neutered: false,
  });
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      const res = await fetch(`/api/cats/${id}`);
      if (res.ok) {
        const c: Cat = await res.json();
        setForm({
          name: c.name ?? "",
          age: c.age != null ? String(c.age) : "",
          weight: c.weight != null ? String(c.weight) : "",
          gender: c.gender ?? "",
          allergies: c.allergies ?? "",
          activityLevel: c.activityLevel ?? "",
          furType: c.furType ?? "",
          size: c.size ?? "",
          lifeStage: c.lifeStage ?? "",
          neutered: !!c.neutered,
        });
      } else {
        setMsg("データ読み込み失敗");
      }
      setLoading(false);
    })();
  }, [id]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target as any;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);
    setSaving(true);

    const payload = {
      name: form.name,
      age: form.age ? Number(form.age) : null,
      weight: form.weight ? Number(form.weight) : null,
      gender: form.gender || null,
      allergies: form.allergies || null,
      activityLevel: form.activityLevel || null,
      furType: form.furType || null,
      size: form.size || null,
      lifeStage: form.lifeStage || null,
      neutered: form.neutered,
    };

    const res = await fetch(`/api/cats/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setSaving(false);

    if (res.ok) {
      router.push("/cats?updated=1"); // 一覧へ戻ってバナー表示
    } else {
      const err = await res.json().catch(() => ({}));
      setMsg(`エラー: ${err.error || res.status}`);
    }
  };

  if (loading) return <div className="p-6">読み込み中…</div>;

  return (
    <main className="max-w-xl mx-auto p-6 space-y-4">
      <h1 className="text-xl font-bold">🐱 プロフィール編集</h1>

      <form onSubmit={onSubmit} className="space-y-3">
        <input name="name" value={form.name} onChange={onChange} placeholder="名前"
               className="w-full border p-2 rounded" required />

        <input name="age" value={form.age} onChange={onChange} placeholder="年齢"
               className="w-full border p-2 rounded" inputMode="numeric" />

        <input name="weight" value={form.weight} onChange={onChange} placeholder="体重(kg)"
               className="w-full border p-2 rounded" inputMode="decimal" />

        <select name="gender" value={form.gender} onChange={onChange}
                className="w-full border p-2 rounded">
          <option value="">性別(未選択)</option>
          <option value="male">オス</option>
          <option value="female">メス</option>
          <option value="unknown">不明</option>
        </select>

        <input name="allergies" value={form.allergies} onChange={onChange}
               placeholder="アレルギー（カンマ区切り）" className="w-full border p-2 rounded" />

        <input name="activityLevel" value={form.activityLevel} onChange={onChange}
               placeholder="活動量" className="w-full border p-2 rounded" />

        <select name="furType" value={form.furType} onChange={onChange}
                className="w-full border p-2 rounded">
          <option value="">毛の量(未選択)</option>
          <option value="short">短毛</option>
          <option value="long">長毛</option>
          <option value="hairless">無毛</option>
        </select>

        <select name="size" value={form.size} onChange={onChange}
                className="w-full border p-2 rounded">
          <option value="">サイズ(未選択)</option>
          <option value="small">小型</option>
          <option value="medium">中型</option>
          <option value="large">大型</option>
        </select>

        <select name="lifeStage" value={form.lifeStage} onChange={onChange}
                className="w-full border p-2 rounded">
          <option value="">ライフステージ(未選択)</option>
          <option value="kitten">子猫</option>
          <option value="adult">成猫</option>
          <option value="senior">シニア</option>
        </select>

        <label className="flex items-center gap-2">
          <input type="checkbox" name="neutered" checked={form.neutered} onChange={onChange} />
          避妊・去勢済み
        </label>

        <div className="flex gap-2">
          <button
            disabled={saving}
            className="px-4 py-2 rounded bg-blue-600 text-white disabled:opacity-50"
          >
            {saving ? "保存中…" : "更新"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/cats")}
            className="px-4 py-2 rounded border"
          >
            戻る
          </button>
        </div>
      </form>

      {msg && <p className="text-sm text-red-500">{msg}</p>}
    </main>
  );
}
