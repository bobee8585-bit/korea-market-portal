import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  const ecosystems = await db.ecosystem.findMany({
    where: { active: true },
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      _count: {
        select: { stages: true, products: true, roles: true },
      },
    },
  });

  return NextResponse.json({ ecosystems });
}
