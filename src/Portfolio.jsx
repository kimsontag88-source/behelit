import { useState, useEffect, useRef, useMemo, useCallback } from "react";

// ═══════════════════════════════════════════════════════════════
// GLOBAL CSS
// ═══════════════════════════════════════════════════════════════
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Noto+Serif+JP:wght@300;400;700&family=JetBrains+Mono:wght@300;400;500&family=Instrument+Serif:ital@0;1&family=DotGothic16&display=swap');
  @import url('https://cdn.jsdelivr.net/gh/MonadABXY/mona-font/web/mona.css');

  @font-face {
    font-family: 'DosStory';
    src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_2304-2@1.0/DOSIyagiMedium.woff2') format('woff2');
    font-display: swap;
  }
  @font-face {
    font-family: 'Seogung';
    src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/2601-4@1.1/Suhgung12.woff2') format('woff2');
    font-display: swap;
  }

  :root {
    --bg:     #07070f;
    --bg2:    #0c0c1a;
    --bg3:    #111120;
    --fg:     #e4e4f0;
    --fg2:    #7a7a99;
    --fg3:    #3a3a55;
    --b:      #6c5fff;
    --o:      #ff5c8a;
    --g:      #3dffb0;
    --line:   rgba(255,255,255,0.055);
    --sans:   'Syne', sans-serif;
    --serif:  'Noto Serif JP', 'Instrument Serif', serif;
    --mono:   'Seogung', 'Mona12', 'DotGothic16', 'JetBrains Mono', monospace;
    --code:   'JetBrains Mono', 'Mona12', monospace;
    --display:'DosStory', 'Seogung', 'DotGothic16', sans-serif;
    --pixel-emoji: 'Mona12 Color Emoji', 'Mona12 Emoji', sans-serif;
  }

  .pixel, [data-pixel] {
    font-family: var(--mono);
    -webkit-font-smoothing: none;
    -moz-osx-font-smoothing: grayscale;
    font-smooth: never;
    image-rendering: pixelated;
  }

  *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
  html { scroll-behavior:smooth; }
  body {
    background: var(--bg);
    color: var(--fg);
    font-family: var(--sans);
    overflow-x: hidden;
  }

  @media (pointer: fine) {
    body { cursor: none; }
  }

  ::-webkit-scrollbar { width:2px; }
  ::-webkit-scrollbar-thumb { background: var(--fg3); border-radius:2px; }
  ::selection { background: var(--b); color:#fff; }

  @keyframes fadeUp   { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:translateY(0)} }
  @keyframes fadeIn   { from{opacity:0} to{opacity:1} }
  @keyframes pulse-r  { 0%{transform:scale(0.9);opacity:.8} 100%{transform:scale(1.6);opacity:0} }
  @keyframes float    { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
  @keyframes marquee  { from{transform:translateX(0)} to{transform:translateX(-50%)} }
  @keyframes blink    { 0%,100%{opacity:1} 50%{opacity:0} }
  @keyframes shimmer  { 0%{background-position:-200% center} 100%{background-position:200% center} }
  @keyframes noise    { 0%,100%{transform:translate(0,0)} 20%{transform:translate(-1%,-2%)} 40%{transform:translate(2%,1%)} 60%{transform:translate(-1%,2%)} 80%{transform:translate(1%,-1%)} }
  @keyframes typeChar { from{width:0} to{width:100%} }
  @keyframes glitchIn {
    0%{clip-path:inset(80% 0 0 0);transform:translate(-3px,0)}
    20%{clip-path:inset(20% 0 70% 0);transform:translate(3px,0)}
    40%{clip-path:inset(50% 0 30% 0);transform:translate(-3px,0)}
    60%{clip-path:inset(10% 0 80% 0);transform:translate(3px,0)}
    80%{clip-path:inset(60% 0 10% 0);transform:translate(-3px,0)}
    100%{clip-path:inset(0 0 0 0);transform:translate(0)}
  }

  .reveal {
    opacity:0; transform:translateY(30px);
    transition: opacity .72s cubic-bezier(.25,.46,.45,.94),
                transform .72s cubic-bezier(.25,.46,.45,.94);
  }
  .reveal.in { opacity:1; transform:translateY(0); }

  .card {
    border-radius:22px;
    border:1px solid var(--line);
    background: var(--bg2);
    transition: transform .4s cubic-bezier(.34,1.56,.64,1), border-color .3s;
  }
  .card:hover { transform:translateY(-7px) scale(1.015); }

  .mono-pill {
    display:inline-block;
    font-family: var(--mono);
    font-size:10px; letter-spacing:.1em; text-transform:uppercase;
    padding:3px 10px; border-radius:100px;
    border:1px solid currentColor;
    opacity:.7;
  }

  .tab-btn {
    font-family: var(--mono); font-size:11px; letter-spacing:.08em;
    padding:8px 18px; border-radius:100px;
    border:1px solid var(--line);
    background:transparent; color: var(--fg2);
    cursor:pointer;
    transition: all .2s;
  }
  .tab-btn.active { background: var(--b); border-color: var(--b); color:#fff; }
  .tab-btn:hover:not(.active) { border-color: var(--fg2); color: var(--fg); }

  .noise-fixed {
    position:fixed; inset:-50%; width:200%; height:200%;
    background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
    opacity:.018; pointer-events:none; z-index:9999;
    animation: noise .6s steps(1) infinite;
  }

  .scanlines {
    position:fixed; inset:0;
    background: repeating-linear-gradient(0deg,transparent 0px,transparent 3px,rgba(108,95,255,.012) 3px,rgba(108,95,255,.012) 6px);
    pointer-events:none; z-index:9998;
  }

  .section-pad { padding: 0 clamp(24px,6vw,96px) 96px; }

  .occult-mode {
    --bg: #030305;
    --bg2: #080808;
    --bg3: #0a0a0a;
    --fg: #33ff77;
    --fg2: #22cc55;
    --fg3: #116633;
    --b: #33ff77;
    --o: #33ff77;
    --g: #33ff77;
    --line: rgba(0,255,0,0.08);
  }
  .occult-mode body, .occult-mode { font-family: var(--code); }

  .glitch-overlay {
    position:fixed; inset:0; z-index:99999;
    background: repeating-linear-gradient(0deg, transparent, transparent 10px, rgba(0,255,0,0.15) 10px, rgba(0,255,0,0.15) 20px);
    animation: glitchIn 0.4s ease; pointer-events:none;
  }

  @media (max-width: 768px) {
    .hide-mobile { display: none !important; }
  }

  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
    .noise-fixed, .scanlines { display: none; }
  }
`;

// ─── HELPERS ───────────────────────────────────────────────────
function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { el.classList.add("in"); obs.disconnect(); } },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

function useIsMobile() {
  const [m, setM] = useState(false);
  useEffect(() => {
    const check = () => setM(window.innerWidth < 768 || 'ontouchstart' in window);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);
  return m;
}

function Cursor() {
  const mobile = useIsMobile();
  const dot = useRef(), ring = useRef();
  const [h, setH] = useState(false);
  const [behelit, setBehelit] = useState(false);

  useEffect(() => {
    if (mobile) return;
    let x=0,y=0,rx=0,ry=0,raf;
    const mv = e => { x=e.clientX; y=e.clientY; };
    const en = e => {
      if(e.target.closest("a,button,[data-h]")) {
        setH(true);
        setBehelit(Math.random() < 0.03);
      }
    };
    const lv = e => { if(e.target.closest("a,button,[data-h]")) { setH(false); setBehelit(false); } };
    window.addEventListener("mousemove",mv);
    document.addEventListener("mouseenter",en,true);
    document.addEventListener("mouseleave",lv,true);
    const loop=()=>{
      rx+=(x-rx)*.13; ry+=(y-ry)*.13;
      if(dot.current) dot.current.style.transform=`translate(${x}px,${y}px)`;
      if(ring.current) ring.current.style.transform=`translate(${rx}px,${ry}px)`;
      raf=requestAnimationFrame(loop);
    };
    loop();
    return ()=>{ window.removeEventListener("mousemove",mv); cancelAnimationFrame(raf); };
  }, [mobile]);

  if (mobile) return null;

  if (behelit) {
    return (
      <>
        <div ref={dot} style={{position:"fixed",top:0,left:0,zIndex:100000,marginLeft:-10,marginTop:-10,pointerEvents:"none",fontSize:20,lineHeight:"20px",filter:"drop-shadow(0 0 6px #ff5c8a)"}}>♠</div>
        <div ref={ring} style={{position:"fixed",top:0,left:0,zIndex:99999,width:52,height:52,border:"1.5px solid rgba(255,92,138,.6)",borderRadius:"50%",marginLeft:-26,marginTop:-26,pointerEvents:"none",transition:"all .3s"}}/>
      </>
    );
  }

  const ds = h?12:7, rm = h?-6:-3.5;
  const rs = h?52:34, rrm = h?-26:-17;
  return (
    <>
      <div ref={dot} style={{position:"fixed",top:0,left:0,zIndex:100000,width:ds,height:ds,background:h?"#6c5fff":"#fff",borderRadius:"50%",marginLeft:rm,marginTop:rm,pointerEvents:"none",mixBlendMode:"difference",transition:"width .2s,height .2s,margin .2s,background .2s"}}/>
      <div ref={ring} style={{position:"fixed",top:0,left:0,zIndex:99999,width:rs,height:rs,border:`1.5px solid ${h?"rgba(108,95,255,.85)":"rgba(255,255,255,.25)"}`,borderRadius:"50%",marginLeft:rrm,marginTop:rrm,pointerEvents:"none",transition:"width .3s,height .3s,margin .3s,border-color .3s"}}/>
    </>
  );
}

// ─── DECORATIVE PRIMITIVES ─────────────────────────────────────
// 레퍼런스 DNA: 정보 밀도↑ · 액센트색↓ · UI 치장↑

function MetaStrip({ items, color = "var(--fg3)", align = "left", style = {} }) {
  return (
    <div style={{
      display:"flex",gap:14,flexWrap:"wrap",
      justifyContent: align==="right"?"flex-end":align==="center"?"center":"flex-start",
      alignItems:"center",fontFamily:"var(--mono)",fontSize:9,letterSpacing:".12em",
      color,textTransform:"uppercase",...style,
    }}>
      {items.map((it,i)=>(
        <span key={i} style={{display:"inline-flex",alignItems:"center",gap:5}}>
          {it.label && <span style={{opacity:.5}}>{it.label}</span>}
          <span style={{color:it.accent||color,opacity:.92,letterSpacing:".08em"}}>{it.value}</span>
        </span>
      ))}
    </div>
  );
}

function Stamp({ text, subtext, color = "#ef4444", size = 78, rotate = -12, style = {} }) {
  return (
    <div style={{
      width:size,height:size,borderRadius:"50%",
      border:`2px solid ${color}`,
      display:"inline-flex",alignItems:"center",justifyContent:"center",flexDirection:"column",
      color,fontFamily:"var(--mono)",
      transform:`rotate(${rotate}deg)`,
      opacity:.7,textAlign:"center",padding:4,
      boxShadow:`inset 0 0 0 1px ${color}33`,
      ...style,
    }}>
      <div style={{fontSize: size<56?8:10,fontWeight:800,letterSpacing:".18em",lineHeight:1.1}}>{text}</div>
      {subtext && <div style={{fontSize:6.5,marginTop:3,opacity:.7,letterSpacing:".1em"}}>{subtext}</div>}
    </div>
  );
}

function PropSVG({ type, size = 140, color = "#ff5c8a", opacity = 0.12, rotate = 0, style = {} }) {
  const shapes = {
    chain: (
      <g stroke={color} strokeWidth="2" fill="none">
        <ellipse cx="24" cy="24" rx="14" ry="8" transform="rotate(-30 24 24)"/>
        <ellipse cx="46" cy="46" rx="14" ry="8" transform="rotate(60 46 46)"/>
        <ellipse cx="68" cy="68" rx="14" ry="8" transform="rotate(-30 68 68)"/>
        <ellipse cx="90" cy="90" rx="14" ry="8" transform="rotate(60 90 90)"/>
      </g>
    ),
    card: (
      <g fill="none" stroke={color} strokeWidth="1.8">
        <rect x="22" y="10" width="62" height="92" rx="7"/>
        <text x="29" y="30" fontSize="13" fontFamily="serif" fill={color}>A</text>
        <text x="36" y="62" fontSize="30" fontFamily="serif" fill={color}>♠</text>
        <text x="68" y="98" fontSize="13" fontFamily="serif" fill={color} transform="rotate(180 72 94)">A</text>
      </g>
    ),
    egg: (
      <g stroke={color} fill="none" strokeWidth="1.5">
        <ellipse cx="60" cy="64" rx="34" ry="46"/>
        <ellipse cx="52" cy="54" rx="3.5" ry="5.5" fill={color}/>
        <ellipse cx="68" cy="54" rx="3.5" ry="5.5" fill={color}/>
        <path d="M48 78 Q60 88 72 78"/>
        <circle cx="60" cy="64" r="22" strokeDasharray="2,4" opacity=".5"/>
      </g>
    ),
    sigil: (
      <g stroke={color} strokeWidth="1.3" fill="none">
        <circle cx="60" cy="60" r="50"/>
        <circle cx="60" cy="60" r="38"/>
        <polygon points="60,22 94,80 26,80"/>
        <polygon points="60,98 26,40 94,40"/>
        <circle cx="60" cy="60" r="6" fill={color}/>
      </g>
    ),
    blade: (
      <g stroke={color} fill="none" strokeWidth="1.6">
        <path d="M18 104 L72 30 L82 40 L28 114 Z"/>
        <rect x="66" y="26" width="24" height="8" rx="2"/>
        <line x1="20" y1="102" x2="26" y2="108"/>
      </g>
    ),
    barcode: (
      <g fill={color}>
        {[3,7,9,12,18,22,24,28,32,38,42,46,50,56,60,64,70,74,78,84,90,96,102,108,113].map((x,i)=>(
          <rect key={i} x={x} y="28" width={i%3===0?2.4:1.2} height="64"/>
        ))}
      </g>
    ),
    handcuff: (
      <g stroke={color} fill="none" strokeWidth="2">
        <circle cx="36" cy="60" r="24"/>
        <circle cx="36" cy="60" r="16"/>
        <circle cx="86" cy="60" r="24"/>
        <circle cx="86" cy="60" r="16"/>
        <line x1="58" y1="60" x2="64" y2="60"/>
      </g>
    ),
    dots: (
      <g fill={color}>
        {Array.from({length:16}).map((_,r)=>
          Array.from({length:16}).map((_,c)=>(
            <circle key={`${r}-${c}`} cx={8+c*7} cy={8+r*7} r={((r+c)%3===0)?1.2:0.5}/>
          ))
        )}
      </g>
    ),
  };

  return (
    <svg width={size} height={size} viewBox="0 0 120 120" style={{
      transform:`rotate(${rotate}deg)`,pointerEvents:"none",opacity,...style,
    }}>
      {shapes[type] || null}
    </svg>
  );
}

function GlitchError({ text = "Click 'Fix' to fix error.", title = "Error", style = {} }) {
  return (
    <div style={{
      display:"inline-block",background:"#d4d0c8",color:"#000",
      fontFamily:"'Courier New', monospace",fontSize:10.5,
      border:"2px outset #f0f0f0",
      boxShadow:"2px 2px 0 rgba(0,0,0,.4)",
      minWidth:220,userSelect:"none",...style,
    }}>
      <div style={{
        background:"linear-gradient(to right,#000080,#1084d0)",color:"#fff",
        padding:"3px 6px 3px 8px",display:"flex",justifyContent:"space-between",alignItems:"center",
        fontSize:11,fontWeight:700,
      }}>
        <span>{title}</span>
        <span style={{padding:"0 5px",background:"#c0c0c0",color:"#000",border:"1px outset #fff",fontWeight:400}}>×</span>
      </div>
      <div style={{padding:"12px 14px 10px"}}>
        <div style={{display:"flex",gap:10,alignItems:"center"}}>
          <div style={{width:28,height:28,borderRadius:"50%",background:"#c00",color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,fontSize:18,flexShrink:0}}>×</div>
          <span>{text}</span>
        </div>
        <div style={{textAlign:"center",marginTop:10}}>
          <span style={{display:"inline-block",padding:"2px 18px",border:"1px outset #f0f0f0",background:"#c0c0c0",fontSize:11}}>Fix</span>
        </div>
      </div>
    </div>
  );
}

function Splatter({ color = "#ff5c8a", opacity = 0.18, size = 300, style = {} }) {
  // 페인트 튀김 — 비대칭 원 다수로 질감
  return (
    <svg width={size} height={size} viewBox="0 0 300 300" style={{pointerEvents:"none",opacity,...style}}>
      <g fill={color}>
        <circle cx="50" cy="80" r="22"/>
        <circle cx="140" cy="60" r="6"/>
        <circle cx="200" cy="120" r="14"/>
        <circle cx="90" cy="180" r="9"/>
        <circle cx="240" cy="220" r="18"/>
        <circle cx="170" cy="250" r="4"/>
        <circle cx="60" cy="240" r="12"/>
        <circle cx="220" cy="60" r="3"/>
        <circle cx="120" cy="140" r="2.5"/>
        <circle cx="260" cy="160" r="5"/>
        <path d="M40 100 Q60 110 80 95 T140 100" stroke={color} strokeWidth="2" fill="none"/>
        <path d="M180 190 Q210 180 240 195" stroke={color} strokeWidth="1.5" fill="none"/>
      </g>
    </svg>
  );
}

// ─── NAV ───────────────────────────────────────────────────────
function Nav({ mode, onToggle, lang, onLangToggle }) {
  const [sc, setSc] = useState(false);
  useEffect(()=>{
    const fn=()=>setSc(window.scrollY>50);
    window.addEventListener("scroll",fn);
    return()=>window.removeEventListener("scroll",fn);
  },[]);

  const sections = mode === "surface"
    ? ["Now","Works","Depth","Creator","Schedule","Contact"]
    : ["Apps","Upcoming","Philosophy","Contact"];

  const scrollTo = (id) => {
    const el = document.getElementById(id.toLowerCase());
    if (!el) return;
    const navH = 60;
    const y = el.getBoundingClientRect().top + window.scrollY - navH;
    window.scrollTo({ top: y, behavior: "smooth" });
  };

  return (
    <nav style={{
      position:"fixed",top:0,left:0,right:0,zIndex:1000,
      padding:"14px clamp(24px,6vw,96px)",
      display:"flex",justifyContent:"space-between",alignItems:"center",
      background: sc?"rgba(7,7,15,.88)":"transparent",
      backdropFilter: sc?"blur(20px)":"none",
      borderBottom: sc?"1px solid var(--line)":"1px solid transparent",
      transition:"all .4s",
    }}>
      <div style={{fontFamily:"var(--mono)",fontSize:12,letterSpacing:".1em",color:"var(--fg2)"}}>
        {mode==="surface" ? (
          <><span style={{color:"var(--b)"}}>BHL</span><span style={{color:"var(--fg3)"}}> × </span><span style={{color:"var(--o)"}}>OCC</span></>
        ) : (
          <span style={{color:"#0f0",textShadow:"0 0 5px #0f0"}}>OCCULT_AI</span>
        )}
      </div>
      <div style={{display:"flex",gap:16,alignItems:"center"}}>
        {sections.map(n=>(
          <span key={n} data-h onClick={()=>scrollTo(n)} style={{fontFamily:"var(--mono)",fontSize:10,letterSpacing:".15em",color:"var(--fg3)",textTransform:"uppercase",cursor:"pointer",transition:"color .2s"}}
            onMouseEnter={e=>e.target.style.color=mode==="surface"?"#fff":"#0f0"} onMouseLeave={e=>e.target.style.color="var(--fg3)"}>{n}</span>
        ))}

        <div data-h onClick={onLangToggle} style={{
          display:"inline-flex",alignItems:"center",gap:0,
          borderRadius:100,border:"1px solid var(--line)",overflow:"hidden",cursor:"pointer",
        }}>
          <span style={{
            fontFamily:"var(--mono)",fontSize:10,padding:"5px 10px",
            background: lang==="kr" ? (mode==="surface"?"rgba(108,95,255,.2)":"rgba(0,255,0,.15)") : "transparent",
            color: lang==="kr" ? (mode==="surface"?"#fff":"#0f0") : "var(--fg3)",
            transition:"all .2s",letterSpacing:".06em",
          }}>KR</span>
          <span style={{
            fontFamily:"var(--mono)",fontSize:10,padding:"5px 10px",
            background: lang==="ja" ? (mode==="surface"?"rgba(255,92,138,.2)":"rgba(0,255,0,.15)") : "transparent",
            color: lang==="ja" ? (mode==="surface"?"#fff":"#0f0") : "var(--fg3)",
            transition:"all .2s",letterSpacing:".06em",
          }}>JA</span>
        </div>

        <button data-h onClick={onToggle} style={{
          fontFamily:"var(--mono)",fontSize:10,letterSpacing:".08em",
          padding:"6px 14px",borderRadius:100,cursor:"pointer",
          border: mode==="surface" ? "1px solid rgba(0,255,0,.3)" : "1px solid rgba(108,95,255,.3)",
          background: mode==="surface" ? "rgba(0,255,0,.06)" : "rgba(108,95,255,.06)",
          color: mode==="surface" ? "#0f0" : "#6c5fff",
          transition:"all .3s",
        }}>
          {mode==="surface" ? "> 문을 열까?" : "돌아가기"}
        </button>
      </div>
    </nav>
  );
}

// ─── HERO ─────────────────────────────────────────────────────
function Hero({ mode, lang }) {
  const [ri, setRi] = useState(0);
  const roles = {
    kr: ["개발자", "기획자", "창작자"],
    ja: ["デベロッパー", "プランナー", "クリエイター"],
  };
  const colors = ["#6c5fff","#ff5c8a","#3dffb0"];
  useEffect(()=>{
    const t=setInterval(()=>setRi(p=>(p+1)%3),2400);
    return()=>clearInterval(t);
  },[]);

  if (mode === "occult") {
    return (
      <section style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",position:"relative",padding:"0 clamp(24px,6vw,96px)",textAlign:"center"}}>
        <div style={{animation:"fadeIn 1s ease .2s both"}}>
          <pre style={{fontFamily:"var(--code)",fontSize:"clamp(10px,1.2vw,14px)",color:"#0f0",opacity:.5,letterSpacing:2,lineHeight:1.6,marginBottom:32}}>
{`╔═══════════════════════╗
║  DIGITAL  OCCULTISM  ║
╚═══════════════════════╝`}
          </pre>
          <h1 style={{fontFamily:"var(--serif)",fontSize:"clamp(36px,7vw,80px)",fontWeight:700,color:"#0f0",textShadow:"0 0 30px rgba(0,255,0,.3)",marginBottom:16,lineHeight:1}}>
            神秘とAIの境界
          </h1>
          <p style={{fontFamily:"var(--mono)",fontSize:"clamp(13px,1.4vw,16px)",color:"#22cc55",lineHeight:1.9,maxWidth:600,margin:"0 auto 32px"}}>
            オカルトとAI、科学と神秘──<br/>
            相反するはずのこの二つは、奇妙なほどによく似ている。<br/>
            デジタルの深淵で、何かが待っている。
          </p>
          <div style={{display:"flex",gap:8,justifyContent:"center",flexWrap:"wrap"}}>
            {["Flutter","Defold","Local LLM","Stable Diffusion","Multi-GPU"].map(t=>(
              <span key={t} style={{fontFamily:"var(--mono)",fontSize:10,padding:"4px 12px",border:"1px solid rgba(0,255,0,.25)",borderRadius:100,color:"#22cc55"}}>
                {t}
              </span>
            ))}
          </div>
          <div style={{marginTop:28,display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
            <span style={{fontFamily:"var(--mono)",fontSize:12,color:"#116633"}}>$</span>
            <span style={{fontFamily:"var(--mono)",fontSize:13,color:"#33ff77"}}>
              {(lang==="kr" ? roles.kr : roles.ja)[ri]}
            </span>
            <span style={{animation:"blink 1.2s step-start infinite",color:"#33ff77",fontSize:13}}>▮</span>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section style={{minHeight:"100vh",display:"flex",alignItems:"center",position:"relative",padding:"0 clamp(24px,6vw,96px)",overflow:"hidden"}}>
      <div style={{position:"absolute",top:"15%",right:"5%",width:"45vw",height:"45vw",maxWidth:600,background:"radial-gradient(ellipse,rgba(108,95,255,.06) 0%,transparent 70%)",pointerEvents:"none"}}/>
      <div style={{position:"absolute",bottom:"10%",left:"-5%",width:"35vw",height:"35vw",maxWidth:450,background:"radial-gradient(ellipse,rgba(255,92,138,.04) 0%,transparent 70%)",pointerEvents:"none"}}/>

      <div style={{maxWidth:1100,width:"100%",position:"relative",zIndex:2}}>
        <div style={{animation:"fadeIn .8s ease .1s both",marginBottom:44}}>
          <div style={{display:"inline-flex",alignItems:"center",gap:8,padding:"5px 14px",borderRadius:100,border:"1px solid rgba(61,255,176,.2)",background:"rgba(61,255,176,.04)"}}>
            <span style={{width:6,height:6,borderRadius:"50%",background:"#3dffb0",boxShadow:"0 0 0 0 rgba(61,255,176,.6)",animation:"pulse-r 2s ease infinite",display:"inline-block"}}/>
            <span style={{fontFamily:"var(--mono)",fontSize:10,color:"#3dffb0",letterSpacing:".1em"}}>2026 · Open to Opportunity</span>
          </div>
        </div>

        <div style={{animation:"fadeUp .9s ease .2s both",marginBottom:8}}>
          <div style={{fontFamily: lang==="ja"?"var(--serif)":"var(--sans)",fontSize:"clamp(64px,11vw,140px)",fontWeight: lang==="ja"?700:800,lineHeight:.92,letterSpacing: lang==="ja"?"0":"-.04em",color:"#fff"}}>
            {lang==="kr" ? "이수현" : "イ・スヒョン"}
          </div>
          <div style={{fontFamily: lang==="ja"?"var(--sans)":"var(--serif)",fontSize:"clamp(18px,2.2vw,28px)",fontWeight:300,color:"var(--fg2)",letterSpacing:".06em",marginTop:10,marginLeft:4}}>
            {lang==="kr" ? "イ・スヒョン" : "이수현"}
          </div>
        </div>

        <div style={{animation:"fadeUp .9s ease .35s both",marginTop:28,marginBottom:32,display:"flex",gap:12,flexWrap:"wrap"}}>
          <div style={{display:"inline-flex",alignItems:"center",gap:8,padding:"7px 16px",borderRadius:100,background:"rgba(108,95,255,.12)",border:"1px solid rgba(108,95,255,.3)"}}>
            <span style={{fontFamily:"var(--mono)",fontSize:10,color:"var(--b)",letterSpacing:".1em"}}>BEHELIT</span>
            <span style={{fontFamily:"var(--serif)",fontSize:11,color:"rgba(108,95,255,.6)"}}>{lang==="kr" ? "기획 · 창작" : "企画 · 創作"}</span>
          </div>
          <div style={{display:"inline-flex",alignItems:"center",gap:8,padding:"7px 16px",borderRadius:100,background:"rgba(255,92,138,.1)",border:"1px solid rgba(255,92,138,.3)"}}>
            <span style={{fontFamily:"var(--mono)",fontSize:10,color:"var(--o)",letterSpacing:".1em"}}>OCCULTAI</span>
            <span style={{fontFamily:"var(--serif)",fontSize:11,color:"rgba(255,92,138,.6)"}}>{lang==="kr" ? "개발 · AI활용" : "開発 · AI活用"}</span>
          </div>
        </div>

        <div style={{animation:"fadeUp .9s ease .45s both"}}>
          <h1 style={{fontFamily: lang==="ja"?"var(--serif)":"var(--sans)",fontSize:"clamp(28px,5.5vw,80px)",fontWeight: lang==="ja"?700:800,lineHeight:1.1,letterSpacing: lang==="ja"?"0":"-.03em",color:"#fff",marginBottom:6,whiteSpace:"nowrap"}}>
            {lang==="kr" ? "코드 한 줄로 세계를" : "コード一つで世界を"}
          </h1>
          <h1 style={{fontFamily: lang==="ja"?"var(--serif)":"var(--sans)",fontSize:"clamp(28px,5.5vw,80px)",fontWeight: lang==="ja"?700:800,lineHeight:1.1,letterSpacing: lang==="ja"?"0":"-.03em",
            background:"linear-gradient(135deg,#6c5fff 0%,#ff5c8a 50%,#ffb347 100%)",
            backgroundSize:"200%",animation:"shimmer 6s linear infinite",
            WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",marginBottom:4,whiteSpace:"nowrap",
          }}>
            {lang==="kr" ? "망가뜨리고 다시 짓는다" : "壊してまた建てる"}
          </h1>
          <div style={{fontFamily: lang==="ja"?"var(--sans)":"var(--serif)",fontSize:"clamp(16px,1.8vw,20px)",fontWeight:300,color:"var(--fg2)",letterSpacing:".04em",marginTop:8}}>
            {lang==="kr" ? "壊してまた建てる" : "코드 한 줄로 세계를 망가뜨리고 다시 짓는다"}
          </div>
        </div>

        <div style={{animation:"fadeUp .9s ease .6s both",marginTop:32,display:"flex",alignItems:"center",gap:14,whiteSpace:"nowrap"}}>
          <span style={{fontFamily:"'Instrument Serif',serif",fontStyle:"italic",fontSize:18,color:"var(--fg2)"}}>{lang==="kr" ? "I am a" : "私は"}</span>
          <div style={{position:"relative",height:36,minWidth:130}}>
            {(lang==="kr" ? roles.kr : roles.ja).map((r,i)=>(
              <div key={r} style={{
                position:"absolute",inset:0,display:"flex",gap:8,alignItems:"center",
                opacity:ri===i?1:0,
                transform:ri===i?"translateY(0)":"translateY(14px)",
                transition:"all .55s cubic-bezier(.34,1.56,.64,1)",
              }}>
                <span style={{fontFamily:"var(--sans)",fontSize:22,fontWeight:700,color:colors[i],lineHeight:"36px"}}>{r}</span>
                <span style={{fontFamily:"var(--serif)",fontSize:14,color:`${colors[i]}80`,lineHeight:"36px"}}>{lang==="kr" ? roles.ja[i] : roles.kr[i]}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{animation:"fadeUp .9s ease .75s both",marginTop:48}}>
          <InteractiveTimeline lang={lang} />
        </div>
      </div>
    </section>
  );
}

// ─── INTERACTIVE TIMELINE ─────────────────────────────────────
function InteractiveTimeline({ lang }) {
  const [expanded, setExpanded] = useState(false);
  const milestones = [
    { year:"2012", kr:"게임세계 입문", ja:"ゲーム業界入門", color:"#6c5fff", detail_kr:"세계관 설계·기획 학습 시작", detail_ja:"世界観設計·企画学習開始" },
    { year:"2018", kr:"역사·무역 전공", ja:"歴史·貿易専攻", color:"#ff5c8a", detail_kr:"거시적 세계 분석 관점 형성", detail_ja:"巨視的世界分析の視点形成" },
    { year:"2022", kr:"첫 React 게임 (망함)", ja:"初Reactゲーム (失敗)", color:"#ff4444", detail_kr:"완전히 망한 첫 시도. 근데 이때 배운 게 제일 많았다", detail_ja:"完全に失敗した最初の試み。でもこの時が一番学んだ" },
    { year:"2023", kr:"코딩 독학 시작", ja:"コーディング独学開始", color:"#ffb347", detail_kr:"React, Flutter, Python", detail_ja:"React, Flutter, Python" },
    { year:"2024", kr:"로컬 LLM 구축", ja:"ローカルLLM構築", color:"#a78bfa", detail_kr:"멀티GPU + Stable Diffusion", detail_ja:"マルチGPU + Stable Diffusion" },
    { year:"2025", kr:"앱 출시 (3종)", ja:"アプリリリース(3本)", color:"#3dffb0", detail_kr:"Google Play 3개 앱 출시", detail_ja:"Google Playに3本リリース" },
    { year:"2026", kr:"AI업계 진출", ja:"AI業界進出", color:"#3dffb0", detail_kr:"새로운 챕터 시작", detail_ja:"新しいチャプター開始" },
  ];

  const short = [milestones[0], milestones[milestones.length-1]];
  const display = expanded ? milestones : short;

  return (
    <div style={{display:"inline-flex",flexDirection:"column",gap:12}}>
      <div data-h onClick={()=>setExpanded(!expanded)} style={{
        display:"inline-flex",alignItems:"center",gap:0,padding:"14px 20px",borderRadius:16,
        border:"1px solid var(--line)",background:"rgba(255,255,255,.02)",
        cursor:"pointer",transition:"border-color .3s",flexWrap:"wrap",
      }}>
        {display.map((s,i)=>(
          <div key={s.year} style={{display:"flex",alignItems:"center"}}>
            {i>0 && <span style={{fontFamily:"var(--mono)",fontSize:14,color:"var(--fg3)",margin:"0 12px"}}>→</span>}
            <div style={{display:"flex",flexDirection:"column",gap:2,alignItems:"center",minWidth:80}}>
              <div style={{display:"flex",alignItems:"center",gap:6}}>
                <span style={{width:7,height:7,borderRadius:"50%",background:s.color,boxShadow:`0 0 8px ${s.color}`,display:"inline-block"}}/>
                <span style={{fontFamily:"var(--mono)",fontSize:13,fontWeight:500,color:s.color,letterSpacing:".06em"}}>{s.year}</span>
              </div>
              <div style={{fontFamily:"var(--sans)",fontSize:12,fontWeight:600,color:"var(--fg)",textAlign:"center"}}>{lang==="kr" ? s.kr : s.ja}</div>
              <div style={{fontFamily:"var(--serif)",fontSize:10,color:"var(--fg2)",letterSpacing:".04em",textAlign:"center"}}>{lang==="kr" ? s.ja : s.kr}</div>
              {expanded && <div style={{fontFamily:"var(--mono)",fontSize:9,color:"var(--fg3)",marginTop:2}}>{lang==="kr" ? s.detail_kr : s.detail_ja}</div>}
            </div>
          </div>
        ))}
      </div>
      <span style={{fontFamily:"var(--mono)",fontSize:9,color:"var(--fg3)",letterSpacing:".1em",cursor:"pointer"}} onClick={()=>setExpanded(!expanded)}>
        {expanded ? (lang==="kr" ? "▲ 접기" : "▲ 閉じる") : (lang==="kr" ? "▼ 14년의 여정 보기 · 旅を見る" : "▼ 14年の旅を見る · 여정 보기")}
      </span>
    </div>
  );
}

// ─── MARQUEE ──────────────────────────────────────────────────
function Marquee({ items, speed=38 }) {
  const d = [...items,...items];
  return (
    <div style={{overflow:"hidden",display:"flex"}}>
      <div style={{display:"flex",gap:48,whiteSpace:"nowrap",animation:`marquee ${speed}s linear infinite`,willChange:"transform"}}>
        {d.map((it,i)=>(
          <span key={it+i} style={{fontFamily:"var(--mono)",fontSize:11,color:"var(--fg3)",letterSpacing:".14em",textTransform:"uppercase",display:"flex",alignItems:"center",gap:20}}>
            {it}<span style={{color:"var(--b)",opacity:.4}}>◆</span>
          </span>
        ))}
      </div>
    </div>
  );
}

function TechMarquee() {
  const items = ["React 19","Flutter","Defold","Canvas API","Web Audio","Local LLM","Stable Diffusion","Multi-GPU","Python","i18n KR/JA","useReducer","State Machine","새벽 4시 디버깅","Failed to compile","Roguelike","Procedural Gen","커피 === 연료"];
  return (
    <div style={{padding:"28px 0",borderTop:"1px solid var(--line)",borderBottom:"1px solid var(--line)",margin:"72px 0"}}>
      <Marquee items={items}/>
    </div>
  );
}

// ─── STATS BAR ────────────────────────────────────────────────
function StatsBar({ lang }) {
  const ref = useReveal();
  const stats = [
    { num:"14",   label_kr:"Years Game Industry", label_ja:"年 ゲーム業界",       accent:"#6c5fff" },
    { num:"3",    label_kr:"Published Apps",      label_ja:"リリース済みアプリ",   accent:"#3dffb0" },
    { num:"10",   label_kr:"Web Showcases",       label_ja:"Webショーケース",      accent:"#ff5c8a" },
    { num:"#15",  label_kr:"CivitAI Top Trainer", label_ja:"CivitAI トップ #15",   accent:"#ef4444" },
    { num:"2",    label_kr:"Languages (KR/JA)",   label_ja:"言語 (KR/JA)",         accent:"#ffb347" },
    { num:"×2",   label_kr:"GPUs @ Home",         label_ja:"自宅GPU",               accent:"#22d3ee" },
    { num:"∞",    label_kr:"Coffee Loop",         label_ja:"コーヒーループ",        accent:"var(--fg3)" },
  ];
  return (
    <div ref={ref} className="reveal section-pad" style={{paddingBottom:0}}>
      <div style={{
        padding:"30px 38px 24px",borderRadius:20,border:"1px solid var(--line)",
        background:"rgba(255,255,255,.02)",position:"relative",overflow:"hidden",
      }}>
        <PropSVG type="dots" size={160} color="#ffffff" opacity={.04} style={{position:"absolute",top:-20,right:-20}}/>
        <div style={{
          display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(120px,1fr))",gap:20,position:"relative",zIndex:1,
        }}>
          {stats.map((s,i)=>(
            <div key={i} style={{textAlign:"center",padding:"4px 0",borderRight: i<stats.length-1?"1px dashed rgba(255,255,255,.05)":"none"}}>
              <div style={{fontFamily:"var(--sans)",fontSize:"clamp(26px,3.4vw,44px)",fontWeight:800,
                background:`linear-gradient(135deg,#fff 30%,${s.accent} 140%)`,
                WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",lineHeight:1,marginBottom:5,
              }}>{s.num}</div>
              <div style={{fontFamily:"var(--mono)",fontSize:9,color:"var(--fg3)",letterSpacing:".12em",textTransform:"uppercase",lineHeight:1.4}}>{lang==="kr" ? s.label_kr : s.label_ja}</div>
            </div>
          ))}
        </div>
        <div style={{marginTop:18,paddingTop:14,borderTop:"1px dashed rgba(255,255,255,.04)",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:10}}>
          <MetaStrip items={[
            {label:"SN",  value:"BHL-2026-STATS"},
            {label:"REV", value:"0042"},
          ]}/>
          <MetaStrip items={[
            {label:"UPDATED", value:new Date().toISOString().slice(0,10)},
            {label:"TZ",      value:"KST+09"},
          ]} align="right"/>
        </div>
      </div>
    </div>
  );
}

