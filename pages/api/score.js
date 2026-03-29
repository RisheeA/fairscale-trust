import { interpretScore } from '../../lib/interpret';
import { supabase } from '../../lib/supabase';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();

  const { wallet } = req.query;
  if (!wallet) return res.status(400).json({ error: 'Wallet address required' });
  if (!/^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(wallet))
    return res.status(400).json({ error: 'Invalid Solana wallet address' });

  try {
    const apiRes = await fetch(
      `${process.env.NEXT_PUBLIC_FAIRSCALE_API_URL}/score?wallet=${wallet}`,
      { headers: { fairkey: process.env.FAIRSCALE_API_KEY } }
    );

    if (!apiRes.ok) {
      const text = await apiRes.text();
      return res.status(apiRes.status).json({ error: 'Wallet not found in FairScale dataset' });
    }

    const data = await apiRes.json();

    // Get vouch count for trust level boost
    const { count: vouchCount } = await supabase
      .from('attestations')
      .select('*', { count: 'exact', head: true })
      .eq('subject_wallet', wallet)
      .eq('revoked', false);

    const profile = interpretScore(data, vouchCount ?? 0);

    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate');
    return res.status(200).json(profile);
  } catch (err) {
    console.error('Score API error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
