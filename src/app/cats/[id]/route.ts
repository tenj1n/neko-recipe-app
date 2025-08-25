// src/app/api/cats/[id]/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// -----------------------------
// GET /api/cats/[id]
// → 特定の猫プロフィールを1件取得する
// -----------------------------
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const cat = await prisma.catProfile.findUnique({
      where: { id: Number(params.id) },
      include: { poopLogs: true }, // うんちログも一緒に取得
    });

    if (!cat) {
      // IDに対応する猫がいなかった場合
      return NextResponse.json({ error: "not found" }, { status: 404 });
    }

    return NextResponse.json(cat);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "server error" }, { status: 500 });
  }
}

// -----------------------------
// PUT /api/cats/[id]
// → 特定の猫プロフィールを更新する
// -----------------------------
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();

    const updated = await prisma.catProfile.update({
      where: { id: Number(params.id) },
      data: {
        name: body.name,
        age: Number(body.age),
        weight: body.weight ? Number(body.weight) : null,
        gender: body.gender ?? null,
        allergies: body.allergies ?? null,
        activityLevel: body.activityLevel ?? null,
        furType: body.furType ?? null,
        size: body.size ?? null,
        lifeStage: body.lifeStage ?? null,
        neutered:
          typeof body.neutered === "boolean" ? body.neutered : null,
      },
    });

    return NextResponse.json(updated);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "update failed" }, { status: 500 });
  }
}

// -----------------------------
// DELETE /api/cats/[id]
// → 特定の猫プロフィールを削除する
// -----------------------------
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.catProfile.delete({
      where: { id: Number(params.id) },
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "delete failed" }, { status: 500 });
  }
}