// ─── PROJECTS (Surface) ───────────────────────────────────────
const PROJECTS = [
  {
    featured: true,
    icon:"📱", color:"#4fc3f7",
    title:"Fate: Lost Log",
    ja:"破滅の杖 × 無限の壁製",
    sub:"파티 로그라이크 · パーティローグライク",
    problem:"4인 파티의 동시 세트 콤보 처리에서 상태 동기화 이슈 발생. 비결정적 버그가 디버깅을 지연시킴.",
    solution:"useReducer + Context로 전투 상태를 단일 진실 원천(SSoT)으로 통합. 액션 디스패치 단위로 상태 추적 가능하게 재구성.",
    result:"상태 충돌 0건, 10층 다분기 던전 시스템과 NG+ 엔딩까지 안정적으로 구현. 한일 동시 출시.",
    tags:["useReducer","createContext","Web Audio","i18n"],
    snippet:`// 콤보 확률 — 유대 수치 기반 결정론적 트리거
const syn = 1 + state.synergy * 0.01;
if (bond >= 15 && Math.random() < 0.25)
  dispatch({ type:"COMBO" });`,
  },
  {
    featured: true,
    icon:"⬡", color:"#3dffb0",
    title:"Project Genesis",
    ja:"ニューラル同期コア",
    sub:"사이버펑크 ARG · サイバーパンクARG",
    link:"https://pgenesis.netlify.app/",
    problem:"7개 페이즈 비선형 진행 + 카르마 분기 조합으로 상태 폭발. 페이즈 간 전이 조건이 중복·누락되는 문제.",
    solution:"FSM(유한 상태 머신) 패턴 도입. 페이즈·카르마를 단일 Context로 통합 관리, 전이 규칙 명시화.",
    result:"카르마 기반 2종 엔딩 분기 + 암호 해제 시스템 안정 구현. 비선형 시나리오 설계의 재사용 패턴 확립.",
    tags:["Context API","State Machine","Karma","7-Phase"],
    snippet:`// 카르마 기반 페이즈 전이
case "UNLOCK":
  const karma = calcKarma(s.flags);
  return { ...s, phase: karma > 0
    ? "liberation" : "assimilation" };`,
  },
  {
    featured: true,
    icon:"☣", color:"#ff7a50",
    title:"DeadZone II",
    ja:"最終後127日",
    sub:"좀비 서바이벌 · ゾンビサバイバル",
    link:"https://deadsignalarg.netlify.app/",
    problem:"Canvas 위에서 AI·시야·소리 전파를 동시 처리 시 좀비 20+에서 프레임 드롭. O(N²) 충돌 검사가 병목.",
    solution:"공간 분할(Spatial Partitioning) 도입. 시야 체크 범위 한정, 소리 전파를 이벤트 큐 기반으로 분리.",
    result:"좀비 100+ 환경에서 60fps 유지. Fog of War, 낮/밤 사이클, 절차적 맵 생성까지 단일 파일로 완성.",
    tags:["Canvas API","60fps","Spatial Partition","Fog of War"],
    snippet:`// 시야 + 소리 전파 — 공간 분할 후
if (dist < FOG_BASE && lineOfSight(z, p)) {
  alertNearby(z.pos, NOISE_PROPAGATE);
  z.alerted = true;
}`,
  },
  {
    featured: true,
    icon:"⚔", color:"#a78bfa",
    title:"Setanta Rising",
    ja:"少年は英雄になれるか",
    sub:"성장 시뮬레이션 · 育成シミュレーション",
    link:"https://setamaker.netlify.app/",
    problem:"훈련·전투·애정·NPC 대화 4개 시스템 간 결합도 증가. 한 시스템 수정이 다른 시스템 회귀를 유발.",
    solution:"각 시스템을 커스텀 훅으로 분리, 단일 디스패치 파이프라인으로 통합. 시스템 간 의존성을 데이터로만 노출.",
    result:"60일 육성 루프, 10종 엔딩 분기, NG+ 시스템까지 모듈식으로 구현. 시스템 추가가 기존 코드에 영향 없음.",
    tags:["Simulation","Custom Hooks","Multi-ending","Decoupled"],
    snippet:`// 훈련 → 다중 스탯 반영, 시스템 간 격리
Object.entries(TRAINING[choice]).forEach(
  ([stat, delta]) =>
    setStats(s => ({...s, [stat]: s[stat]+delta}))
);`,
  },
  {
    featured: true,
    icon:"📄", color:"#38BDF8",
    title:"Live Platform LP",
    ja:"ランディングページ設計",
    sub:"서비스 LP 디자인 · サービスLPデザイン",
    link:"/showcase/live-lp-kr.html",
    problem:"실서비스 와이어프레임을 디자이너 없이 기획부터 퍼블리싱까지 단독 진행. 한일 동시 전개 필요.",
    solution:"iPhone 목업·인터랙션·반응형까지 순수 HTML/CSS로 구현. JS 의존성 0. 한일 LP를 단일 디자인 시스템으로 통합.",
    result:"히어로·기능·상세·크리에이터·안전·FAQ 풀 섹션 구성. 한일 2개 언어 동시 배포.",
    tags:["HTML/CSS","Responsive","Bilingual","Design System"],
    snippet:`/* iPhone mockup — pure CSS, no JS */
.iphone-mockup {
  border-radius: 45px;
  box-shadow: 0 0 0 10px #2d2d2d,
    0 0 0 12px #444,
    0 30px 60px rgba(0,0,0,0.5);
}`,
  },
  {
    featured: true,
    icon:"⚔", color:"#4de8b0",
    title:"Co-op Roguelike",
    ja:"協力型ローグライク",
    sub:"파티 로그라이크 · パーティローグライク",
    link:"/showcase/roguelike-game/",
    problem:"2인 파티 전투·이벤트·유대 시스템이 결합. 단일 컴포넌트 안에서 전투·탐사·세이브 모두 처리해야 함.",
    solution:"useReducer + Context로 전체 상태 단일화. 난이도 배율, 유대 콤보 확률, 세이브/로드를 도메인 로직으로 분리.",
    result:"10층 던전, 다분기 엔딩 7종, 히든 엔딩, 난이도 시스템 모두 구현. 685줄 단일 컴포넌트로 응집도 유지.",
    tags:["useReducer","Domain Logic","Roguelike","Save System"],
    snippet:`// 유대 수치 비례 콤보 확률
const comboChance = Math.min(
  0.5, state.bond * 0.015
);
if (synergy >= 15 && bond >= 8
  && Math.random() < comboChance) { /* ... */ }`,
  },
  {
    featured: false,
    icon:"🧪", color:"#27ae60",
    title:"Soap Calculator",
    ja:"逆算せっけん計算機",
    sub:"비누 역산 계산기 · 石けん計算機",
    link:"/showcase/soap_calculator.html",
    problem:"한국어 권 사용 가능한 잿물→오일량 역산 계산기 부재. 비전공자도 안전하게 쓸 수 있어야 함.",
    solution:"비화값(SAP) 테이블 40종 데이터셋 구축, 잿물 농도 위험 구간 시각화, 9종 프리셋 제공.",
    result:"입력 검증·경고 UI 포함한 단일 파일 도구로 완성. 실사용 가능한 수준의 안전 가이드 내장.",
    tags:["Vanilla JS","SAP Table","UX Safety","Single File"],
    snippet:`// 비화값 기반 역산 공식
const totalOil = lye / (avgSAP * (1 - superfat / 100));
// 위험 농도 경고
if (conc > 40) warn("과열·화산 현상 위험");`,
  },
  {
    featured: false,
    icon:"◈", color:"#a78bfa",
    title:"VOID//BREAK",
    ja:"ヴォイドブレイク",
    sub:"마이크로 아케이드 · マイクロアーケード",
    link:"/showcase/void_break.html",
    problem:"포트폴리오 인터랙션 부족. 프레임워크 의존 없이 즉시 체험 가능한 데모가 필요.",
    solution:"Canvas API + Vanilla JS 단일 파일로 자동 사격·웨이브·콤보·파티클·카메라 셰이크 구현.",
    result:"의존성 0의 60fps 네온 슈터. 데모 단위 체류 시간 증가.",
    tags:["Canvas API","60fps","Game Feel","Touch"],
    snippet:`// 콤보 보너스 — 점수 배율
score += e.pts * (1 + comboCount * 0.1);
shakeTimer = 6; shakeIntensity = 3;`,
  },
  {
    featured: false,
    icon:"卜", color:"#a78bfa",
    title:"四柱 DEMO",
    ja:"四柱八字簡命器",
    sub:"사주팔자 간명기 · 四柱デモ",
    link:"/showcase/saju_demo.html",
    problem:"개발 중인 Flutter 사주 앱의 핵심 로직 검증을 위한 웹 사전 검증 환경 필요.",
    solution:"60갑자 + 년·월·일·시 사주 전체 산출 알고리즘, 오행 분포 차트, 상생/상극 관계 시각화를 단일 파일로 구현.",
    result:"생년월일시 입력만으로 사주팔자 + 오행 분석 + 풀이 즉시 산출. 정식판 모바일 앱 개발 진행 중.",
    tags:["Algorithm","Domain Modeling","Visualization","Demo"],
    snippet:`// 사주팔자 — 년·월·일·시 4주 산출
const yearP = calcYearPillar(y);
const monthP = calcMonthPillar(yearP.stem, m);
const dayP = calcDayPillar(y, m, d);
const hourP = calcHourPillar(dayP.stem, h);`,
  },
  {
    featured: false,
    icon:"☣", color:"#ff7a50",
    title:"DEADZONE II Demo",
    ja:"最終後127日 デモ",
    sub:"좀비 서바이벌 데모 · ゾンビサバイバル",
    link:"/showcase/deadzone_demo.html",
    problem:"모바일 앱 포팅 예정인 좀비 생존 게임의 핵심 메커니즘을 빠르게 검증·소개할 데모가 필요.",
    solution:"BSP 맵 생성, Fog of War, 좀비 AI(시야·추격·배회), 은신, 낮/밤 사이클을 단일 파일 Canvas로 구현.",
    result:"'전투보다 생존' 설계 철학을 즉시 체험 가능한 형태로 전달. 정식판 모바일 앱 개발 준비 중.",
    tags:["Canvas","BSP","Fog of War","Game Design"],
    snippet:`// 좀비 AI — 시야 + 소리 전파
if(dist<sightRange && lineOfSight(z,player))
  z.alerted = true;`,
  },
];

