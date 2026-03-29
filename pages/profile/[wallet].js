import Head from 'next/head';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { usePrivy } from '@privy-io/react-auth';
import { TRUST_COLOURS, TRUST_BG, TRUST_BORDER, percentileLabel } from '../../lib/interpret';

const REASON_LABELS = {
  worked_with:'Worked with them', trusted_builder:'Trusted builder',
  reliable_counterparty:'Reliable counterparty', strong_operator:'Strong operator', known_personally:'Known personally',
};
const TIER_COLOURS = { bronze:'#cd7f32', silver:'#9ca3af', gold:'#b8924a', platinum:'#e5e4e2' };

function LogoIcon({ size=22 }) {
  return (
    <svg viewBox="0 0 319.33 458.04" height={size} style={{ display:'block' }}>
      <path fill="#0e0d0a" d="M266.87,120.41s-5.99,46.12-42.95,69.01-55.63,40.14-55.63,107.73v107.32c0,4.76-3.86,8.63-8.63,8.63s-8.63-3.86-8.63-8.63v-107.32c0-67.6-18.66-84.85-55.63-107.73-36.97-22.88-42.95-69.01-42.95-69.01H0s8.45,64.43,70.06,102.45c19.01,10.91,42.6,18.31,42.6,71.82v117.59l47,45.77,47-45.77v-117.59c0-53.51,23.59-60.91,42.6-71.82,61.61-38.02,70.06-102.45,70.06-102.45h-52.46Z"/>
      <polygon fill="#0e0d0a" points="241.26 81.59 159.66 0 78.07 81.59 159.66 162.66 241.26 81.59"/>
    </svg>
  );
}

function ScoreRing({ score, trustLevel, size=200 }) {
  const [n, setN] = useState(0);
  const color = TRUST_COLOURS[trustLevel] || '#5a5248';
  const r = (size-20)/2, circ = 2*Math.PI*r, cx=size/2, cy=size/2;
  const offset = score>0 ? circ-(score/100)*circ : circ;
  useEffect(() => {
    if (!score) return;
    let raf, start;
    const dur=1400, run=ts=>{ if(!start)start=ts; const p=Math.min((ts-start)/dur,1), e=1-Math.pow(1-p,4); setN(Math.round(e*score)); if(p<1)raf=requestAnimationFrame(run); };
    raf=requestAnimationFrame(run); return ()=>cancelAnimationFrame(raf);
  },[score]);
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display:'block', overflow:'visible' }}>
      <defs><filter id="rg"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#e8e0d3" strokeWidth={10}/>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth={10} strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={offset} transform={`rotate(-90 ${cx} ${cy})`} filter="url(#rg)" style={{ transition:'stroke-dashoffset 1.4s cubic-bezier(0.34,1.2,0.64,1)' }}/>
      <text x={cx} y={cy-8} textAnchor="middle" dominantBaseline="middle" fill={color} fontSize={size*0.24} fontWeight={700} fontFamily="'Advercase',serif">{n||'–'}</text>
      <text x={cx} y={cy+size*0.12} textAnchor="middle" dominantBaseline="middle" fill="#a09890" fontSize={12} fontFamily="'DM Sans',sans-serif">/100</text>
      <text x={cx} y={cy+size*0.22} textAnchor="middle" dominantBaseline="middle" fill={color} fontSize={10} fontWeight={600} fontFamily="'Advercase',serif" letterSpacing={2}>{trustLevel?.toUpperCase()}</text>
    </svg>
  );
}

function Skeleton() {
  return (<div style={{ padding:'32px 0' }}>{[200,160,240,120,180].map((w,i)=>(<div key={i} className="skeleton" style={{ height:i===0?180:16, width:i===0?'100%':w, borderRadius:i===0?16:8, marginBottom:i===0?24:12 }}/>))}</div>);
}

