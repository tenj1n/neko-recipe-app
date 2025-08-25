// src/app/api/cats/[id]/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// id の共通バリデーション
function parseId(params: { id: string }) {
  const idNum = Number(params.id);
  if (!Number.isFinite(idNum)) return null;
  return idNum;
}

// GET: 1件取得
export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const id = parseId(params);
  if (id == null) return NextResponse.json({ error: "invalid id" }, { status: 400 });

  const cat = await prisma.catProfile.findUnique({
    where: { id },
    include: { poopLogs: true },
  });

  if (!cat) return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json(cat);
}

// PUT: 更新
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const id = Number(params.id);
  if (Number.isNaN(id)) {
    return NextResponse.json({ error: "invalid id" }, { status: 400 });
  }

  try {
    const body = await req.json();

    // ヘルパー: 入っていなければ undefined を返す（= その項目は更新しない）
    const num = (v: unknown) =>
      v === null || v === undefined || v === "" ? undefined : Number(v);
    const str = (v: unknown) =>
      v === null || v === undefined || v === "" ? undefined : String(v);
    const bool = (v: unknown) =>
      v === null || v === undefined ? undefined : Boolean(v);

    // ここで “入っているものだけ” を詰める
    const data: any = {
      name: str(body.name),
      // age は非NULLカラム：更新したいときだけ number を入れる（null は入れない）
      age: num(body.age),
      // 以下は NULL 許可のカラム。Prisma は null か undefined のどちらも受けるが
      // TS 的に安全なので、来ていない時は undefined にしてプロパティごと省く
      weight: body.weight === null ? null : num(body.weight),
      gender: body.gender === null ? null : str(body.gender),
      allergies: body.allergies === null ? null : str(body.allergies),
      activityLevel: body.activityLevel === null ? null : str(body.activityLevel),
      furType: body.furType === null ? null : str(body.furType),
      size: body.size === null ? null : str(body.size),
      lifeStage: body.lifeStage === null ? null : str(body.lifeStage),
      neutered: body.neutered === null ? null : bool(body.neutered),
    };

    // undefined のキーは削除（= 更新対象に含めない）
    Object.keys(data).forEach((k) => data[k] === undefined && delete data[k]);

    const updated = await prisma.catProfile.update({
      where: { id },
      data,
    });

    return NextResponse.json(updated);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "update failed" }, { status: 500 });
  }
}


// DELETE: 削除
export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const id = parseId(params);
  if (id == null) return NextResponse.json({ error: "invalid id" }, { status: 400 });

  try {
    await prisma.catProfile.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "delete failed" }, { status: 500 });
  }
}