const CARD_MEMOS = ["state machine","procedural gen","single file","60fps target","pixel-perfect","BSP map","FSM phase","async pipeline","domain logic","spatial query"];

function ProjectCard({ p, delay=0, idx=0 }) {
  const ref = useReveal();
  const [hov, setHov] = useState(false);
  return (
    <div ref={ref} className="reveal card" data-h
      style={{padding:"28px 26px",position:"relative",overflow:"hidden",
        transitionDelay:`${delay}s`,
        borderColor: hov?`${p.color}35`:"var(--line)",
      }}
      onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}>
      <div style={{position:"absolute",top:0,left:"15%",right:"15%",height:1,background:`linear-gradient(to right,transparent,${p.color}55,transparent)`,opacity:hov?1:0,transition:"opacity .35s"}}/>
      <div style={{position:"absolute",inset:0,background:`radial-gradient(ellipse at top left,${p.color}08,transparent 60%)`,opacity:hov?1:0,transition:"opacity .35s",pointerEvents:"none"}}/>

      <div style={{
        position:"absolute",top:14,right:14,
        fontFamily:"'Instrument Serif',serif",fontStyle:"italic",
        fontSize:11,color:`${p.color}55`,
        transform:`rotate(${-2 + idx * 1.5}deg)`,
        opacity:.55,pointerEvents:"none",letterSpacing:".02em",
      }}>{CARD_MEMOS[idx % CARD_MEMOS.length]}</div>

      <div style={{position:"relative",zIndex:1}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:18}}>
          {p.link ? (
            <a href={p.link} target="_blank" rel="noopener noreferrer" style={{width:46,height:46,borderRadius:13,background:`${p.color}14`,border:`1px solid ${p.color}25`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,transition:"transform .3s",transform:hov?"scale(1.12) rotate(-6deg)":"scale(1)",textDecoration:"none"}}>{p.icon}</a>
          ) : (
            <div style={{width:46,height:46,borderRadius:13,background:`${p.color}14`,border:`1px solid ${p.color}25`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,transition:"transform .3s",transform:hov?"scale(1.12) rotate(-6deg)":"scale(1)"}}>{p.icon}</div>
          )}
          <div style={{fontFamily:"var(--serif)",fontSize:11,color:"var(--fg3)",textAlign:"right",letterSpacing:".04em",lineHeight:1.6}}>{p.ja}</div>
        </div>

        <h3 style={{fontFamily:"var(--display)",fontSize:24,fontWeight:400,color:"#fff",letterSpacing:".02em",marginBottom:5,WebkitFontSmoothing:"none",MozOsxFontSmoothing:"grayscale"}}>
          {p.link ? <a href={p.link} target="_blank" rel="noopener noreferrer" style={{color:"inherit",textDecoration:"none"}}>{p.title} ↗</a> : p.title}
        </h3>
        <p style={{fontFamily:"var(--serif)",fontSize:12,color:p.color,marginBottom:14,opacity:.85,letterSpacing:".04em"}}>{p.sub}</p>

        <div style={{marginBottom:14,display:"flex",flexDirection:"column",gap:8}}>
          <div style={{display:"flex",gap:8,alignItems:"flex-start"}}>
            <span style={{fontFamily:"var(--mono)",fontSize:9,color:"#ff5c8a",flexShrink:0,marginTop:2,letterSpacing:".08em"}}>뭐가 문제?</span>
            <span style={{fontSize:12,color:"var(--fg2)",lineHeight:1.6}}>{p.problem}</span>
          </div>
          <div style={{display:"flex",gap:8,alignItems:"flex-start"}}>
            <span style={{fontFamily:"var(--mono)",fontSize:9,color:"#6c5fff",flexShrink:0,marginTop:2,letterSpacing:".08em"}}>그래서?</span>
            <span style={{fontSize:12,color:"var(--fg2)",lineHeight:1.6}}>{p.solution}</span>
          </div>
          <div style={{display:"flex",gap:8,alignItems:"flex-start"}}>
            <span style={{fontFamily:"var(--mono)",fontSize:9,color:"#3dffb0",flexShrink:0,marginTop:2,letterSpacing:".08em"}}>결과는?</span>
            <span style={{fontSize:12,color:"var(--fg)",lineHeight:1.6}}>{p.result}</span>
          </div>
        </div>

        <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:14}}>
          {p.tags.map(t=>(
            <span key={t} className="mono-pill" style={{color:p.color,borderColor:`${p.color}40`}}>{t}</span>
          ))}
        </div>

        <div style={{maxHeight:hov?130:0,overflow:"hidden",transition:"max-height .5s cubic-bezier(.25,.46,.45,.94)"}}>
          <pre style={{fontFamily:"var(--code)",fontSize:10.5,lineHeight:1.7,color:"rgba(255,255,255,.3)",background:"rgba(0,0,0,.35)",borderRadius:10,padding:"12px 14px",border:"1px solid rgba(255,255,255,.06)",whiteSpace:"pre-wrap",wordBreak:"break-all"}}>
            {p.snippet.split("\n").map((line,i)=>{
              const isComment = line.trim().startsWith("//");
              return <span key={i} style={{display:"block",color:isComment?`${p.color}99`:"rgba(255,255,255,.35)"}}>{line}</span>;
            })}
          </pre>
        </div>
      </div>
    </div>
  );
}