function Attestations({ subjectWallet }) {
  const { user, login, authenticated } = usePrivy();
  const [attestations,setAttestations]=useState([]), [loading,setLoading]=useState(true);
  const [showForm,setShowForm]=useState(false), [reason,setReason]=useState('worked_with');
  const [submitting,setSubmitting]=useState(false), [revoking,setRevoking]=useState(null);
  const [msg,setMsg]=useState({ type:'',text:'' });
  const connectedWallet=user?.wallet?.address, xHandle=user?.twitter?.username;
  const displayAs=xHandle?`@${xHandle}`:connectedWallet?`${connectedWallet.slice(0,6)}…${connectedWallet.slice(-4)}`:'';
  const load=async()=>{ try{ const r=await fetch(`/api/attestations?wallet=${subjectWallet}`); const d=await r.json(); setAttestations(Array.isArray(d)?d:[]); }catch{ setAttestations([]); }finally{ setLoading(false); } };
  useEffect(()=>{ load(); },[subjectWallet]);
  const submit=async()=>{ if(!connectedWallet)return; setSubmitting(true); setMsg({type:'',text:''});
    try{ const r=await fetch('/api/attestations',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({subject_wallet:subjectWallet,attester_wallet:connectedWallet,attester_handle:xHandle||null,reason_code:reason})});
    const d=await r.json(); if(!r.ok)setMsg({type:'error',text:d.error}); else{ setMsg({type:'success',text:'Vouch submitted'}); setShowForm(false); load(); setTimeout(()=>setMsg({type:'',text:''}),4000); }
  }catch{ setMsg({type:'error',text:'Something went wrong'}); }finally{ setSubmitting(false); } };
  const revoke=async(id)=>{ if(!connectedWallet)return; setRevoking(id);
    try{ await fetch('/api/attestations',{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({attestation_id:id,attester_wallet:connectedWallet})}); load(); }catch{}finally{ setRevoking(null); } };
  const active=attestations.filter(a=>!a.revoked), revoked=attestations.filter(a=>a.revoked);
  const alreadyVouched=attestations.some(a=>a.attester_wallet===connectedWallet&&!a.revoked);
  return (
    <div className="section-card">
      <div style={{ padding:'16px 20px',display:'flex',alignItems:'center',justifyContent:'space-between',borderBottom:'1px solid #e8e0d3' }}>
        <div><div className="t-label" style={{ color:'#7a7068' }}>Vouched By</div>{active.length>0&&<div style={{ fontSize:12,color:'#b0a89e',marginTop:2 }}>{active.length} active vouch{active.length!==1?'es':''}</div>}</div>
        {!alreadyVouched&&(authenticated?<button onClick={()=>setShowForm(f=>!f)} className="btn btn-outline btn-sm">{showForm?'Cancel':'+ Vouch'}</button>:<button onClick={login} className="btn btn-outline btn-sm">Connect to vouch</button>)}
        {alreadyVouched&&<span className="badge badge-green">✓ Vouched</span>}
      </div>
      <div style={{ padding:'0 20px 20px' }}>
        {msg.text&&<div style={{ margin:'14px 0 0',padding:'10px 14px',borderRadius:8,fontSize:13, background:msg.type==='success'?'var(--green-bg)':'var(--red-bg)', color:msg.type==='success'?'var(--green-text)':'var(--red)', border:`1px solid ${msg.type==='success'?'var(--green-border)':'var(--red-border)'}` }}>{msg.text}</div>}
        {showForm&&authenticated&&(
          <div style={{ margin:'16px 0',padding:16,background:'var(--paper)',border:'1px solid var(--border)',borderRadius:10 }}>
            <p style={{ fontSize:12,color:'#7a7068',marginBottom:14 }}>Vouching as <strong style={{ color:'#3d3830' }}>{displayAs}</strong> — your FairScore weights your vouch.</p>
            <div style={{ marginBottom:14 }}>
              <div className="t-label" style={{ color:'#b0a89e',marginBottom:8 }}>Reason</div>
              <div style={{ display:'flex',flexWrap:'wrap',gap:6 }}>
                {Object.entries(REASON_LABELS).map(([code,label])=>(
                  <button key={code} onClick={()=>setReason(code)} style={{ fontSize:12,padding:'6px 12px',borderRadius:6,cursor:'pointer',transition:'all 0.15s', background:reason===code?'#0e0d0a':'transparent', color:reason===code?'#faf8f4':'#7a7068', border:`1px solid ${reason===code?'#0e0d0a':'var(--border-2)'}`, fontWeight:reason===code?600:400 }}>{label}</button>
                ))}
              </div>
            </div>
            <button onClick={submit} disabled={submitting} className="btn btn-primary" style={{ width:'100%',justifyContent:'center' }}>{submitting?'Submitting…':'Submit vouch'}</button>
          </div>
        )}
        {loading?(<div style={{ paddingTop:16 }}>{[1,2].map(i=><div key={i} className="skeleton" style={{ height:56,borderRadius:8,marginBottom:8 }}/>)}</div>
        ):active.length===0&&revoked.length===0?(<div style={{ padding:'28px 0',textAlign:'center' }}><p style={{ fontSize:13,color:'#b0a89e' }}>No vouches yet</p><p style={{ fontSize:12,color:'#c8c0b4',marginTop:4 }}>Be the first — your FairScore backs your credibility</p></div>
        ):(<div style={{ paddingTop:14,display:'flex',flexDirection:'column',gap:8 }}>{[...active,...revoked].map(a=>{
          const name=a.attester_handle?`@${a.attester_handle}`:`${a.attester_wallet.slice(0,6)}…${a.attester_wallet.slice(-4)}`;
          const isOwn=a.attester_wallet===connectedWallet;
          const wColor=a.vouch_weight>=70?'var(--green)':a.vouch_weight>=40?'var(--amber)':'#b0a89e';
          return (<div key={a.id} style={{ display:'flex',alignItems:'center',gap:12,padding:'10px 14px', background:a.revoked?'var(--red-bg)':'var(--paper)',borderRadius:10, border:`1px solid ${a.revoked?'var(--red-border)':'var(--border)'}`,opacity:a.revoked?0.7:1 }}>
            <div style={{ width:34,height:34,borderRadius:'50%',flexShrink:0,display:'flex',alignItems:'center',justifyContent:'center', background:'var(--paper-2)',border:'1px solid var(--border-2)', fontFamily:"'Advercase',serif",fontSize:12,fontWeight:700,color:'var(--ink-3)' }}>{name.slice(0,2).toUpperCase()}</div>
            <div style={{ flex:1,minWidth:0 }}>
              <div style={{ display:'flex',alignItems:'center',gap:6,flexWrap:'wrap' }}>
                <span style={{ fontSize:13,fontWeight:600,color:'var(--ink)',textDecoration:a.revoked?'line-through':'none' }}>{name}</span>
                {a.revoked&&<span className="badge badge-red">⚠ Revoked</span>}
              </div>
              <div style={{ display:'flex',alignItems:'center',gap:8,marginTop:3 }}>
                <span style={{ fontSize:11,color:'var(--ink-4)' }}>{REASON_LABELS[a.reason_code]}</span>
                <span style={{ color:'var(--border-2)',fontSize:10 }}>·</span>
                <span style={{ fontSize:11,color:'var(--ink-4)' }}>{new Date(a.created_at).toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'})}</span>
              </div>
            </div>
            <div style={{ display:'flex',flexDirection:'column',alignItems:'flex-end',gap:4,flexShrink:0 }}>
              {a.vouch_weight>0&&<div style={{ display:'flex',alignItems:'center',gap:6 }}><div style={{ height:3,borderRadius:2,background:wColor,opacity:0.7,width:Math.max(12,(a.vouch_weight/100)*48) }}/><span style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:wColor,fontWeight:500 }}>{a.vouch_weight}</span></div>}
              {isOwn&&!a.revoked&&<button onClick={()=>revoke(a.id)} disabled={revoking===a.id} style={{ fontSize:11,color:'var(--red)',background:'none',border:'none',cursor:'pointer',padding:0,opacity:0.7 }}>{revoking===a.id?'…':'Revoke'}</button>}
            </div>
          </div>);
        })}</div>)}
      </div>
    </div>
  );
}

