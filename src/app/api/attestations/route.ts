import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// GET attestations for a wallet
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const wallet = searchParams.get("wallet");

  if (!wallet) return NextResponse.json({ error: "Wallet required" }, { status: 400 });

  const { data, error } = await supabase
    .from("attestations")
    .select("*")
    .eq("subject_wallet", wallet)
    .order("vouch_weight", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(data);
}

// POST new attestation
export async function POST(request: NextRequest) {
  const body = await request.json();
  const { subject_wallet, attester_wallet, attester_handle, reason_code } = body;

  if (!subject_wallet || !attester_wallet || !reason_code) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  // Prevent self-vouching
  if (subject_wallet === attester_wallet) {
    return NextResponse.json({ error: "Cannot vouch for yourself" }, { status: 400 });
  }

  // Prevent duplicate active vouches
  const { data: existing } = await supabase
    .from("attestations")
    .select("id")
    .eq("subject_wallet", subject_wallet)
    .eq("attester_wallet", attester_wallet)
    .eq("revoked", false)
    .single();

  if (existing) {
    return NextResponse.json({ error: "You have already vouched for this wallet" }, { status: 409 });
  }

  // Fetch attester's FairScore to set vouch weight
  let vouchWeight = 0;
  let attesterFairscore: number | undefined;

  try {
    const scoreRes = await fetch(
      `${process.env.NEXT_PUBLIC_FAIRSCALE_API_URL}/score?wallet=${attester_wallet}`,
      {
        headers: { fairkey: process.env.FAIRSCALE_API_KEY! },
      }
    );
    if (scoreRes.ok) {
      const scoreData = await scoreRes.json();
      attesterFairscore = scoreData.fairscore;
      vouchWeight = Math.round(Math.max(0, Math.min(100, scoreData.fairscore)));
    }
  } catch {
    // Proceed with weight 0 if API unavailable
  }

  const { data, error } = await supabase
    .from("attestations")
    .insert({
      subject_wallet,
      attester_wallet,
      attester_handle: attester_handle || null,
      attester_fairscore: attesterFairscore,
      vouch_weight: vouchWeight,
      reason_code,
      revoked: false,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(data);
}

// PATCH revoke attestation
export async function PATCH(request: NextRequest) {
  const body = await request.json();
  const { attestation_id, attester_wallet } = body;

  if (!attestation_id || !attester_wallet) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  // Verify the attester owns this vouch
  const { data: existing } = await supabase
    .from("attestations")
    .select("attester_wallet")
    .eq("id", attestation_id)
    .single();

  if (!existing || existing.attester_wallet !== attester_wallet) {
    return NextResponse.json({ error: "Not authorised to revoke this attestation" }, { status: 403 });
  }

  const { data, error } = await supabase
    .from("attestations")
    .update({ revoked: true, revoked_at: new Date().toISOString() })
    .eq("id", attestation_id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(data);
}