function ProjectsSection({ lang }) {
  const ref = useReveal();
  const featured = PROJECTS.filter(p => p.featured);
  const more     = PROJECTS.filter(p => !p.featured);

  return (
    <section id="works" className="section-pad">
      <div ref={ref} className="reveal" style={{marginBottom:40,position:"relative"}}>
        <PropSVG type="card" size={180} color="#6c5fff" opacity={.06} rotate={18} style={{position:"absolute",top:-20,right:0}}/>
        <div style={{fontFamily:"var(--mono)",fontSize:10,letterSpacing:".2em",color:"var(--b)",marginBottom:10,textTransform:"uppercase"}}>{lang==="kr" ? "Selected Works · 作品集" : "作品集 · Selected Works"}</div>
        <h2 style={{fontFamily:"var(--sans)",fontSize:"clamp(36px,5.5vw,68px)",fontWeight:800,letterSpacing:"-.03em",lineHeight:.97,color:"#fff"}}>
          {lang==="kr" ? (<>직접 만든 <br /><span style={{color:"var(--fg3)"}}>{PROJECTS.length}개의 우주</span></>) : (<>自分で作った<br /><span style={{color:"var(--fg3)"}}>{PROJECTS.length}つの宇宙</span></>)}
        </h2>
        <p style={{fontFamily:"var(--serif)",fontSize:13,color:"var(--fg2)",marginTop:8,letterSpacing:".04em"}}>{lang==="kr" ? `自分で作った${PROJECTS.length}つの宇宙` : `직접 만든 ${PROJECTS.length}개의 우주`}</p>
        <MetaStrip style={{marginTop:16}} items={[
          {label:"FEATURED", value:String(featured.length), accent:"var(--b)"},
          {label:"MORE",     value:String(more.length)},
          {label:"TOTAL",    value:String(PROJECTS.length)},
          {label:"TAGS",     value:String(new Set(PROJECTS.flatMap(p=>p.tags)).size)},
        ]}/>
      </div>

      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16}}>
        <span style={{width:6,height:6,borderRadius:"50%",background:"var(--b)",boxShadow:"0 0 6px var(--b)"}}/>
        <span style={{fontFamily:"var(--mono)",fontSize:10,color:"var(--b)",letterSpacing:".2em"}}>FEATURED · 주력작</span>
        <span style={{flex:1,height:1,background:"linear-gradient(to right,var(--b)33,transparent)"}}/>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))",gap:18,maxWidth:1280,margin:"0 auto 40px"}}>
        {featured.map((p,i)=><ProjectCard key={p.title} p={p} delay={i*.06} idx={i}/>)}
      </div>

      {more.length > 0 && (
        <>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16}}>
            <span style={{width:6,height:6,borderRadius:"50%",background:"var(--fg3)"}}/>
            <span style={{fontFamily:"var(--mono)",fontSize:10,color:"var(--fg3)",letterSpacing:".2em"}}>MORE · 실험작 · 小作</span>
            <span style={{flex:1,height:1,background:"linear-gradient(to right,var(--fg3)33,transparent)"}}/>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))",gap:14,maxWidth:1280,margin:"0 auto"}}>
            {more.map((p,i)=><ProjectCard key={p.title} p={p} delay={i*.05} idx={i+featured.length}/>)}
          </div>
        </>
      )}
    </section>
  );
}

