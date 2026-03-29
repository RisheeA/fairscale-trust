import Head from 'next/head';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { usePrivy } from '@privy-io/react-auth';

function LogoFull({ dark = false }) {
  const fill = dark ? '#0e0d0a' : '#faf8f4';
  return (
    <svg viewBox="0 0 818.33 170.87" height={28} style={{ display: 'block', flexShrink: 0 }} aria-label="FairScale">
      <g fill={fill}>
        <path d="M96.77,46.05s-2.17,16.72-15.57,25.02c-13.4,8.3-20.17,14.55-20.17,39.06v38.91c0,1.73-1.4,3.13-3.13,3.13s-3.13-1.4-3.13-3.13v-38.91c0-24.51-6.77-30.77-20.17-39.06-13.4-8.3-15.57-25.02-15.57-25.02H0s3.06,23.36,25.4,37.15c6.89,3.96,15.45,6.64,15.45,26.04v42.64l17.04,16.6,17.04-16.6v-42.64c0-19.4,8.55-22.09,15.45-26.04,22.34-13.79,25.4-37.15,25.4-37.15h-19.02Z"/><polygon points="87.48 31.98 57.89 2.39 28.31 31.98 57.89 61.37 87.48 31.98"/><path d="M214.84,21.81c22.2,0,30.25,11.81,34.73,22.2,1.61,3.76,2.15,4.47,3.94,4.47,1.61,0,2.51-.72,2.51-2.69l-.18-13.25c0-5.01.36-8.77.36-13.07,0-3.94-2.15-5.37-6.62-5.37-9.31,0-23.81.72-37.77.72-7.88,0-18.26.18-28.46-.18l-16.29-.54c-2.86,0-3.58,1.61-3.58,2.86,0,1.43.54,2.69,3.4,3.22,4.65.9,10.92,2.68,10.92,8.41v121.36c0,9.31-5.73,10.92-11.28,12.17-2.33.54-2.86,1.61-2.86,3.04,0,1.25.72,2.86,3.04,2.86,1.97,0,12.53-1.07,22.73-1.07s20.76,1.07,22.73,1.07c2.33,0,3.04-1.61,3.04-2.86,0-1.43-.54-2.51-2.86-3.04-5.37-1.25-11.28-2.86-11.28-12.17v-49.4c0-6.09.72-6.98,8.59-6.98h11.1c13.6,0,15.75,9.49,17,15.39.72,3.04,1.79,3.94,3.58,3.94s2.86-.9,2.86-3.58c0-3.04-.72-13.42-.72-19.69,0-6.98.72-18.26.72-21.12,0-3.58-1.43-4.12-3.04-4.12-1.79,0-2.86,1.07-3.4,4.12-.9,5.91-3.4,17-17,17h-11.1c-7.88,0-8.59-1.07-8.59-6.98v-45.47c0-9.31,3.76-11.28,13.78-11.28Z"/><path d="M332.19,157.11c-1.03-.51-2.22,0-3.42.68-.85.51-2.57,1.37-3.76,1.37-2.91,0-3.76-3.42-3.76-8.04v-75.41c0-12.48-11.29-20.69-28.56-20.69s-37.28,16.42-37.28,28.22c0,4.79,3.25,8.04,7.52,8.04,4.79,0,7.69-3.08,10.6-9.75,4.45-10.26,10.26-19.49,17.78-19.49,5.99,0,9.06,5.81,9.06,16.07v17.44c0,1.54-.68,2.57-2.05,3.08-31.81,11.46-48.74,32.49-48.74,48.91,0,14.02,10.77,23.08,26.51,23.08,8.72,0,18.47-3.59,25.14-11.29.51-.51.85-.51,1.2.17,2.74,5.13,8.72,8.55,16.07,8.55,6.33,0,13-2.74,14.71-7.52.68-1.88,0-2.91-1.03-3.42ZM300.38,141.72c0,10.43-7.52,17.96-14.88,17.96-8.55,0-13.51-5.47-13.51-14.88,0-12.83,8.55-31.29,27.02-38.65.85-.34,1.37,0,1.37,1.03v34.54Z"/><path d="M378.18,162.41c-3.76-.85-9.06-2.74-9.06-11.63V59.46c0-1.2-.51-1.71-1.88-1.71-.85,0-1.2.17-2.22,1.2-4.62,4.62-15.22,7.52-21.89,8.55-2.22.34-2.57,1.54-2.57,2.74,0,1.37.51,2.39,2.39,2.91,3.76,1.03,5.64,2.39,5.64,7.18v70.45c0,8.89-5.3,10.77-9.06,11.63-2.22.51-2.74,1.54-2.74,2.91,0,1.2.68,2.74,2.91,2.74,1.88,0,10.26-1.03,18.98-1.03s17.44,1.03,19.32,1.03c2.22,0,2.91-1.54,2.91-2.74,0-1.37-.51-2.39-2.74-2.91Z"/><path d="M360.65,42.68c6.45,0,11.15-5.71,11.15-13.39s-4.71-13.21-11.15-13.21-11.15,5.53-11.15,13.21,4.71,13.39,11.15,13.39Z"/><path d="M438.55,55.02c-8.21,0-16.25,6.5-21.03,15.73-.68,1.37-1.03,1.37-1.03-.17v-13.51c0-1.2-.51-1.71-1.88-1.71-.85,0-1.2.17-2.22,1.2-4.62,4.62-15.22,7.52-21.89,8.55-2.22.34-2.56,1.54-2.56,2.74,0,1.37.51,2.39,2.39,2.91,3.76,1.03,5.64,2.39,5.64,7.18v72.85c0,8.89-5.3,10.77-9.06,11.63-2.22.51-2.74,1.54-2.74,2.91,0,1.2.68,2.74,2.91,2.74,1.88,0,10.26-1.03,18.98-1.03,9.92,0,20.86,1.03,22.74,1.03,2.22,0,2.91-1.54,2.91-2.74,0-1.37-.51-2.39-2.74-2.91-6.5-1.37-12.48-2.74-12.48-11.63v-61.22c0-3.42.51-6.67,1.88-10.09,2.74-6.33,7.01-11.29,11.29-11.29,5.64,0,6.16,9.23,14.71,9.23,4.79,0,7.7-3.42,7.7-9.23,0-8.04-5.3-13.17-13.51-13.17Z"/><path d="M470.35,41.41c0-12.15,7.01-19.73,18.98-19.73,16.25,0,27.02,11.8,29.41,32.23.51,4.58,2.22,5.28,3.93,5.28,1.54,0,3.08-.88,3.08-3.7l-.34-13.74c0-6.34.34-12.68.34-15.15,0-8.28-19.32-12.86-32.15-12.86-24.45,0-39.33,15.5-39.33,39.28,0,44.74,61.05,42.8,61.05,86.48,0,14.79-7.52,23.42-20.35,23.42-16.93,0-26.68-11.45-33.52-39.28-.68-2.82-2.05-3.52-3.59-3.52s-3.59.88-3.59,3.87c0,1.41.68,8.45.68,15.68,0,6.34-.68,12.68-.68,15.5,0,7.57,13.17,15.67,35.23,15.67,25.99,0,42.24-16.91,42.24-42.98,0-50.9-61.39-52.66-61.39-86.48Z"/><path d="M610.32,153c-.5-.51-1.16-.85-1.99-.85s-1.66.34-2.65,1.2c-4.98,4.28-10.62,6.33-17.25,6.33-17.91,0-28.36-17.96-28.36-48.57s8.29-48.39,22.56-48.39c10.78,0,16.25,10.26,21.73,23.09.66,1.54,1.49,2.56,3.32,2.56,1.49,0,2.82-.85,2.82-2.22,0-2.22-.33-5.81-.33-9.58s.33-5.47.33-7.7c0-6.16-12.11-13.85-27.37-13.85-27.04,0-44.62,23.26-44.62,59.17s17.58,56.6,44.62,56.6c11.61,0,20.9-4.45,27.2-13.17.66-.85.99-1.71.99-2.57s-.33-1.54-.99-2.05Z"/><path d="M695.79,157.11c-1.01-.51-2.18,0-3.35.68-.84.51-2.51,1.37-3.69,1.37-2.85,0-3.69-3.42-3.69-8.04v-75.41c0-12.48-11.06-20.69-27.99-20.69s-36.54,16.42-36.54,28.22c0,4.79,3.19,8.04,7.38,8.04,4.69,0,7.54-3.08,10.39-9.75,4.36-10.26,10.05-19.49,17.43-19.49,5.87,0,8.88,5.81,8.88,16.07v17.44c0,1.54-.67,2.57-2.01,3.08-31.17,11.46-47.76,32.49-47.76,48.91,0,14.02,10.56,23.08,25.98,23.08,8.55,0,18.1-3.59,24.63-11.29.5-.51.84-.51,1.17.17,2.68,5.13,8.55,8.55,15.75,8.55,6.2,0,12.74-2.74,14.41-7.52.67-1.88,0-2.91-1-3.42ZM664.62,141.72c0,10.43-7.38,17.96-14.58,17.96-8.38,0-13.24-5.47-13.24-14.88,0-12.83,8.38-31.29,26.48-38.65.84-.34,1.34,0,1.34,1.03v34.54Z"/><path d="M737.39,162.41c-3.65-.85-8.79-2.74-8.79-11.63V1.71c0-1.2-.5-1.71-1.82-1.71-.83,0-1.16.17-2.16,1.2-4.48,4.62-14.76,7.52-21.23,8.55-2.16.34-2.49,1.54-2.49,2.74,0,1.37.5,2.39,2.32,2.91,3.65,1.03,5.47,2.39,5.47,7.18v128.21c0,8.89-5.14,10.77-8.79,11.63-2.16.51-2.65,1.54-2.65,2.91,0,1.2.66,2.74,2.82,2.74,1.83,0,9.95-1.03,18.41-1.03s16.92,1.03,18.74,1.03c2.16,0,2.82-1.54,2.82-2.74,0-1.37-.5-2.39-2.65-2.91Z"/><path d="M816.84,149.75c-1.16-.86-2.65-.68-3.98.51-6.63,6.16-12.44,9.41-21.06,9.41-18.08,0-28.69-18.3-28.69-46.51l.17-6.67c0-.68.5-1.2,1.49-1.2h48.1c3.82,0,5.47-2.22,5.47-8.72,0-26.16-13.27-41.55-33.5-41.55-26.21,0-43.29,23.6-43.29,59.68,0,33.86,17.58,55.92,44.78,55.92,13.93,0,26.21-6.67,31.18-17.1.66-1.37.5-2.91-.66-3.76ZM764.09,95.03c2.49-20.69,10.12-31.47,22.23-31.47,9.29,0,15.76,7.18,15.76,18.3,0,9.41-6.3,14.88-16.92,14.88h-19.74c-1,0-1.49-.51-1.33-1.71Z"/>
      </g>
    </svg>
  );
}

