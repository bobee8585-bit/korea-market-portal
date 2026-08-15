import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isAuthorizedInternalRequest } from "@/lib/internal-auth";

const definitions = [
  {
    name: "Semiconductor",
    slug: "semiconductor",
    description: "Global semiconductor ecosystem from materials and equipment to end markets.",
    stages: ["Materials", "Equipment", "Design", "Wafer / Fab", "Memory / Foundry", "Packaging", "Testing", "End Market"],
  },
  {
    name: "Battery",
    slug: "battery",
    description: "Battery value chain from raw materials to cells, packs, applications and recycling.",
    stages: ["Raw Materials", "Cathode / Anode", "Separator / Electrolyte", "Cell", "Module / Pack", "EV / ESS", "Recycling"],
  },
  {
    name: "Automotive / EV",
    slug: "automotive-ev",
    description: "Automotive and EV ecosystem spanning materials, electronics, propulsion and assembly.",
    stages: ["Materials", "Battery", "Motor / Inverter", "Semiconductor", "Display / Electronics", "ADAS", "Assembly"],
  },
  {
    name: "Shipbuilding",
    slug: "shipbuilding",
    description: "Shipbuilding ecosystem connecting steel, propulsion, marine equipment, yards and shipping.",
    stages: ["Steel", "Engine", "Propulsion", "LNG Equipment", "Marine Equipment", "Shipyard", "Shipping"],
  },
];

export async function POST(request: NextRequest) {
  if (!isAuthorizedInternalRequest(request)) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  const results = [];
  for (const definition of definitions) {
    const ecosystem = await db.ecosystem.upsert({
      where: { slug: definition.slug },
      update: { name: definition.name, description: definition.description, active: true },
      create: { name: definition.name, slug: definition.slug, description: definition.description },
    });

    for (const [index, name] of definition.stages.entries()) {
      await db.ecosystemStage.upsert({
        where: { ecosystemId_sequence: { ecosystemId: ecosystem.id, sequence: index + 1 } },
        update: { name },
        create: { ecosystemId: ecosystem.id, name, sequence: index + 1 },
      });
    }

    results.push({ slug: ecosystem.slug, stages: definition.stages.length });
  }

  return NextResponse.json({ bootstrapped: results });
}