// ─── TECHNICAL DEPTH ──────────────────────────────────────────
function DepthItem({ it }) {
  const r2 = useReveal();
  return (
    <div ref={r2} className="reveal" style={{
      borderRadius:20,border:"1px solid var(--line)",background:"var(--bg2)",
      padding:"28px 28px",position:"relative",overflow:"hidden",
    }}>
      <div style={{position:"absolute",top:0,left:0,width:4,height:"100%",background:it.color,borderRadius:"4px 0 0 4px"}}/>
      <div style={{marginLeft:12}}>
        <h3 style={{fontFamily:"var(--sans)",fontSize:19,fontWeight:800,color:"#fff",marginBottom:8}}>{it.title}</h3>
        <p style={{fontSize:13,color:"var(--fg2)",lineHeight:1.75,marginBottom:10}}>{it.desc}</p>
        <div style={{display:"flex",gap:8,alignItems:"flex-start",marginBottom:14}}>
          <span style={{fontFamily:"var(--mono)",fontSize:9,color:it.color,letterSpacing:".1em",flexShrink:0,marginTop:2}}>DECISION</span>
          <span style={{fontSize:12,color:"var(--fg)",lineHeight:1.6}}>{it.decision}</span>
        </div>
        <pre style={{fontFamily:"var(--mono)",fontSize:11,lineHeight:1.7,color:"rgba(255,255,255,.4)",background:"rgba(0,0,0,.3)",borderRadius:10,padding:"12px 14px",border:"1px solid rgba(255,255,255,.05)",whiteSpace:"pre-wrap"}}>
          {it.code.split("\n").map((line,j)=>{
            const c = line.trim().startsWith("//")?`${it.color}88`:"rgba(255,255,255,.45)";
            return <span key={j} style={{display:"block",color:c}}>{line}</span>;
          })}
        </pre>
      </div>
    </div>
  );
}

