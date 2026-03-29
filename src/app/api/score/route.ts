import { NextRequest, NextResponse } from "next/server";
import { interpretScore } from "@/lib/interpret";
import { supabase } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const wallet = searchParams.get("wallet");

  if (!wallet) {
    return NextResponse.json({ error: "Wallet address required" }, { status: 400 });
  }

  // Basic Solana address validation
  if (!/^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(wallet)) {
    return NextResponse.json({ error: "Invalid Solana wallet address" }, { status: 400 });
  }

  try {
    // Fetch from FairScale API (server-side — API key never exposed to client)
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_FAIRSCALE_API_URL}/score?wallet=${wallet}`,
      {
        headers: {
          fairkey: process.env.FAIRSCALE_API_KEY!,
          "Content-Type": "application/json",
        },
        next: { revalidate: 300 }, // Cache for 5 minutes
      }
    );

    if (!res.ok) {
      const error = await res.text();
      console.error("FairScale API error:", error);
      return NextResponse.json(
        { error: "Failed to fetch wallet score. The wallet may not exist in our dataset." },
        { status: res.status }
      );
    }

    const apiData = await res.json();

    // Get vouch count for trust level calculation
    const { count: vouchCount } = await supabase
      .from("attestations")
      .select("*", { count: "exact", head: true })
      .eq("subject_wallet", wallet)
      .eq("revoked", false);

    // Run interpretation engine
    const profile = interpretScore(apiData, vouchCount ?? 0);

    return NextResponse.json(profile);
  } catch (err) {
    console.error("Score API error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
