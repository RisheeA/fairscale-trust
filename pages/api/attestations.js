import { supabase } from '../../lib/supabase';

const VALID_REASONS = ['worked_with','trusted_builder','reliable_counterparty','strong_operator','known_personally'];

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { wallet } = req.query;
    if (!wallet) return res.status(400).json({ error: 'Wallet required' });
    const { data, error } = await supabase.from('attestations').select('*')
      .eq('subject_wallet', wallet).order('vouch_weight', { ascending: false }).order('created_at', { ascending: false });
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data);
  }

  if (req.method === 'POST') {
    const { subject_wallet, attester_wallet, attester_handle, reason_code } = req.body;
    if (!subject_wallet || !attester_wallet || !reason_code) return res.status(400).json({ error: 'Missing required fields' });
    if (!VALID_REASONS.includes(reason_code)) return res.status(400).json({ error: 'Invalid reason code' });
    if (subject_wallet === attester_wallet) return res.status(400).json({ error: 'You cannot vouch for yourself' });
    const { data: existing } = await supabase.from('attestations').select('id').eq('subject_wallet', subject_wallet).eq('attester_wallet', attester_wallet).eq('revoked', false).single();
    if (existing) return res.status(409).json({ error: 'You have already vouched for this wallet' });
    let vouchWeight = 0, attesterFairscore = null;
    try {
      const r = await fetch(`${process.env.NEXT_PUBLIC_FAIRSCALE_API_URL}/score?wallet=${attester_wallet}`, { headers: { fairkey: process.env.FAIRSCALE_API_KEY } });
      if (r.ok) { const d = await r.json(); attesterFairscore = d.fairscore; vouchWeight = Math.round(Math.max(0, Math.min(100, d.fairscore))); }
    } catch (_) {}
    const { data, error } = await supabase.from('attestations').insert({ subject_wallet, attester_wallet, attester_handle: attester_handle||null, attester_fairscore: attesterFairscore, vouch_weight: vouchWeight, reason_code, revoked: false }).select().single();
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data);
  }

  if (req.method === 'PATCH') {
    const { attestation_id, attester_wallet } = req.body;
    if (!attestation_id || !attester_wallet) return res.status(400).json({ error: 'Missing required fields' });
    const { data: existing } = await supabase.from('attestations').select('attester_wallet').eq('id', attestation_id).single();
    if (!existing || existing.attester_wallet !== attester_wallet) return res.status(403).json({ error: 'Not authorised to revoke this vouch' });
    const { data, error } = await supabase.from('attestations').update({ revoked: true, revoked_at: new Date().toISOString() }).eq('id', attestation_id).select().single();
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data);
  }

  return res.status(405).end();
}