function TechnicalDepth({ lang }) {
  const ref = useReveal();
  const items = [
    {
      title: lang==="kr" ? "State Management Architecture" : "状態管理アーキテクチャ",
      desc: lang==="kr" ? "Redux 대신 useReducer + Context 조합을 선택. 프로젝트 규모에 맞는 경량 구조로 복잡한 게임 상태(전투·인벤토리·대화)를 예측 가능하게 관리." : "Reduxではなく useReducer + Context の組み合わせを選択。プロジェクト規模に合った軽量構造で複雑なゲーム状態を予測可能に管理。",
      decision: lang==="kr" ? "왜 Redux가 아닌가? → 4개 프로젝트 모두 단일 앱 수준이므로 외부 라이브러리 의존 없이 React 내장 API만으로 충분." : "なぜReduxではないのか → 4つのプロジェクト全てが単一アプリ規模のため、外部ライブラリなしでReact内蔵APIで十分。",
      color:"#6c5fff",
      code:`// 일부러 Redux 안 쓴다. 이 규모에 Redux는 과잉
// あえてReduxを使わない。この規模には過剰だ
const [state, dispatch] = useReducer(gameReducer, init);
// 모든 이벤트는 dispatch 하나로 → 추적이 쉽다`,
    },
    {
      title: lang==="kr" ? "Canvas Game Loop" : "Canvas ゲームループ",
      desc: lang==="kr" ? "requestAnimationFrame 기반 60fps 게임 루프를 React 라이프사이클과 충돌 없이 운영. 공간 분할로 대량 엔티티 처리 최적화." : "requestAnimationFrame基礎の60fpsゲームループをReactライフサイクルと衝突なく運用。空間分割で大量エンティティ処理を最適化。",
      decision: lang==="kr" ? "왜 게임 엔진을 안 쓰는가? → React의 한계를 직접 뚫어내면서 Canvas API를 완전 제어하는 경험 축적." : "なぜゲームエンジンを使わないのか → Reactの限界を直接押し広げながらCanvas APIを完全制御する経験を蓄積。",
      color:"#ff7a50",
      code:`// 이 구조를 찾기까지 3번 갈아엎었다
// この構造に辿り着くまで3回作り直した
useEffect(() => {
  const loop = () => { update(); draw(); raf = rAF(loop); };
  raf = rAF(loop);
  return () => cancelAnimationFrame(raf); // cleanup 안하면 지옥
}, []);`,
    },
    {
      title: lang==="kr" ? "AI Integration Pipeline" : "AI統合パイプライン",
      desc: lang==="kr" ? "로컬 LLM(Ollama) + Stable Diffusion을 직접 멀티 GPU 환경에서 구축. AI 생성 텍스트·이미지를 게임 내 NPC 대화·아트에 활용하는 파이프라인 설계." : "ローカルLLM(Ollama) + Stable Diffusionをマルチ GPU環境で直接構築。AI生成テキスト・画像をゲーム内NPC会話・アートに活用するパイプライン設計。",
      decision: lang==="kr" ? "왜 로컬인가? → API 비용 없이 실험 자유도 극대화 + 오프라인 환경 지원." : "なぜローカルか → APIコストなしで実験の自由度を最大化 + オフライン環境サポート。",
      color:"#3dffb0",
      code:`// API 쓰면 편하지. 근데 돈이 없었다 (솔직)
// APIは楽だ。でもお金がなかった（正直）
Local LLM (Ollama) → NPC 대화 생성
Stable Diffusion → 게임 아트 생성
→ JSON으로 React 앱에 주입`,
    },
  ];

  return (
    <section id="depth" className="section-pad" style={{position:"relative"}}>
      <div style={{position:"absolute",top:36,right:"clamp(24px,6vw,96px)",display:"none",zIndex:1}} className="glitch-err-float">
        <GlitchError text="Segmentation fault (core dumped)" title="debug.exe"/>
      </div>
      <style>{`@media (min-width:1100px){.glitch-err-float{display:block !important;transform:rotate(-4deg);opacity:.55}}`}</style>
      <div ref={ref} className="reveal">
        <div style={{marginBottom:44,display:"flex",justifyContent:"space-between",alignItems:"flex-end",flexWrap:"wrap",gap:16}}>
          <div>
            <div style={{fontFamily:"var(--mono)",fontSize:10,letterSpacing:".2em",color:"#ffb347",marginBottom:10,textTransform:"uppercase"}}>Technical Depth · 技術の深度</div>
            <h2 style={{fontFamily:"var(--sans)",fontSize:"clamp(30px,4.5vw,56px)",fontWeight:800,letterSpacing:"-.03em",lineHeight:.97,color:"#fff",marginBottom:6}}>
              {lang==="kr" ? (<>어떻게, 왜<br/><span style={{color:"var(--fg3)"}}>이렇게 만들었는가</span></>) : (<>どのように、なぜ<br/><span style={{color:"var(--fg3)"}}>こう作ったのか</span></>)}
            </h2>
            <p style={{fontFamily:"var(--serif)",fontSize:13,color:"var(--fg2)",letterSpacing:".04em"}}>{lang==="kr" ? "どのように、なぜこう作ったのか" : "어떻게, 왜 이렇게 만들었는가"}</p>
          </div>
          <MetaStrip items={[
            {label:"ITEMS", value:"3"},
            {label:"REV",   value:"2026.04"},
            {label:"VER",   value:"v2"},
          ]}/>
        </div>

        <div style={{display:"flex",flexDirection:"column",gap:20}}>
          {items.map((it,i)=>(
            <DepthItem key={i} it={it} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── CURIOSITY (Framework comparison) ─────────────────────────
const FRAMEWORK_TABS = [
  {
    id:"react", label:"React", badge:"주 무기 · メイン武器", color:"#61dafb",
    note:"Virtual DOM · 상태관리 · 생태계",
    code:`// Fate Lost Log → 절대 안바뀜
const [bond, setBond] = useState(0);
const synergy = useMemo(
  () => 1 + bond * 0.01, [bond]
);
// bond가 바뀔 때만 재계산`,
  },
  {
    id:"svelte", label:"Svelte", badge:"탐구 중 · 探求中", color:"#ff3e00",
    note:"컴파일 타임 · No Virtual DOM · 반응형 선언",
    code:`<!-- 같은 로직, Svelte 문법 -->
<script>
  let bond = 0;
  $: synergy = 1 + bond * 0.01;
  // $: 는 의존성을 자동 추적
</script>`,
  },
  {
    id:"solid", label:"SolidJS", badge:"다음 목표 · 次の目標", color:"#3178c6",
    note:"Fine-grained Reactivity · Signal 기반",
    code:`// 반응성의 원리를 가장 명확하게
const [bond, setBond] = createSignal(0);
const synergy = createMemo(
  () => 1 + bond() * 0.01
);
// DOM을 직접 수정 →VD 없음`,
  },
];

function CuriositySection({ lang }) {
  const [active, setActive] = useState("react");
  const ref = useReveal();
  const cur = FRAMEWORK_TABS.find(t=>t.id===active);

  return (
    <section id="curiosity" className="section-pad">
      <div ref={ref} className="reveal">
        <div style={{marginBottom:40}}>
          <div style={{fontFamily:"var(--mono)",fontSize:10,letterSpacing:".2em",color:"var(--o)",marginBottom:10,textTransform:"uppercase"}}>Framework Curiosity · フレームワーク好奇心</div>
          <h2 style={{fontFamily:"var(--sans)",fontSize:"clamp(30px,4.5vw,56px)",fontWeight:800,letterSpacing:"-.03em",lineHeight:.97,color:"#fff",marginBottom:6}}>
            {lang==="kr" ? (<>같은 아이디어,<br /><span style={{color:"var(--fg3)"}}>다른 언어</span></>) : (<>同じアイデアを、<br /><span style={{color:"var(--fg3)"}}>違う言語</span></>)}
          </h2>
          <p style={{fontFamily:"var(--serif)",fontSize:13,color:"var(--fg2)",letterSpacing:".04em"}}>{lang==="kr" ? "同じアイデアを違う言語で書けるか" : "같은 아이디어, 다른 언어로 쓸 수 있는가"}</p>
        </div>

        <div style={{borderRadius:24,border:"1px solid var(--line)",background:"var(--bg2)",overflow:"hidden"}}>
          <div style={{padding:"20px 24px",borderBottom:"1px solid var(--line)",display:"flex",gap:10,flexWrap:"wrap",alignItems:"center",justifyContent:"space-between"}}>
            <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
              {FRAMEWORK_TABS.map(t=>(
                <button key={t.id} className={`tab-btn${active===t.id?" active":""}`}
                  style={active===t.id?{background:t.color,borderColor:t.color}:{}}
                  onClick={()=>setActive(t.id)}>{t.label}</button>
              ))}
            </div>
            <div style={{display:"flex",alignItems:"center",gap:6}}>
              <span style={{width:6,height:6,borderRadius:"50%",background:cur.color,boxShadow:`0 0 8px ${cur.color}`,display:"inline-block"}}/>
              <span style={{fontFamily:"var(--serif)",fontSize:12,color:"var(--fg2)",letterSpacing:".04em"}}>{cur.badge}</span>
            </div>
          </div>
          <div style={{padding:"14px 24px",background:"rgba(0,0,0,.2)",borderBottom:"1px solid var(--line)"}}>
            <span style={{fontFamily:"var(--mono)",fontSize:10,color:cur.color,letterSpacing:".1em"}}>{cur.note}</span>
          </div>
          <pre style={{fontFamily:"var(--mono)",fontSize:13,lineHeight:1.8,color:"rgba(255,255,255,.6)",padding:"28px 28px",whiteSpace:"pre-wrap",wordBreak:"break-all",background:"transparent",minHeight:160}}>
            {cur.code.split("\n").map((line,i)=>{
              const isComment=line.trim().startsWith("//")||line.trim().startsWith("<!--")||line.trim().startsWith("*");
              return <span key={i} style={{display:"block",color:isComment?`${cur.color}88`:"rgba(255,255,255,.55)"}}>{line}</span>;
            })}
          </pre>
          <div style={{padding:"16px 24px",borderTop:"1px solid var(--line)",fontFamily:"var(--serif)",fontSize:12,color:"var(--fg3)",letterSpacing:".04em"}}>
            {lang==="kr"
              ? <>하나의 프레임워크가 아니라 <strong style={{color:"var(--fg)"}}>반응성(Reactivity)</strong>이라는 개념을 이해합니다 · フレームワークではなく概念を理解しています</>
              : <>フレームワークではなく<strong style={{color:"var(--fg)"}}>リアクティビティ(Reactivity)</strong>という概念を理解しています · 하나의 프레임워크가 아니라 개념을 이해합니다</>
            }
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── OCCULT MODE: Released Apps ───────────────────────────────
const RELEASED_APPS = [
  {
    title:"Robotics Workshop",
    ja:"ロボット工房",
    desc_kr:"부품을 조합해 AI로 생명을 부여하는 인터랙티브 시뮬레이터.",
    desc_ja:"部品を組み合わせ、AIの力で生命を吹き込むインタラクティブシミュレーター。",
    tags:["Simulation","AI","Workshop"],
    link:"https://play.google.com/store/apps/details?id=com.occultai.robotics_workshop",
    color:"#0f0",
  },
  {
    title:"Kaleidoscope",
    ja:"万華鏡",
    desc_kr:"AI가 생성하는 무한 만화경. 명상과 힐링을 위한 제너러티브 아트.",
    desc_ja:"AIによって生成される無限の万華鏡。静かな瞑想のような体験。",
    tags:["Art","Generative","Relax"],
    link:"https://play.google.com/store/apps/details?id=com.occultai.kaleidoscope",
    color:"#0f0",
  },
  {
    title:"Nantoiu",
    ja:"何と言う",
    desc_kr:"의식과 기억의 경계를 흐리는 AI 실험 앱. 현실과 꿈 사이.",
    desc_ja:"意識と記憶の境界を曖昧にするAI体験アプリ。現実と夢の狭間。",
    tags:["Experimental","AI","Mystery"],
    link:"https://play.google.com/store/apps/details?id=com.occultai.nantoiu",
    color:"#0f0",
  },
];

const UPCOMING = [
  { title:"진보의 대가", ja:"ディストピア経営", desc_kr:"윤리를 버려야 생존하는 디스토피아 경영 시뮬레이션.", desc_ja:"生存のために倫理を捨てる。暗いなりにあなたは何を守るのか。", tags:["Simulation","Strategy","Dark Future"], link:"https://play.google.com/store/apps/details?id=com.occultai.priceofp" },
  { title:"산중관리동", ja:"規則書", desc_kr:"폐쇄 공간에서 규칙서를 따르는 공포. 한 줄의 위반이 죽음.", desc_ja:"閉ざされた空間で、謎の「規則書」に従うか。一行の違反が死を呼ぶ。", tags:["Horror","Psychological","Mystery"], link:"https://play.google.com/store/apps/details?id=com.occultai.napolitan" },
  { title:"6월 11일, 영원히", ja:"永遠の回帰", desc_kr:"동료들과 끝나지 않는 시간을 반복하는 타임루프 내러티브.", desc_ja:"仲間たちと共に、終わらない時間を繰り返す。心崩と再生の果てに。", tags:["Narrative","Time Loop","Drama"], link:"https://play.google.com/store/apps/details?id=com.occultai.june" },
];

function OccultAppsSection({ lang }) {
  const ref = useReveal();
  return (
    <section id="apps" className="section-pad">
      <div ref={ref} className="reveal">
        <div style={{marginBottom:44}}>
          <pre style={{fontFamily:"var(--mono)",fontSize:10,color:"#22cc55",letterSpacing:2,marginBottom:12}}>
{`═════════════ RELEASED APPLICATIONS ═════════════`}
          </pre>
          <h2 style={{fontFamily:"var(--mono)",fontSize:"clamp(24px,4vw,42px)",fontWeight:700,color:"#0f0",textShadow:"0 0 10px rgba(0,255,0,.3)"}}>
            {lang==="kr" ? "Google Play 출시작" : "Google Play リリース作"}
          </h2>
        </div>

        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:16}}>
          {RELEASED_APPS.map((app,i)=>(
            <a key={i} href={app.link} target="_blank" rel="noopener noreferrer" style={{
              textDecoration:"none",padding:"24px",borderRadius:0,
              border:"1px solid rgba(0,255,0,.2)",background:"rgba(0,255,0,.02)",
              display:"block",transition:"all .3s",position:"relative",
            }}
              onMouseEnter={e=>{e.currentTarget.style.borderColor="rgba(0,255,0,.5)";e.currentTarget.style.background="rgba(0,255,0,.06)"}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor="rgba(0,255,0,.2)";e.currentTarget.style.background="rgba(0,255,0,.02)"}}
            >
              <div style={{fontFamily:"var(--mono)",fontSize:9,color:"#116633",marginBottom:8}}>{'>'} </div>
              <h3 style={{fontFamily:"var(--mono)",fontSize:16,fontWeight:700,color:"#0f0",marginBottom:4}}>[{app.title}]</h3>
              <div style={{fontFamily:"var(--serif)",fontSize:12,color:"#22cc55",marginBottom:10}}>{app.ja}</div>
              <p style={{fontFamily:"var(--mono)",fontSize:12,color:"#22cc55",lineHeight:1.7,marginBottom:14}}>{lang==="kr" ? app.desc_kr : app.desc_ja}</p>
              <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                {app.tags.map(t=>(
                  <span key={t} style={{fontFamily:"var(--mono)",fontSize:9,padding:"2px 8px",border:"1px solid rgba(0,255,0,.25)",color:"#22cc55"}}>{t}</span>
                ))}
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

function OccultUpcomingSection({ lang }) {
  const ref = useReveal();
  return (
    <section id="upcoming" className="section-pad">
      <div ref={ref} className="reveal">
        <pre style={{fontFamily:"var(--mono)",fontSize:10,color:"#22cc55",letterSpacing:2,marginBottom:16}}>
{`════════════ MORE PROJECTS ════════════`}
        </pre>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:16}}>
          {UPCOMING.map((p,i)=>(
            <div key={i} style={{padding:"24px",border:"1px solid rgba(0,255,0,.12)",background:"rgba(0,255,0,.01)"}}>
              <div style={{fontFamily:"var(--mono)",fontSize:9,color:"#22cc55",marginBottom:8,letterSpacing:".15em"}}>{p.link ? "RELEASED" : "COMING SOON"}</div>
              <h3 style={{fontFamily:"var(--mono)",fontSize:15,color:"#0f0",marginBottom:4}}>{p.link ? <a href={p.link} target="_blank" rel="noopener noreferrer" style={{color:"inherit",textDecoration:"none"}}>{p.title} ↗</a> : p.title}</h3>
              <div style={{fontFamily:"var(--serif)",fontSize:11,color:"#1a9944",marginBottom:10}}>{p.ja}</div>
              <p style={{fontFamily:"var(--mono)",fontSize:12,color:"#22cc55",lineHeight:1.7,marginBottom:12}}>{lang==="kr" ? p.desc_kr : p.desc_ja}</p>
              <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                {p.tags.map(t=>(
                  <span key={t} style={{fontFamily:"var(--mono)",fontSize:9,padding:"2px 8px",border:"1px solid rgba(0,255,0,.15)",color:"#1a9944"}}>{t}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function OccultPhilosophySection({ lang }) {
  const ref = useReveal();
  return (
    <section id="philosophy" className="section-pad">
      <div ref={ref} className="reveal" style={{
        padding:"clamp(36px,5vw,64px)",border:"1px solid rgba(0,255,0,.15)",
        background:"rgba(0,255,0,.02)",
      }}>
        <h2 style={{fontFamily:"var(--mono)",fontSize:"clamp(20px,3vw,32px)",color:"#0f0",marginBottom:24,textShadow:"0 0 10px rgba(0,255,0,.2)"}}>
          Philosophy
        </h2>
        <div style={{fontFamily:"var(--mono)",fontSize:13,color:"#22cc55",lineHeight:2,maxWidth:640}}>
          {lang === "ja" ? (
            <>
              <p style={{marginBottom:16}}>オカルトは「隠されたもの」を意味する。AIもまた、その思考過程は人間には理解できないブラックボックスだ。</p>
              <p style={{marginBottom:16,color:"#1a9944"}}>오컬트와 AI, 과학과 신비. 상반되어 보이는 둘은 기묘할 정도로 닮아있다.</p>
              <p>ピクセルの向こう側に、何が見えますか？</p>
            </>
          ) : (
            <>
              <p style={{marginBottom:16}}>오컬트와 AI, 과학과 신비. 상반되어 보이는 둘은 기묘할 정도로 닮아있다. 이해할 수 없는 블랙박스의 이면을 탐구하고 나누는 것─그것이 내가 코드를 쓰는 이유다.</p>
              <p style={{marginBottom:16,color:"#1a9944"}}>オカルトは「隠されたもの」を意味する。AIもまた、その思考過程は人間には理解できないブラックボックスだ。</p>
              <p style={{color:"#1a9944"}}>ピクセルの向こう側に、何が見えますか？</p>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

// ─── PHILOSOPHY (Surface) ─────────────────────────────────────
function PhilosophySection({ lang }) {
  const ref = useReveal();
  const paragraphs = lang === "kr" ? [
    { main:"역사 전공하면서 '이 세계는 누가 만든 거지?'라고 생각하다가, 어느 날 React로 세계를 직접 만들기 시작했다. 그게 2023년이었다. 지금은 Ollama를 돌리면서 'AI도 결국 블랙박스야'라고 중얼거린다.", sub:"歴史を専攻しながら「この世界は誰が作ったんだ？」と思っていたら、ある日、Reactで世界を直接作り始めた。2023年のことだった。" },
    { main:"2012년부터 게임세계를 바라보며 쌓아온 감각, 로컬 LLM과 멀티 GPU를 직접 구축하며 쌓은 역량, Google Play에 3개의 앱을 출시한 실행력─솔직히 이력서에 쓰면 그럴듯해 보이겠 지만, 실제로는 밤마다 '이게 맞나' 싶은 순간의 연속이었다.", sub:"正直、履歴書に書けば立派に見えるだろう。でも実際は毎晩「これで合ってるのか」という瞬間の連続だった。" },
    { main:"그래도 멈추지 않은 건, 내가 상상한 것을 내 손으로 만들 수 있다는 걸 한 번 경험해버렸기 때문이다. 그 감각은 중독이다.", sub:"それでも止まらなかったのは、想像したものを自分の手で作れるという感覚を一度味わってしまったからだ。その感覚は中毒だ。" },
  ] : [
    { main:"歴史を専攻しながら「この世界は誰が作ったんだ？」と思っていたら、ある日、Reactで世界を直接作り始めた。2023年のことだった。今はOllamaを動かしながら「AIも結局ブラックボックスだよな」と呟いている。", sub:"역사 전공하면서 '이 세계는 누가 만든 거지?'라고 생각하다가, 어느 날 React로 세계를 직접 만들기 시작했다." },
    { main:"2012年からゲーム業界を見ながら積み上げた感覚、ローカルLLMとマルチGPUを自ら構築した能力、Google Playに3本リリースした実行力─正直、履歴書に書けば立派だろう。でも実際は毎晩「これで合ってるのか」の連続だった。", sub:"솔직히 이력서에 쓰면 그럴듯해 보이겠 지만, 실제로는 '이게 맞나' 싶은 순간의 연속이었다." },
    { main:"それでも止まらなかったのは、想像したものを自分の手で作れるという感覚を一度味わってしまったからだ。その感覚は中毒だ。", sub:"그래도 멈추지 않은 건, 그 감각을 한 번 경험해버렸기 때문이다. 중독이다." },
  ];

  return (
    <section className="section-pad">
      <div ref={ref} className="reveal" style={{
        borderRadius:28,padding:"clamp(40px,6vw,72px)",
        border:"1px solid var(--line)",
        background:"linear-gradient(135deg,rgba(108,95,255,.05) 0%,rgba(255,92,138,.03) 100%)",
        position:"relative",overflow:"hidden",
      }}>
        <div style={{position:"absolute",top:-40,right:-40,width:220,height:220,borderRadius:"50%",background:"radial-gradient(rgba(108,95,255,.06),transparent 70%)",pointerEvents:"none"}}/>

        <div style={{position:"relative",zIndex:1,maxWidth:780}}>
          <div style={{fontFamily:"var(--mono)",fontSize:10,letterSpacing:".2em",color:"var(--b)",marginBottom:16,textTransform:"uppercase"}}>Why I Code · なぜコードを書くか</div>
          <h2 style={{fontFamily:"var(--sans)",fontSize:"clamp(30px,4vw,52px)",fontWeight:800,letterSpacing:"-.03em",lineHeight:1,color:"#fff",marginBottom:32}}>
            {lang==="kr" ? (<>스펙이 아니라,<br /><span style={{fontFamily:"var(--serif)",fontStyle:"italic",fontWeight:300,color:"var(--fg2)"}}>スペックではなく、</span><br /></>) : (<>スペックではなく、<br /><span style={{fontFamily:"var(--sans)",fontWeight:300,color:"var(--fg2)",fontSize:"clamp(20px,3vw,36px)"}}>스펙이 아니라,</span><br /></>)}
            <span style={{background:"linear-gradient(90deg,var(--b),var(--o))",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>{lang==="kr" ? "상상이 먼저 왔다" : "想像が先だった"}</span>
          </h2>

          <div style={{display:"flex",flexDirection:"column",gap:20}}>
            {paragraphs.map((p,i)=>(
              <div key={i}>
                <p style={{fontSize:15,color:"var(--fg2)",lineHeight:1.85,marginBottom:6,wordBreak:"keep-all"}}>{p.main}</p>
                <p style={{fontFamily:"var(--serif)",fontSize:12,color:"var(--fg3)",lineHeight:1.8,letterSpacing:".04em"}}>{p.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── NOW · WORKS IN PROGRESS ──────────────────────────────────
const NOW_ITEMS = [
  { tag:"LIVE", kr:"Rakughost v4.1 그래픽·오디오 통합", ja:"Rakughost v4.1 グラフィック·オーディオ統合", pct:80, color:"#ef4444" },
  { tag:"WIP",  kr:"Zpandemic II 모바일 포팅 기획",    ja:"Zpandemic II モバイル移植企画",         pct:35, color:"#ffb347" },
  { tag:"R&D",  kr:"Lumina/NetaYume bf16 LoRA 학습",   ja:"Lumina/NetaYume bf16 LoRA 学習",         pct:55, color:"#3dffb0" },
];

function NowSection({ lang }) {
  const ref = useReveal();
  const today = new Date().toISOString().slice(0,10);
  return (
    <section id="now" className="section-pad" style={{paddingTop:20,paddingBottom:48}}>
      <div ref={ref} className="reveal" style={{
        position:"relative",padding:"26px 30px",
        border:"1px solid var(--line)",borderRadius:18,
        background:"linear-gradient(135deg,rgba(239,68,68,.04),rgba(0,0,0,.15))",overflow:"hidden",
      }}>
        <PropSVG type="dots" size={220} color="#ef4444" opacity={.09} style={{position:"absolute",top:-30,right:-30}}/>

        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:18,flexWrap:"wrap",gap:12,position:"relative",zIndex:1}}>
          <div>
            <div style={{display:"inline-flex",alignItems:"center",gap:8,marginBottom:4}}>
              <span style={{width:8,height:8,borderRadius:"50%",background:"#ef4444",boxShadow:"0 0 0 0 rgba(239,68,68,.6)",animation:"pulse-r 1.4s ease infinite",display:"inline-block"}}/>
              <span style={{fontFamily:"var(--mono)",fontSize:10,color:"#ef4444",letterSpacing:".2em"}}>NOW · 今</span>
            </div>
            <h2 style={{fontFamily:"var(--sans)",fontSize:"clamp(22px,3vw,32px)",fontWeight:800,color:"#fff",letterSpacing:"-.02em"}}>
              {lang==="kr" ? "지금 만드는 중" : "現在制作中"}
            </h2>
          </div>
          <MetaStrip items={[
            {label:"DATE",value:today},
            {label:"STATUS",value:"ONLINE",accent:"#3dffb0"},
            {label:"BUILD",value:"0042"},
          ]} align="right"/>
        </div>

        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))",gap:14,position:"relative",zIndex:1}}>
          {NOW_ITEMS.map((it,i)=>(
            <div key={i} style={{padding:"14px 16px",border:`1px solid ${it.color}2b`,borderRadius:10,background:"rgba(0,0,0,.28)"}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
                <span style={{fontFamily:"var(--mono)",fontSize:9,color:it.color,letterSpacing:".18em"}}>{it.tag}</span>
                <span style={{fontFamily:"var(--mono)",fontSize:9,color:"var(--fg3)"}}>{it.pct}%</span>
              </div>
              <div style={{fontSize:12,color:"var(--fg)",lineHeight:1.55,marginBottom:10}}>{lang==="kr" ? it.kr : it.ja}</div>
              <div style={{height:2,background:"rgba(255,255,255,.06)",borderRadius:2}}>
                <div style={{height:"100%",width:`${it.pct}%`,background:it.color,borderRadius:2,boxShadow:`0 0 6px ${it.color}`}}/>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── HARDWARE STACK ───────────────────────────────────────────
const HARDWARE = [
  { role:"MAIN", label:"RTX 5060",       note_kr:"kohya sd-scripts · SDXL 학습", note_ja:"kohya sd-scripts · SDXL 学習",  color:"#ff5c8a" },
  { role:"SUB",  label:"RTX 3060 12GB",  note_kr:"병렬 학습 · 배치 보조",         note_ja:"並列学習 · バッチ補助",          color:"#6c5fff" },
  { role:"DEV",  label:"Mac Mini M4",    note_kr:"Flutter · iOS 빌드",            note_ja:"Flutter · iOS ビルド",           color:"#3dffb0" },
  { role:"HOME", label:"Raspberry Pi",   note_kr:"홈서버 · 24h 가동",             note_ja:"ホームサーバー · 24h 稼働",       color:"#ffb347" },
];

function HardwareSection({ lang }) {
  const ref = useReveal();
  return (
    <section id="hardware" className="section-pad">
      <div ref={ref} className="reveal">
        <div style={{marginBottom:28}}>
          <div style={{fontFamily:"var(--mono)",fontSize:10,letterSpacing:".2em",color:"#ffb347",marginBottom:10,textTransform:"uppercase"}}>Stack · ハードウェア · 작업실</div>
          <h2 style={{fontFamily:"var(--sans)",fontSize:"clamp(28px,4vw,48px)",fontWeight:800,letterSpacing:"-.03em",lineHeight:.97,color:"#fff",marginBottom:8}}>
            {lang==="kr" ? (<>물리적 스택<br/><span style={{color:"var(--fg3)"}}>직접 구축한 작업실</span></>) : (<>物理スタック<br/><span style={{color:"var(--fg3)"}}>自作のアトリエ</span></>)}
          </h2>
          <MetaStrip style={{marginTop:14}} items={[
            {label:"GPU",  value:"×2",         accent:"#ff5c8a"},
            {label:"CPU",  value:"M4"},
            {label:"NODE", value:"Pi 4"},
            {label:"SN",   value:"BHL-HW-2026"},
            {label:"LOC",  value:"SEOUL"},
          ]}/>
        </div>

        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:14}}>
          {HARDWARE.map((h,i)=>(
            <div key={i} style={{
              position:"relative",padding:"18px 18px",
              border:`1px solid ${h.color}22`,borderRadius:12,
              background:`linear-gradient(135deg,${h.color}07,rgba(0,0,0,.22))`,overflow:"hidden",
            }}>
              <div style={{fontFamily:"var(--mono)",fontSize:9,color:h.color,letterSpacing:".22em",marginBottom:8}}>{h.role}</div>
              <div style={{fontFamily:"var(--display)",fontSize:20,color:"#fff",marginBottom:6,letterSpacing:".02em"}}>{h.label}</div>
              <div style={{fontSize:11,color:"var(--fg2)",lineHeight:1.6}}>{lang==="kr" ? h.note_kr : h.note_ja}</div>
              <div style={{position:"absolute",bottom:6,right:10,fontFamily:"var(--mono)",fontSize:9,color:`${h.color}66`,letterSpacing:".1em"}}>{String(i+1).padStart(2,"0")}/04</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── CREATOR (AI · LoRA · Doujin) ─────────────────────────────
function CreatorSection({ lang }) {
  const ref = useReveal();
  const crimson = "#ef4444";
  return (
    <section id="creator" className="section-pad">
      <div ref={ref} className="reveal" style={{
        position:"relative",padding:"clamp(36px,5vw,56px) clamp(28px,4vw,48px)",
        border:`1px solid ${crimson}22`,borderRadius:24,
        background:`linear-gradient(135deg,${crimson}08 0%,rgba(0,0,0,.15) 100%)`,
        overflow:"hidden",
      }}>
        <PropSVG type="blade" size={190} color={crimson} opacity={.11} rotate={-14} style={{position:"absolute",top:-26,right:-24}}/>
        <PropSVG type="chain" size={220} color={crimson} opacity={.08} rotate={200}   style={{position:"absolute",bottom:-46,left:-30}}/>
        <div style={{position:"absolute",top:32,right:48,zIndex:1}}>
          <Stamp text="R-TRAINER" subtext="#15 CIVITAI" color={crimson} size={76} rotate={-14}/>
        </div>

        <div style={{position:"relative",zIndex:1,maxWidth:960}}>
          <div style={{fontFamily:"var(--mono)",fontSize:10,letterSpacing:".2em",color:crimson,marginBottom:10,textTransform:"uppercase"}}>Creator · 創作者 · 작가</div>
          <h2 style={{fontFamily:"var(--sans)",fontSize:"clamp(30px,4.5vw,54px)",fontWeight:800,letterSpacing:"-.03em",lineHeight:.97,color:"#fff",marginBottom:14}}>
            {lang==="kr" ? (<>코드만 쓰는 게<br/><span style={{color:"var(--fg3)"}}>아니다</span></>) : (<>コードだけ<br/><span style={{color:"var(--fg3)"}}>書くわけではない</span></>)}
          </h2>
          <p style={{fontSize:14,color:"var(--fg2)",lineHeight:1.85,marginBottom:24,maxWidth:720}}>
            {lang==="kr"
              ? "Behelit 이름으로는 LoRA·DoRA 학습자로, 만화·동인지 세팅 제작자로도 활동 중. 개발과 창작은 같은 회로의 두 노드라고 본다."
              : "Behelit名義でLoRA·DoRAトレーナー、漫画·同人誌のセッティング制作者として活動中。開発と創作は同じ回路の二つのノード。"}
          </p>

          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:14}}>
            <div data-h style={{
              padding:"20px",borderRadius:12,
              border:`1px solid ${crimson}33`,background:"rgba(0,0,0,.3)",
              transition:"all .3s",cursor:"default",
            }}>
              <div style={{fontFamily:"var(--mono)",fontSize:9,color:crimson,letterSpacing:".22em",marginBottom:8}}>CIVITAI · RANK</div>
              <div style={{fontFamily:"var(--display)",fontSize:22,color:"#fff",marginBottom:4,letterSpacing:".02em"}}>Top Trainer #15</div>
              <div style={{fontSize:11,color:"var(--fg2)",lineHeight:1.6}}>{lang==="kr" ? "LoRA/DoRA 글로벌 랭킹" : "LoRA/DoRA グローバルランキング"}</div>
              <MetaStrip style={{marginTop:12}} items={[
                {label:"ARCH", value:"DoRA"},
                {label:"BASE", value:"SDXL"},
              ]}/>
            </div>

            <div style={{padding:"20px",borderRadius:12,border:`1px solid ${crimson}22`,background:"rgba(0,0,0,.22)"}}>
              <div style={{fontFamily:"var(--mono)",fontSize:9,color:crimson,letterSpacing:".22em",marginBottom:8}}>MODELS</div>
              <div style={{fontFamily:"var(--display)",fontSize:19,color:"#fff",marginBottom:4,letterSpacing:".02em"}}>Pony · Illustrious · NoobAI</div>
              <div style={{fontSize:11,color:"var(--fg2)",lineHeight:1.6}}>{lang==="kr" ? "SDXL 주력 · bf16 Lumina/NetaYume" : "SDXL メイン · bf16 Lumina/NetaYume"}</div>
              <div style={{display:"flex",gap:6,flexWrap:"wrap",marginTop:12}}>
                {["dim=96","alpha=48","LoCon+","bf16 only"].map(t=>(
                  <span key={t} style={{fontFamily:"var(--mono)",fontSize:9,padding:"2px 8px",border:`1px solid ${crimson}33`,color:crimson,letterSpacing:".08em"}}>{t}</span>
                ))}
              </div>
            </div>

            <div style={{padding:"20px",borderRadius:12,border:`1px solid ${crimson}22`,background:"rgba(0,0,0,.22)"}}>
              <div style={{fontFamily:"var(--mono)",fontSize:9,color:crimson,letterSpacing:".22em",marginBottom:8}}>DOUJIN · 同人</div>
              <div style={{fontFamily:"var(--display)",fontSize:20,color:"#fff",marginBottom:4,letterSpacing:".02em"}}>Behelit 브랜드</div>
              <div style={{fontSize:11,color:"var(--fg2)",lineHeight:1.6}}>{lang==="kr" ? "만화·세팅·동인지 창작" : "漫画·世界観·同人誌創作"}</div>
              <div style={{marginTop:12,fontFamily:"'Instrument Serif',serif",fontStyle:"italic",fontSize:12,color:"var(--fg3)",letterSpacing:".02em"}}>
                {lang==="kr" ? "\"개발자의 반쪽은 이야기꾼이다\"" : "\"開発者のもう半分は物語師だ\""}
              </div>
            </div>
          </div>

          <div style={{marginTop:28,display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:16,borderTop:`1px dashed ${crimson}22`,paddingTop:16}}>
            <div style={{fontFamily:"'Instrument Serif',serif",fontStyle:"italic",fontSize:13,color:"var(--fg3)"}}>
              {lang==="kr" ? "OccultAI = 코드 · Behelit = 이야기" : "OccultAI = コード · Behelit = 物語"}
            </div>
            <PropSVG type="barcode" size={110} color={crimson} opacity={.28}/>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── SCHEDULE · RELEASE TIMELINE ──────────────────────────────
const SCHEDULE = [
  { date:"2025.Q1", status:"RELEASED", kr:"Robotics Workshop", ja:"ロボット工房",  link:"https://play.google.com/store/apps/details?id=com.occultai.robotics_workshop" },
  { date:"2025.Q2", status:"RELEASED", kr:"Kaleidoscope",      ja:"万華鏡",        link:"https://play.google.com/store/apps/details?id=com.occultai.kaleidoscope" },
  { date:"2025.Q3", status:"RELEASED", kr:"Nantoiu",           ja:"何と言う",      link:"https://play.google.com/store/apps/details?id=com.occultai.nantoiu" },
  { date:"2026.Q2", status:"UPCOMING", kr:"진보의 대가",        ja:"ディストピア経営", link:"https://play.google.com/store/apps/details?id=com.occultai.priceofp" },
  { date:"2026.Q2", status:"UPCOMING", kr:"산중관리동",         ja:"規則書",        link:"https://play.google.com/store/apps/details?id=com.occultai.napolitan" },
  { date:"2026.Q3", status:"UPCOMING", kr:"6월 11일, 영원히",   ja:"永遠の回帰",    link:"https://play.google.com/store/apps/details?id=com.occultai.june" },
  { date:"2026.Q4", status:"PLAN",     kr:"Rakughost 정식판",    ja:"Rakughost 正式版" },
  { date:"2026.Q4", status:"PLAN",     kr:"DEADZONE II 모바일",  ja:"DEADZONE II モバイル" },
];

function ScheduleSection({ lang }) {
  const ref = useReveal();
  const gold = "#ffb347";
  const statusColor = { RELEASED:"#3dffb0", UPCOMING:gold, PLAN:"#6c5fff" };

  return (
    <section id="schedule" className="section-pad">
      <div ref={ref} className="reveal">
        <div style={{marginBottom:28,display:"flex",justifyContent:"space-between",alignItems:"flex-end",flexWrap:"wrap",gap:16}}>
          <div>
            <div style={{fontFamily:"var(--mono)",fontSize:10,letterSpacing:".2em",color:gold,marginBottom:10,textTransform:"uppercase"}}>Schedule · 日程表 · 일정표</div>
            <h2 style={{fontFamily:"var(--display)",fontSize:"clamp(32px,4.5vw,56px)",fontWeight:400,letterSpacing:".02em",lineHeight:1,color:"#fff"}}>
              {lang==="kr" ? "릴리스 계획" : "リリース予定"}
            </h2>
          </div>
          <MetaStrip items={[
            {label:"RELEASED", value:"3", accent:"#3dffb0"},
            {label:"UPCOMING", value:"3", accent:gold},
            {label:"PLAN",     value:"2", accent:"#6c5fff"},
          ]}/>
        </div>

        <div style={{border:"1px solid var(--line)",borderRadius:14,background:"rgba(0,0,0,.22)",overflow:"hidden"}}>
          {SCHEDULE.map((s,i)=>{
            const c = statusColor[s.status];
            const Inner = (
              <div style={{
                display:"flex",gap:14,alignItems:"center",padding:"14px 18px",
                borderBottom: i<SCHEDULE.length-1?"1px solid var(--line)":"none",
                transition:"background .25s",flexWrap:"wrap",
              }}
                onMouseEnter={e=>{e.currentTarget.style.background=`${c}08`}}
                onMouseLeave={e=>{e.currentTarget.style.background="transparent"}}>
                <div style={{fontFamily:"var(--mono)",fontSize:11,color:"var(--fg3)",letterSpacing:".12em",minWidth:80}}>{s.date}</div>
                <div style={{fontFamily:"var(--mono)",fontSize:9,color:c,letterSpacing:".2em",minWidth:92,padding:"2px 8px",border:`1px solid ${c}33`,borderRadius:100,textAlign:"center"}}>{s.status}</div>
                <div style={{flex:1,display:"flex",gap:10,alignItems:"baseline",flexWrap:"wrap",minWidth:200}}>
                  <span style={{fontFamily:"var(--sans)",fontSize:14,color:"#fff",fontWeight:600}}>{lang==="kr" ? s.kr : s.ja}</span>
                  <span style={{fontFamily:"var(--serif)",fontSize:11,color:"var(--fg3)"}}>{lang==="kr" ? s.ja : s.kr}</span>
                </div>
                {s.link && <span style={{fontFamily:"var(--mono)",fontSize:11,color:c}}>↗</span>}
              </div>
            );
            return s.link ? (
              <a key={i} href={s.link} target="_blank" rel="noopener noreferrer" data-h style={{display:"block",textDecoration:"none",color:"inherit"}}>{Inner}</a>
            ) : (
              <div key={i}>{Inner}</div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── LOGO SHOWCASE ────────────────────────────────────────────
function LogoShowcase({ lang }) {
  const ref = useReveal();
  return (
    <section className="section-pad" style={{paddingBottom:40}}>
      <div ref={ref} className="reveal" style={{
        padding:"44px 24px 36px",border:"1px solid var(--line)",borderRadius:20,
        background:"linear-gradient(135deg,rgba(108,95,255,.03),rgba(255,92,138,.02))",
        position:"relative",overflow:"hidden",
      }}>
        <PropSVG type="sigil" size={300} color="#6c5fff" opacity={.05} style={{position:"absolute",top:-80,left:"50%",transform:"translateX(-50%)"}}/>
        <PropSVG type="barcode" size={90} color="#ff5c8a" opacity={.25} style={{position:"absolute",bottom:10,right:18}}/>

        <MetaStrip align="center" items={[
          {label:"MARK",        value:"BHL × OCC"},
          {label:"YEAR",        value:"2026"},
          {label:"DESIGNED BY", value:"BEHELIT", accent:"#ff5c8a"},
        ]}/>

        <div style={{display:"flex",justifyContent:"center",alignItems:"center",gap:"clamp(20px,4vw,60px)",flexWrap:"wrap",margin:"32px 0 20px",position:"relative",zIndex:1}}>
          <div style={{textAlign:"center"}}>
            <div style={{fontFamily:"var(--display)",fontSize:"clamp(36px,5vw,64px)",color:"#fff",letterSpacing:".04em",lineHeight:1}}>BEHELIT</div>
            <div style={{fontFamily:"var(--mono)",fontSize:9,color:"var(--fg3)",marginTop:6,letterSpacing:".3em"}}>01 · DISPLAY</div>
          </div>
          <div style={{textAlign:"center"}}>
            <div style={{display:"inline-flex",alignItems:"center",justifyContent:"center",width:64,height:64,borderRadius:"50%",border:"2px solid #ff5c8a",color:"#ff5c8a",fontSize:32,fontFamily:"serif"}}>♠</div>
            <div style={{fontFamily:"var(--mono)",fontSize:9,color:"var(--fg3)",marginTop:6,letterSpacing:".3em"}}>02 · MARK</div>
          </div>
          <div style={{textAlign:"center"}}>
            <div style={{fontFamily:"var(--serif)",fontSize:"clamp(22px,3vw,36px)",color:"#6c5fff",letterSpacing:".15em",fontStyle:"italic"}}>OccultAI</div>
            <div style={{fontFamily:"var(--mono)",fontSize:9,color:"var(--fg3)",marginTop:6,letterSpacing:".3em"}}>03 · SERIF</div>
          </div>
          <div style={{textAlign:"center"}}>
            <div style={{fontFamily:"var(--mono)",fontSize:"clamp(14px,2vw,20px)",color:"#3dffb0",letterSpacing:".2em",border:"1px dashed #3dffb066",padding:"7px 14px"}}>BHL × OCC</div>
            <div style={{fontFamily:"var(--mono)",fontSize:9,color:"var(--fg3)",marginTop:6,letterSpacing:".3em"}}>04 · MONO</div>
          </div>
        </div>

        <div style={{fontFamily:"'Instrument Serif',serif",fontStyle:"italic",fontSize:13,color:"var(--fg3)",textAlign:"center",letterSpacing:".04em"}}>
          {lang==="kr" ? "두 브랜드, 하나의 회로" : "二つのブランド、一つの回路"}
        </div>
      </div>
    </section>
  );
}

// ─── CONTACT ──────────────────────────────────────────────────
function ContactSection({ mode, lang }) {
  const ref = useReveal();
  const isOccult = mode === "occult";

  return (
    <section id="contact" className="section-pad">
      <div ref={ref} className="reveal" style={{
        textAlign:"center",
        padding:"clamp(56px,7vw,88px) 24px",borderRadius: isOccult ? 0 : 28,
        border: isOccult ? "1px solid rgba(0,255,0,.15)" : "1px solid rgba(108,95,255,.15)",
        background: isOccult ? "rgba(0,255,0,.02)" : "rgba(108,95,255,.04)",
        position:"relative",overflow:"hidden",
      }}>
        <div style={{position:"relative",zIndex:1}}>
          <div style={{fontFamily:"var(--mono)",fontSize:10,letterSpacing:".2em",color:isOccult?"#0f0":"var(--b)",marginBottom:16,textTransform:"uppercase"}}>
            {lang==="kr" ? "Open to Opportunity · 機会を求めて" : "機会を求めて · Open to Opportunity"}
          </div>
          <h2 style={{fontFamily:"var(--sans)",fontSize:"clamp(36px,5vw,64px)",fontWeight:800,letterSpacing:"-.03em",lineHeight:1,color:isOccult?"#0f0":"#fff",marginBottom:8}}>
            {lang==="kr" ? (<>같이 세계를<br />만들어볼까요?</>) : (<>一緒に世界を<br />作りましょうか？</>)}
          </h2>
          <p style={{fontFamily:"var(--serif)",fontStyle:"italic",fontSize:"clamp(14px,1.5vw,18px)",color:isOccult?"#0a0":"var(--fg2)",marginBottom:36,letterSpacing:".04em"}}>
            {lang==="kr" ? "一緒に世界を作りましょう" : "같이 세계를 만들어볼까요?"}
          </p>
          <div style={{display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap"}}>
            <a data-h href="mailto:behelitlee@gmail.com" style={{
              display:"inline-flex",alignItems:"center",gap:8,padding:"13px 26px",borderRadius:100,
              border: isOccult ? "1px solid rgba(0,255,0,.4)" : "1px solid rgba(108,95,255,.4)",
              background: isOccult ? "rgba(0,255,0,.08)" : "rgba(108,95,255,.12)",
              color: isOccult ? "#0f0" : "var(--b)",
              fontFamily:"var(--mono)",fontSize:12,letterSpacing:".08em",cursor:"pointer",textDecoration:"none",transition:"all .25s",
            }}>
              ✦ {lang==="kr" ? "연락하기" : "お問い合わせ"}
            </a>
            <a data-h href="https://github.com/OccultAIdev-Netizen" target="_blank" rel="noopener noreferrer" style={{
              display:"inline-flex",alignItems:"center",gap:8,padding:"13px 26px",borderRadius:100,
              border:"1px solid var(--line)",background:"rgba(255,255,255,.03)",
              color:"var(--fg2)",fontFamily:"var(--mono)",fontSize:12,letterSpacing:".08em",cursor:"pointer",textDecoration:"none",transition:"all .25s",
            }}>
              → GitHub
            </a>
            <a data-h href="https://play.google.com/store/apps/dev?id=6475761966907902838" target="_blank" rel="noopener noreferrer" style={{
              display:"inline-flex",alignItems:"center",gap:8,padding:"13px 26px",borderRadius:100,
              border:"1px solid var(--line)",background:"rgba(255,255,255,.03)",
              color:"var(--fg2)",fontFamily:"var(--mono)",fontSize:12,letterSpacing:".08em",cursor:"pointer",textDecoration:"none",transition:"all .25s",
            }}>
              ▶ Google Play
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── FOOTER ───────────────────────────────────────────────────
function Footer({ mode }) {
  return (
    <footer style={{borderTop:"1px solid var(--line)",padding:"28px clamp(24px,6vw,96px)",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:16}}>
      <div>
        <div style={{fontFamily:"var(--mono)",fontSize:11,color:"var(--fg3)",letterSpacing:".1em",marginBottom:4}}>
          이수현 · <span style={{fontFamily:"var(--serif)"}}>イ・スヒョン</span>
        </div>
        <div style={{fontFamily:"var(--mono)",fontSize:10,color:"var(--fg3)",letterSpacing:".08em"}}>
          <span style={{color: mode==="occult"?"#0f0":"var(--b)"}}>Behelit</span>
          <span style={{color:"var(--fg3)"}}> × </span>
          <span style={{color: mode==="occult"?"#0f0":"var(--o)"}}>OccultAI</span>
          <span style={{color:"var(--fg3)"}}> · 2012~ ゲーム → 2026~ AI</span>
        </div>
      </div>
      <div style={{display:"flex",alignItems:"center",gap:8}}>
        <span style={{animation:"blink 1.8s step-start infinite",color: mode==="occult"?"#0f0":"var(--b)",fontSize:12}}>▮</span>
        <span style={{fontFamily:"var(--mono)",fontSize:10,color:"var(--fg3)",letterSpacing:".08em"}}>Built with React · 커피 27잔 · 잠 부족</span>
      </div>
    </footer>
  );
}

// ─── APP ──────────────────────────────────────────────────────
export default function Portfolio() {
  const [mode, setMode] = useState("surface");
  const [lang, setLang] = useState("kr");
  const [glitching, setGlitching] = useState(false);
  const [easterEgg, setEasterEgg] = useState(false);

  useEffect(() => {
    const code = "behelit";
    let buf = "";
    const handler = (e) => {
      buf += e.key.toLowerCase();
      if (buf.length > code.length) buf = buf.slice(-code.length);
      if (buf === code) {
        setEasterEgg(true);
        setGlitching(true);
        setTimeout(() => setGlitching(false), 800);
        setTimeout(() => setEasterEgg(false), 4000);
        buf = "";
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const toggleMode = useCallback(() => {
    setGlitching(true);
    setTimeout(() => {
      setMode(m => m === "surface" ? "occult" : "surface");
      setGlitching(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 400);
  }, []);

  const toggleLang = useCallback(() => {
    setLang(l => l === "kr" ? "ja" : "kr");
  }, []);

  return (
    <div className={mode === "occult" ? "occult-mode" : ""} style={{
      background: mode === "occult" ? "#030305" : "var(--bg)",
      color: mode === "occult" ? "#0f0" : "var(--fg)",
      minHeight:"100vh",
      transition:"background .5s, color .5s",
    }}>
      <style>{CSS}</style>
      {glitching && <div className="glitch-overlay" />}
      {easterEgg && (
        <div style={{position:"fixed",inset:0,zIndex:99998,display:"flex",alignItems:"center",justifyContent:"center",background:"rgba(0,0,0,.85)",animation:"fadeIn .3s ease",pointerEvents:"none"}}>
          <div style={{fontFamily:"var(--serif)",fontSize:"clamp(48px,10vw,120px)",color:"#ff5c8a",textShadow:"0 0 60px rgba(255,92,138,.5)",animation:"float 2s ease infinite",textAlign:"center",lineHeight:1.2}}>
            ♠<br/>
            <span style={{fontFamily:"var(--mono)",fontSize:14,color:"#ff5c8a80",letterSpacing:".3em"}}>BEHELIT ACTIVATED</span>
          </div>
        </div>
      )}
      {mode === "surface" && <div className="noise-fixed"/>}
      {mode === "surface" && <div className="scanlines"/>}
      <Cursor/>
      <Nav mode={mode} onToggle={toggleMode} lang={lang} onLangToggle={toggleLang}/>
      <main>
        <Hero mode={mode} lang={lang}/>
        {mode === "surface" ? (
          <>
            <StatsBar lang={lang}/>
            <NowSection lang={lang}/>
            <TechMarquee/>
            <ProjectsSection lang={lang}/>
            <TechnicalDepth lang={lang}/>
            <HardwareSection lang={lang}/>
            <CuriositySection lang={lang}/>
            <CreatorSection lang={lang}/>
            <ScheduleSection lang={lang}/>
            <PhilosophySection lang={lang}/>
            <LogoShowcase lang={lang}/>
          </>
        ) : (
          <>
            <OccultAppsSection lang={lang}/>
            <OccultUpcomingSection lang={lang}/>
            <OccultPhilosophySection lang={lang}/>
          </>
        )}
        <ContactSection mode={mode} lang={lang}/>
      </main>
      <Footer mode={mode}/>
    </div>
  );
}