function Metrics({ features, fairscoreBase, socialScore, tier, timestamp }) {
  const [open,setOpen]=useState(false);
  const PCTS=[{key:'major_percentile_score',label:'Major tokens'},{key:'native_sol_percentile',label:'Native SOL'},{key:'lst_percentile_score',label:'Liquid staking'},{key:'stable_percentile_score',label:'Stablecoins'}];
  return (
    <div className="section-card">
      <button onClick={()=>setOpen(o=>!o)} style={{ width:'100%',display:'flex',alignItems:'center',justifyContent:'space-between',padding:'14px 20px',background:'none',border:'none',cursor:'pointer',transition:'background 0.15s' }} onMouseEnter={e=>e.currentTarget.style.background='#faf8f4'} onMouseLeave={e=>e.currentTarget.style.background='none'}>
        <span className="t-label" style={{ color:'#b0a89e' }}>Detailed metrics</span>
        <svg width={16} height={16} viewBox="0 0 16 16" fill="none" stroke="#b0a89e" strokeWidth={1.5} strokeLinecap="round" style={{ transition:'transform 0.2s',transform:open?'rotate(180deg)':'none',flexShrink:0 }}><path d="M4 6l4 4 4-4"/></svg>
      </button>
      {open&&(<div style={{ padding:'0 20px 20px' }}>
        <div style={{ marginBottom:18 }}>
          <div className="t-label" style={{ color:'#b0a89e',marginBottom:10 }}>Score breakdown</div>
          <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:10 }}>
            {[['Base FairScore',fairscoreBase?.toFixed(1)],['Social score',socialScore?.toFixed(1)],['Tier',tier?.charAt(0).toUpperCase()+tier?.slice(1)],['Updated',new Date(timestamp).toLocaleDateString('en-GB',{day:'numeric',month:'short'})]].map(([l,v])=>(
              <div key={l} style={{ background:'var(--paper)',border:'1px solid var(--border)',borderRadius:8,padding:'10px 14px' }}><div style={{ fontSize:11,color:'var(--ink-4)',marginBottom:4 }}>{l}</div><div style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:14,color:'var(--ink)',fontWeight:500 }}>{v}</div></div>
            ))}
          </div>
        </div>
        <div style={{ marginBottom:18 }}>
          <div className="t-label" style={{ color:'#b0a89e',marginBottom:4 }}>Ecosystem percentiles</div>
          <p style={{ fontSize:12,color:'var(--ink-4)',marginBottom:10 }}>How this wallet compares across 50K+ wallets</p>
          <div style={{ display:'flex',flexDirection:'column',gap:10 }}>
            {PCTS.map(({key,label})=>{ const val=features?.[key]; if(val===undefined||val===null)return null; const pct=Math.round(Math.max(0,Math.min(100,val??0))); const col=pct>=75?'var(--green)':pct>=50?'var(--amber)':'var(--ink-4)'; return (
              <div key={key}><div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:5 }}><span style={{ fontSize:12,color:'var(--ink-3)' }}>{label}</span><span style={{ fontSize:11,color:col,fontWeight:600 }}>{percentileLabel(val)}</span></div><div style={{ height:3,background:'var(--paper-3)',borderRadius:2,overflow:'hidden' }}><div style={{ height:'100%',width:`${pct}%`,background:col,borderRadius:2,opacity:0.8 }}/></div></div>
            );})}
          </div>
        </div>
        <div>
          <div className="t-label" style={{ color:'#b0a89e',marginBottom:10 }}>Activity stats</div>
          <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:10 }}>
            {[['Transactions',features?.tx_count?.toLocaleString()],['Active days',features?.active_days?`${features.active_days} days`:null],['Wallet age score',features?.wallet_age_score!=null?`${features.wallet_age_score}/100`:null],['Conviction ratio',features?.conviction_ratio!=null?`${features.conviction_ratio}/100`:null],['Platform diversity',features?.platform_diversity!=null?`${features.platform_diversity}/100`:null],['Median hold days',features?.median_hold_days?`${features.median_hold_days} days`:null]].filter(([,v])=>v).map(([l,v])=>(
              <div key={l} style={{ background:'var(--paper)',border:'1px solid var(--border)',borderRadius:8,padding:'10px 14px' }}><div style={{ fontSize:11,color:'var(--ink-4)',marginBottom:4 }}>{l}</div><div style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:14,color:'var(--ink)',fontWeight:500 }}>{v}</div></div>
            ))}
          </div>
        </div>
      </div>)}
    </div>
  );
}