function isValidSolana(addr) {
  return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(addr.trim());
}

export default function Home() {
  const router = useRouter();
  const { ready, authenticated, login, user } = usePrivy();
  const [wallet, setWallet]   = useState('');
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [vis, setVis]         = useState(false);

  useEffect(() => {
    setTimeout(() => setVis(true), 80);
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const xHandle        = user?.twitter?.username;
  const connectedWallet = user?.wallet?.address;
  const displayName    = xHandle ? `@${xHandle}` : connectedWallet ? `${connectedWallet.slice(0,6)}…${connectedWallet.slice(-4)}` : null;

  const go = () => {
    const addr = wallet.trim();
    if (!addr)             { setError('Enter a Solana wallet address'); return; }
    if (!isValidSolana(addr)) { setError("That doesn't look like a valid Solana address"); return; }
    setError(''); setLoading(true);
    router.push(`/profile/${addr}`);
  };

  return (
    <>
      <Head>
        <title>FairScale Trust — Onchain trust, made legible</title>
        <meta name="description" content="Turn any Solana wallet into a human-readable trust profile." />
      </Head>

      {/* NAV */}
      <nav style={{ position:'fixed', top:0, left:0, right:0, zIndex:100, height:64,
        display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 40px',
        background: scrolled ? 'rgba(8,7,10,0.95)' : 'transparent',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.07)' : '1px solid transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        transition:'all 0.3s',
      }}>
        <LogoFull dark={false} />
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          {authenticated && displayName ? (
            <>
              <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:12, color:'rgba(240,235,227,0.5)' }}>{displayName}</span>
              <button onClick={() => connectedWallet && router.push(`/profile/${connectedWallet}`)}
                style={{ padding:'8px 16px', borderRadius:8, fontSize:13, fontWeight:600, background:'#b8924a', color:'#fff', border:'none', cursor:'pointer' }}>
                My Profile
              </button>
            </>
          ) : (
            <button onClick={login}
              style={{ padding:'8px 18px', borderRadius:8, fontSize:13, fontWeight:600, background:'rgba(255,255,255,0.08)', color:'rgba(240,235,227,0.85)', border:'1px solid rgba(255,255,255,0.15)', cursor:'pointer' }}>
              Connect wallet
            </button>
          )}
        </div>
      </nav>

      {/* DARK HERO */}
      <section style={{ minHeight:'100vh', background:'#08070a', position:'relative',
        display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
        padding:'120px 24px 80px', overflow:'hidden' }}>

        <div style={{ position:'absolute', inset:0, backgroundImage:"url('/graphics/hero-two-figures.jpg')",
          backgroundSize:'cover', backgroundPosition:'center 35%', opacity:0.18 }} />
        <div style={{ position:'absolute', inset:0,
          background:'linear-gradient(to bottom, rgba(8,7,10,0.05) 0%, rgba(8,7,10,0.5) 45%, rgba(8,7,10,1) 100%)' }} />
        <div style={{ position:'absolute', top:'-5%', left:'50%', transform:'translateX(-50%)',
          width:900, height:600, borderRadius:'50%',
          background:'radial-gradient(ellipse at center, rgba(184,146,74,0.08) 0%, transparent 70%)', pointerEvents:'none' }} />

        <div style={{ position:'relative', zIndex:1, textAlign:'center', maxWidth:740 }}>
          <div style={{ display:'inline-flex', alignItems:'center', gap:8, fontSize:11, fontWeight:600,
            letterSpacing:'0.14em', textTransform:'uppercase', color:'rgba(184,146,74,0.75)', marginBottom:28,
            opacity: vis?1:0, transform: vis?'none':'translateY(10px)', transition:'all 0.55s cubic-bezier(0.22,1,0.36,1)' }}>
            <span style={{ width:6, height:6, borderRadius:'50%', background:'#4ade80', boxShadow:'0 0 8px #4ade80', display:'inline-block' }} />
            Reputation infrastructure · Solana
          </div>

          <h1 style={{ fontFamily:"'Advercase',serif", fontWeight:700,
            fontSize:'clamp(44px,8vw,88px)', lineHeight:1.0, letterSpacing:'-0.025em', color:'#f0ebe3',
            marginBottom:24, opacity:vis?1:0, transform:vis?'none':'translateY(16px)',
            transition:'all 0.6s cubic-bezier(0.22,1,0.36,1) 0.07s' }}>
            Can you trust<br />
            <span style={{ background:'linear-gradient(135deg, #d4ac6a 0%, #b8924a 55%, #8a6a33 100%)',
              WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>
              this wallet?
            </span>
          </h1>

          <p style={{ fontSize:18, color:'rgba(240,235,227,0.45)', lineHeight:1.65, maxWidth:520, margin:'0 auto 48px',
            opacity:vis?1:0, transform:vis?'none':'translateY(12px)', transition:'all 0.6s cubic-bezier(0.22,1,0.36,1) 0.14s' }}>
            FairScale turns onchain behaviour and social credibility into a clear, human-readable trust verdict.
          </p>

          {/* Wallet input */}
          <div style={{ opacity:vis?1:0, transform:vis?'none':'translateY(12px)', transition:'all 0.6s cubic-bezier(0.22,1,0.36,1) 0.21s' }}>
            <div style={{ display:'flex', gap:8, alignItems:'center',
              background:'rgba(8,7,10,0.7)', backdropFilter:'blur(24px)',
              border:'1px solid rgba(184,146,74,0.2)', borderRadius:14, padding:6,
              maxWidth:600, margin:'0 auto',
              boxShadow:'0 8px 48px rgba(0,0,0,0.5), 0 0 0 1px rgba(184,146,74,0.06)' }}>
              <input value={wallet} onChange={e => { setWallet(e.target.value); setError(''); }}
                onKeyDown={e => e.key==='Enter' && go()}
                placeholder="Enter any Solana wallet address…"
                spellCheck={false} autoComplete="off"
                style={{ flex:1, background:'transparent', border:'none', outline:'none',
                  padding:'10px 14px', fontFamily:"'JetBrains Mono',monospace", fontSize:13, color:'#f0ebe3' }} />
              <button onClick={go} disabled={loading}
                style={{ padding:'10px 24px', borderRadius:9, fontWeight:600, fontSize:14,
                  background: loading ? 'rgba(184,146,74,0.4)' : '#b8924a',
                  color:'#fff', border:'none', cursor: loading ? 'not-allowed' : 'pointer',
                  whiteSpace:'nowrap', transition:'background 0.2s' }}>
                {loading ? 'Checking…' : 'Check profile →'}
              </button>
            </div>
            {error && <p style={{ color:'#f87171', fontSize:13, marginTop:10 }}>{error}</p>}
            <div style={{ display:'flex', alignItems:'center', gap:10, justifyContent:'center', marginTop:16, flexWrap:'wrap' }}>
              <span style={{ fontSize:12, color:'rgba(240,235,227,0.25)' }}>Try an example:</span>
              {[
                { label:'7xKXtg…sgAsU', addr:'7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU' },
                { label:'CKLqcv…poNv',  addr:'CKLqcv3TT1Ut15Xq13ALZFAnwK5dswf5VBaqFWDkpoNv' },
              ].map(ex => (
                <button key={ex.addr} onClick={() => { setWallet(ex.addr); setError(''); }}
                  style={{ fontSize:12, fontFamily:"'JetBrains Mono',monospace", padding:'5px 12px', borderRadius:7,
                    background:'rgba(184,146,74,0.07)', color:'rgba(184,146,74,0.65)',
                    border:'1px solid rgba(184,146,74,0.14)', cursor:'pointer' }}>
                  {ex.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div style={{ position:'relative', zIndex:1, marginTop:72,
          display:'flex', gap:56, flexWrap:'wrap', justifyContent:'center',
          opacity:vis?1:0, transition:'opacity 0.7s 0.4s' }}>
          {[['50K+','Wallets scored'],['4,000+','Users signed up'],['Daily','Model retraining'],['Live','Solana mainnet']].map(([v,l]) => (
            <div key={l} style={{ textAlign:'center' }}>
              <div style={{ fontFamily:"'Advercase',serif", fontSize:28, fontWeight:700, color:'#f0ebe3' }}>{v}</div>
              <div style={{ fontSize:12, color:'rgba(240,235,227,0.3)', marginTop:4 }}>{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* LIGHT BODY — HOW IT WORKS */}
      <section style={{ background:'#faf8f4', borderTop:'1px solid #e8e0d3', padding:'80px 24px' }}>
        <div style={{ maxWidth:860, margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:52 }}>
            <div style={{ fontSize:11, fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase', color:'#b8924a', marginBottom:12 }}>How it works</div>
            <h2 style={{ fontFamily:"'Advercase',serif", fontSize:'clamp(28px,4vw,44px)', fontWeight:700, color:'#0e0d0a', letterSpacing:'-0.02em' }}>
              Two signals. One verdict.
            </h2>
            <p style={{ fontSize:16, color:'#7a7068', marginTop:14, maxWidth:460, margin:'14px auto 0', lineHeight:1.65 }}>
              Behavioural credibility from onchain data, plus social credibility from who backs them.
            </p>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(260px, 1fr))', gap:18 }}>
            {[
              { n:'01', icon:'◉', title:'Behavioural credibility', desc:'Onchain activity, token conviction, wallet age, and protocol participation — scored by a neural network retrained daily against 50K+ wallets.' },
              { n:'02', icon:'◈', title:'Social credibility',       desc:'Who vouches for this wallet — and what is their own FairScore? Higher-scoring vouchers carry more weight. Revoked vouches are permanent red flags.' },
              { n:'03', icon:'◇', title:'Human-readable verdict',   desc:'High, Medium, Low, or Unknown. A plain English summary. Reasons, strengths, and watchouts — never a dashboard of raw numbers.' },
            ].map(c => (
              <div key={c.n} style={{ background:'#fff', border:'1px solid #ddd5c8', borderRadius:14, padding:28, boxShadow:'0 1px 4px rgba(0,0,0,0.04)' }}>
                <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:14 }}>
                  <span style={{ fontFamily:"'Advercase',serif", fontSize:11, fontWeight:700, color:'#b0a89e', letterSpacing:'0.1em' }}>{c.n}</span>
                  <span style={{ fontSize:18, color:'#b8924a' }}>{c.icon}</span>
                </div>
                <h3 style={{ fontFamily:"'Advercase',serif", fontSize:18, fontWeight:700, color:'#0e0d0a', marginBottom:10, letterSpacing:'-0.01em' }}>{c.title}</h3>
                <p style={{ fontSize:14, color:'#7a7068', lineHeight:1.7 }}>{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DARK CTA */}
      <section style={{ background:'#08070a', padding:'80px 24px', textAlign:'center',
        borderTop:'1px solid rgba(255,255,255,0.06)', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', inset:0, backgroundImage:"url('/graphics/temple-night-stars.jpg')",
          backgroundSize:'cover', backgroundPosition:'center', opacity:0.1 }} />
        <div style={{ position:'relative', zIndex:1 }}>
          <h2 style={{ fontFamily:"'Advercase',serif", fontSize:'clamp(32px,5vw,56px)', fontWeight:700,
            color:'#f0ebe3', letterSpacing:'-0.02em', marginBottom:16 }}>Trust, verified onchain.</h2>
          <p style={{ fontSize:16, color:'rgba(240,235,227,0.4)', marginBottom:36, maxWidth:400, margin:'0 auto 36px', lineHeight:1.6 }}>
            Enter any Solana wallet and get a trust profile in seconds.
          </p>
          <button onClick={() => window.scrollTo({ top:0, behavior:'smooth' })}
            style={{ padding:'14px 32px', borderRadius:10, fontSize:15, fontWeight:600,
              background:'#b8924a', color:'#fff', border:'none', cursor:'pointer' }}>
            Check a wallet →
          </button>
        </div>
      </section>
    </>
  );
}
