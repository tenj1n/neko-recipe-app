// src/app/api/cats/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET: 一覧取得
export async function GET() {
  const cats = await prisma.catProfile.findMany({
    orderBy: { id: "desc" },
    include: { poopLogs: true },
  });
  return NextResponse.json(cats);
}

// POST: 新規作成
export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body.name || body.age === undefined || body.age === null) {
      return NextResponse.json({ error: "name と age は必須です" }, { status: 400 });
    }

    const created = await prisma.catProfile.create({
      data: {
        name: String(body.name),
        age: Number(body.age),
        weight: body.weight != null ? Number(body.weight) : null,
        gender: body.gender ?? null,
        allergies: body.allergies ?? null,
        activityLevel: body.activityLevel ?? null,
        furType: body.furType ?? null,
        size: body.size ?? null,
        lifeStage: body.lifeStage ?? null,
        neutered: typeof body.neutered === "boolean" ? body.neutered : null,
      },
    });

    return NextResponse.json(created, { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "server error" }, { status: 500 });
  }
}