export default function ProfilePage() {
  const router=useRouter(), wallet=router.query.wallet;
  const { user,login,logout,authenticated }=usePrivy();
  const [profile,setProfile]=useState(null), [loading,setLoading]=useState(true), [error,setError]=useState('');
  const xHandle=user?.twitter?.username, connectedWallet=user?.wallet?.address;
  const displayName=xHandle?`@${xHandle}`:connectedWallet?`${connectedWallet.slice(0,6)}…${connectedWallet.slice(-4)}`:null;

  useEffect(()=>{ if(!wallet)return; setLoading(true); setError('');
    fetch(`/api/score?wallet=${wallet}`).then(r=>{ if(!r.ok)return r.json().then(d=>{throw new Error(d.error||'Failed');}); return r.json(); })
    .then(d=>setProfile(d)).catch(e=>setError(e.message)).finally(()=>setLoading(false));
  },[wallet]);

  const trustColor=profile?TRUST_COLOURS[profile.trust_level]:'#5a5248';
  const shortWallet=wallet?`${wallet.slice(0,6)}…${wallet.slice(-4)}`:'';
  const BADGE_TIER={ gold:'badge-gold', silver:'badge-neutral', bronze:'badge-neutral' };

  return (
    <>
      <Head><title>{profile?`${shortWallet} — FairScale Trust`:'FairScale Trust'}</title></Head>

      {/* NAV */}
      <nav style={{ position:'sticky',top:0,zIndex:100,height:60, background:'rgba(250,247,242,0.97)',borderBottom:'1px solid #ddd5c8', backdropFilter:'blur(20px)',WebkitBackdropFilter:'blur(20px)', display:'flex',alignItems:'center',justifyContent:'space-between',padding:'0 32px' }}>
        <button onClick={()=>router.push('/')} style={{ display:'flex',alignItems:'center',gap:10,background:'none',border:'none',cursor:'pointer',padding:0 }}>
          <LogoIcon size={22}/>
          <span style={{ fontFamily:"'Advercase',serif",fontSize:16,fontWeight:700,color:'#0e0d0a',letterSpacing:'0.06em' }}>FairScale</span>
        </button>
        <div style={{ display:'flex',alignItems:'center',gap:12 }}>
          {profile&&<span style={{ fontSize:11,color:'#b0a89e',display:'flex',alignItems:'center',gap:5 }}><span style={{ width:5,height:5,borderRadius:'50%',background:'#4ade80',display:'inline-block' }}/>Score updated daily</span>}
          {authenticated?(<div style={{ display:'flex',alignItems:'center',gap:10 }}><span style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:'#7a7068' }}>{displayName}</span><button onClick={logout} className="btn btn-outline btn-sm">Disconnect</button></div>
          ):(<button onClick={login} className="btn btn-outline btn-sm">Connect wallet</button>)}
        </div>
      </nav>

      {/* Subtle background */}
      <div style={{ position:'fixed',inset:0,zIndex:-1, backgroundImage:"url('/graphics/temple-night-stars.jpg')", backgroundSize:'cover',backgroundPosition:'center top',opacity:0.04 }}/>

      <main style={{ maxWidth:720,margin:'0 auto',padding:'40px 24px 80px' }}>
        {loading&&<Skeleton/>}

        {error&&!loading&&(
          <div style={{ paddingTop:60,textAlign:'center' }} className="anim-fadeup">
            <div style={{ display:'inline-block',padding:28,borderRadius:16,background:'var(--red-bg)',border:'1px solid var(--red-border)',marginBottom:20 }}>
              <p style={{ color:'var(--red)',fontSize:14,fontWeight:600 }}>{error}</p>
              <p style={{ color:'var(--ink-4)',fontSize:12,marginTop:6 }}>This wallet may not be in the FairScale dataset yet.</p>
            </div><br/>
            <button onClick={()=>router.push('/')} style={{ fontSize:13,color:'var(--gold)',background:'none',border:'none',cursor:'pointer' }}>← Try another wallet</button>
          </div>
        )}

        {profile&&!loading&&(
          <div style={{ display:'flex',flexDirection:'column',gap:14 }}>

            {/* HERO */}
            <div style={{ display:'flex',alignItems:'center',gap:24,marginBottom:8 }} className="anim-fadeup">
              <div style={{ flexShrink:0 }}><ScoreRing score={profile.fairscore} trustLevel={profile.trust_level} size={160}/></div>
              <div style={{ flex:1,minWidth:0 }}>
                <div style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:12,color:'#b0a89e',marginBottom:8,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap' }} title={wallet}>{wallet}</div>
                <div style={{ display:'flex',alignItems:'center',gap:8,marginBottom:10,flexWrap:'wrap' }}>
                  <span style={{ fontFamily:"'Advercase',serif",fontSize:11,fontWeight:700,letterSpacing:'0.1em',textTransform:'uppercase', color:TIER_COLOURS[profile.tier]||'#b0a89e', background:`${TIER_COLOURS[profile.tier]||'#b0a89e'}18`, border:`1px solid ${TIER_COLOURS[profile.tier]||'#b0a89e'}35`, padding:'3px 10px',borderRadius:20 }}>
                    ◈ {profile.tier?.charAt(0).toUpperCase()+profile.tier?.slice(1)}
                  </span>
                </div>
                <div style={{ fontFamily:"'Advercase',serif",fontSize:38,fontWeight:700,color:trustColor,lineHeight:1,marginBottom:4 }}>{profile.trust_level}</div>
                <div style={{ fontSize:12,color:'#b0a89e' }}>Trust level</div>
              </div>
            </div>

            {/* VERDICT */}
            <div style={{ background:TRUST_BG[profile.trust_level],border:`1px solid ${TRUST_BORDER[profile.trust_level]}`,borderRadius:16,padding:24 }} className="anim-fadeup">
              <div style={{ display:'flex',alignItems:'flex-start',gap:16 }}>
                <div style={{ width:44,height:44,borderRadius:10,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0, background:`${trustColor}15`,border:`1px solid ${trustColor}30`, fontFamily:"'Advercase',serif",fontSize:18,color:trustColor }}>
                  {profile.trust_level==='High'?'✦':profile.trust_level==='Medium'?'◈':profile.trust_level==='Low'?'⚠':'?'}
                </div>
                <div>
                  <div style={{ display:'flex',alignItems:'center',gap:10,flexWrap:'wrap',marginBottom:8 }}>
                    <span style={{ fontFamily:"'Advercase',serif",fontSize:22,fontWeight:700,color:trustColor }}>{profile.trust_level} Trust</span>
                    <span style={{ fontSize:11,padding:'3px 10px',borderRadius:20,fontWeight:600,
                      color:profile.confidence==='Strong evidence'?'var(--green-text)':profile.confidence==='Moderate evidence'?'var(--amber)':'var(--ink-4)',
                      background:profile.confidence==='Strong evidence'?'var(--green-bg)':profile.confidence==='Moderate evidence'?'var(--amber-bg)':'var(--paper-2)',
                      border:`1px solid ${profile.confidence==='Strong evidence'?'var(--green-border)':profile.confidence==='Moderate evidence'?'var(--amber-border)':'var(--border)'}` }}>
                      {profile.confidence}
                    </span>
                  </div>
                  <p style={{ fontSize:14,color:'var(--ink-3)',lineHeight:1.7,margin:0 }}>{profile.summary}</p>
                </div>
              </div>
            </div>

            {/* WHY */}
            <div className="section-card anim-fadeup">
              <div className="section-header" style={{ cursor:'default' }}><span className="section-title">Why this verdict</span></div>
              <div className="section-body">
                {profile.why.map((reason,i)=>(
                  <div key={i} style={{ display:'flex',alignItems:'flex-start',gap:14,marginBottom:i<profile.why.length-1?14:0,paddingBottom:i<profile.why.length-1?14:0,borderBottom:i<profile.why.length-1?'1px solid var(--border)':'none' }}>
                    <span style={{ fontFamily:"'Advercase',serif",fontSize:11,fontWeight:700,color:'#b8924a',marginTop:1,flexShrink:0,letterSpacing:'0.05em' }}>{String(i+1).padStart(2,'0')}</span>
                    <p style={{ fontSize:13,color:'var(--ink-2)',lineHeight:1.7,margin:0 }}>{reason}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* STRENGTHS / WATCHOUTS */}
            <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:14 }} className="anim-fadeup">
              <div className="section-card">
                <div className="section-header" style={{ cursor:'default' }}><span className="section-title" style={{ color:'var(--green-text)' }}>↑ Strengths</span></div>
                <div className="section-body">
                  {profile.strengths.length>0?profile.strengths.map((s,i)=>(<div key={i} className="flag flag-positive" style={{ marginBottom:i<profile.strengths.length-1?8:0 }}><div className="flag-detail">{s}</div></div>))
                  :<p style={{ fontSize:12,color:'var(--ink-4)' }}>No notable strengths detected</p>}
                </div>
              </div>
              <div className="section-card">
                <div className="section-header" style={{ cursor:'default' }}><span className="section-title" style={{ color:'var(--red)' }}>⚠ Watch outs</span></div>
                <div className="section-body">
                  {profile.watchouts.map((w,i)=>(<div key={i} className="flag flag-warning" style={{ marginBottom:i<profile.watchouts.length-1?8:0 }}><div className="flag-detail">{w}</div></div>))}
                </div>
              </div>
            </div>

            {/* BADGES */}
            {profile.badges.length>0&&(
              <div className="section-card anim-fadeup">
                <div className="section-header" style={{ cursor:'default' }}><span className="section-title">Earned Badges</span></div>
                <div className="section-body"><div style={{ display:'flex',flexWrap:'wrap',gap:8 }}>
                  {profile.badges.map(b=>(<span key={b.id} title={b.desc} className={`badge ${BADGE_TIER[b.tier]||'badge-neutral'}`} style={{ fontSize:11,padding:'5px 12px' }}>{b.label}</span>))}
                </div></div>
              </div>
            )}

            {/* ATTESTATIONS */}
            {wallet&&<Attestations subjectWallet={wallet}/>}

            {/* METRICS */}
            <Metrics features={profile.features} fairscoreBase={profile.fairscore_base} socialScore={profile.social_score} tier={profile.tier} timestamp={profile.timestamp}/>

            {/* FOOTER */}
            <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',paddingTop:8 }}>
              <button onClick={()=>router.push('/')} style={{ fontSize:12,color:'var(--ink-4)',background:'none',border:'none',cursor:'pointer' }}>← Check another wallet</button>
              <span style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:'var(--ink-4)' }}>FairScale Trust · Updated daily</span>
            </div>
          </div>
        )}
      </main>
    </>
  );
}
