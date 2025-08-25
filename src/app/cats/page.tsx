// src/app/cats/page.tsx
"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

// ---- 型 ----
type PoopLog = { id: number; date: string; score: number | null; note: string | null };

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
  poopLogs: PoopLog[];
};

// 英語→日本語マップ
const genderMap: Record<string, string> = { male: "オス", female: "メス", unknown: "不明" };
const furTypeMap: Record<string, string> = { short: "短毛", long: "長毛", hairless: "無毛" };
const sizeMap: Record<string, string> = { small: "小型", medium: "中型", large: "大型" };
const lifeStageMap: Record<string, string> = { kitten: "子猫", adult: "成猫", senior: "シニア" };

export default function CatsPage() {
  const [cats, setCats] = useState<Cat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [banner, setBanner] = useState<string | null>(null);

  const params = useSearchParams();
  const bannerFromQuery = useMemo(() => {
    if (params.get("updated") === "1") return "更新しました。";
    if (params.get("created") === "1") return "登録しました。";
    if (params.get("deleted") === "1") return "削除しました。";
    return null;
  }, [params]);

  // 初回ロード
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/cats");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        setCats(await res.json());
      } catch (e: any) {
        setError(e.message ?? "fetch error");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // クエリ由来のバナー
  useEffect(() => {
    if (!bannerFromQuery) return;
    setBanner(bannerFromQuery);
    const t = setTimeout(() => setBanner(null), 3000);
    return () => clearTimeout(t);
  }, [bannerFromQuery]);

  // 削除処理（一覧から直接）
  const onDelete = async (id: number) => {
    if (!confirm("本当に削除しますか？")) return;
    const res = await fetch(`/api/cats/${id}`, { method: "DELETE" });
    if (res.ok) {
      setCats((prev) => prev.filter((c) => c.id !== id)); // 楽観的更新
      setBanner("削除しました。");
      setTimeout(() => setBanner(null), 3000);
    } else {
      const err = await res.json().catch(() => ({}));
      alert(`削除に失敗しました: ${err.error ?? res.status}`);
    }
  };

  if (loading) return <div className="p-6">読み込み中…</div>;
  if (error) return <div className="p-6 text-red-500">エラー: {error}</div>;

  return (
    <main className="p-6 space-y-4">
      <h1 className="text-xl font-bold">猫一覧</h1>

      {banner && <p className="text-green-500">{banner}</p>}

      {cats.length === 0 ? (
        <p>まだ登録がありません。</p>
      ) : (
        <ul className="space-y-3">
          {cats.map((c) => {
            const allergies = c.allergies?.split(",").map(s => s.trim()).filter(Boolean) ?? [];
            return (
              <li key={c.id} className="border rounded-lg p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="font-semibold text-lg">{c.name}</div>
                  <div className="flex gap-2">
                    <Link
                      href={`/cats/${c.id}/edit`}
                      className="px-3 py-1 rounded bg-indigo-600 text-white text-sm hover:opacity-90"
                    >
                      編集
                    </Link>
                    <button
                      onClick={() => onDelete(c.id)}
                      className="px-3 py-1 rounded bg-rose-600 text-white text-sm hover:opacity-90"
                    >
                      削除
                    </button>
                  </div>
                </div>

                <div className="text-sm text-gray-300">
                  年齢: {c.age}歳 / 体重: {c.weight ?? "-"}kg / 性別: {c.gender ? genderMap[c.gender] : "-"}
                </div>

                <div className="text-xs text-gray-400">
                  活動量: {c.activityLevel ?? "-"} ／ 毛: {c.furType ? furTypeMap[c.furType] : "-"} ／
                  サイズ: {c.size ? sizeMap[c.size] : "-"} ／ ステージ: {c.lifeStage ? lifeStageMap[c.lifeStage] : "-"} ／
                  去勢/避妊: {c.neutered === null ? "-" : c.neutered ? "済" : "未"}
                </div>

                {allergies.length > 0 && (
                  <div className="text-xs mt-1 flex flex-wrap gap-1">
                    <span className="text-gray-400">アレルギー:</span>
                    {allergies.map((a, i) => (
                      <span key={i} className="px-2 py-0.5 rounded bg-rose-800/40 border border-rose-700">
                        {a}
                      </span>
                    ))}
                  </div>
                )}

                {c.poopLogs?.length ? (
                  <div className="text-xs text-gray-400 mt-1">
                    うんちログ: {c.poopLogs.length} 件（最新 {new Date(c.poopLogs[0].date).toLocaleDateString()}）
                  </div>
                ) : (
                  <div className="text-xs text-gray-400 mt-1">うんちログ: 0 件</div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
}
