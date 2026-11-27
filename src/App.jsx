import { useEffect, useRef, useState } from 'react'
import { sb } from './supabase'

const OFFSET = { 'Asia/Kolkata': 330, 'America/Phoenix': -420 } // minutes; neither zone has DST
const useNow = () => { const [n, s] = useState(new Date()); useEffect(() => { const t = setInterval(() => s(new Date()), 1000); return () => clearInterval(t) }, []); return n }
const clock = (d, tz) => d.toLocaleString('en-GB', { timeZone: tz, dateStyle: 'medium', timeStyle: 'medium' })

function Sky() {
  const stars = useRef([...Array(25)].map(() => ({ l: Math.random() * 100, t: Math.random() * 100, d: Math.random() * 3 })))
  return <>{stars.current.map((s, i) => <span key={i} className="star" style={{ left: s.l + 'vw', top: s.t + 'vh', animationDelay: s.d + 's' }} />)}
    <span className="bf">🦋</span><span className="bf" style={{ animationDelay: '9s' }}>🦋</span></>
}

function Login() {
  const [email, setE] = useState(''), [pw, setP] = useState(''), [err, setErr] = useState('')
  const go = async e => { e.preventDefault(); const { error } = await sb.auth.signInWithPassword({ email, password: pw }); if (error) setErr(error.message) }
  return <form className="wrap card" onSubmit={go} style={{ marginTop: '15vh' }}>
    <h2>Private entrance 🌙</h2>
    <input aria-label="Email" type="email" placeholder="Email" value={email} onChange={e => setE(e.target.value)} />
    <input aria-label="Password" type="password" placeholder="Password" value={pw} onChange={e => setP(e.target.value)} />
    <button>Enter</button><p className="small">{err}</p></form>
}

function Welcome({ onEnter }) {
  return <div className="wrap center">
    <div className="moon">🌙</div><div>🌹 ✦ 🦋 ✦ 🌹</div>
    <h1>Somewhere between today and forever...</h1>
    <p>A little surprise is waiting for you.</p>
    <p className="small">OPERATION: FIRST MEET</p>
    <div style={{ fontSize: '3rem' }}>💌</div><br />
    <button onClick={onEnter}>ENTER OUR LITTLE WORLD</button></div>
}

function Countdown({ tz }) {
  const now = useNow()
  const target = Date.UTC(2026, 11, 4, 17, 0) - OFFSET[tz] * 60000 // Dec 4, 5 PM in the viewer's own zone
  const s = Math.floor(Math.max(0, target - now) / 1000)
  return <>
    <div className="clocks">
      <div className="card"><div className="small">Hyderabad (IST)</div>{clock(now, 'Asia/Kolkata')}</div>
      <div className="card"><div className="small">Arizona (MST)</div>{clock(now, 'America/Phoenix')}</div></div>
    <div className="card" style={{ textAlign: 'center' }}><div className="count">
      {Math.floor(s / 86400)}d {Math.floor(s % 86400 / 3600)}h {Math.floor(s % 3600 / 60)}m {s % 60}s</div>
      <div className="small">until December 4</div></div></>
}

function songEmbed(url) {
  if (!url) return null
  const yt = url.match(/(?:v=|youtu\.be\/)([\w-]{11})/); if (yt) return `https://www.youtube.com/embed/${yt[1]}`
  const sp = url.match(/open\.spotify\.com\/track\/(\w+)/); if (sp) return `https://open.spotify.com/embed/track/${sp[1]}`
  return null
}
function Song({ c }) {
  const src = songEmbed(c.song_url), q = encodeURIComponent(`${c.song_title} ${c.song_artist}`)
  return <div className="card"><div className="small">🎵 Today's song</div>
    <b>{c.song_title}</b> — {c.song_artist}
    {src ? <iframe title="song" src={src} width="100%" height="152" allow="encrypted-media" style={{ border: 0, marginTop: 8, borderRadius: 12 }} />
      : <p><a className="btn ghost" target="_blank" rel="noreferrer" href={`https://www.youtube.com/results?search_query=${q}`}>Listen on YouTube</a></p>}</div>
}

function YesNo({ onYes }) {
  const [pos, setPos] = useState({ left: '60%', top: 10 }), [done, setDone] = useState(false)
  const dodge = e => { e.preventDefault(); setPos({ left: Math.random() * 70 + '%', top: Math.random() * 80 }) }
  if (done) return <div className="center"><h2>MISSION ACCEPTED! 🦋</h2><p>Some things are better experienced than imagined.</p><p>See you soon.</p></div>
  return <div className="yesno"><button onClick={() => { setDone(true); onYes() }}>YES ❤️</button>
    <button className="no ghost" style={pos} onMouseEnter={dodge} onTouchStart={dodge} onClick={dodge} tabIndex={-1} aria-hidden="true">NO 🙃</button></div>
}

function Thread({ q, me, names }) {
  const [rows, setRows] = useState([]), [txt, setTxt] = useState(''), [st, setSt] = useState('')
  const load = async () => {
    const { data } = await sb.from('responses').select('*').eq('question_id', q.id).order('created_at')
    setRows(data || []); const mine = (data || []).find(r => r.user_id === me); if (mine) setTxt(t => t || mine.content)
  }
  useEffect(() => {
    load()
    const ch = sb.channel('r' + q.id).on('postgres_changes', { event: '*', schema: 'public', table: 'responses', filter: `question_id=eq.${q.id}` }, load).subscribe()
    return () => { sb.removeChannel(ch) }
  }, [q.id])
  const save = async (content = txt) => {
    setSt('Saving…')
    const { error } = await sb.from('responses').upsert({ question_id: q.id, user_id: me, content, updated_at: new Date().toISOString() }, { onConflict: 'question_id,user_id' })
    setSt(error ? 'Error: ' + error.message : 'Saved ✓')
  }
  const yesno = q.question_text.startsWith('ARE YOU READY')
  const mine = rows.find(r => r.user_id === me)
  return <div className="card"><h3>{q.question_text}</h3>
    {yesno ? <YesNo onYes={() => save('YES ❤️')} /> : <>
      {rows.filter(r => r.user_id !== me).map(r => <div key={r.id} className="hand">💬 {names[r.user_id] || 'Them'}: {r.content}
        {r.updated_at > r.created_at && <span className="small"> (edited)</span>}</div>)}
      <textarea aria-label="Your answer" value={txt} onChange={e => setTxt(e.target.value)} placeholder="Write here…" />
      <button onClick={() => save()}>Save</button> <span className="small">{st}</span>
      {mine && <div className="small">Last saved {new Date(mine.updated_at).toLocaleString()}</div>}</>}</div>
}

function Chapter({ c, me, names, back }) {
  const [open, setOpen] = useState(false)
  return <div className="wrap"><button className="ghost" onClick={back}>← Back</button>
    <h2>Day {c.chapter_number} · {c.title}</h2><div className="small">{c.chapter_date}</div>
    {!open ? <div style={{ textAlign: 'center', paddingTop: 30 }}><button className="env" aria-label="Open the envelope" onClick={() => setOpen(true)}>💌</button><p className="small">Tap to open</p></div>
      : <><div className="card hand">{c.message}</div><Song c={c} />
        {[...c.questions].sort((a, b) => a.sort_order - b.sort_order).map(q => <Thread key={q.id} q={q} me={me} names={names} />)}</>}</div>
}

function Home({ profile, chapters, pick }) {
  return <div className="wrap"><h2>Hello, {profile.display_name} 🦋</h2>
    <Countdown tz={profile.timezone} />
    <h3>Your little surprises</h3>
    {chapters.map(c => <div key={c.id} className="card" style={{ cursor: 'pointer' }} role="button" tabIndex={0} onClick={() => pick(c)} onKeyDown={e => e.key === 'Enter' && pick(c)}>
      💌 Day {c.chapter_number} — {c.title}</div>)}
    <div className="card small" style={{ textAlign: 'center' }}>Your next little surprise is resting. Come back later. 🌙</div></div>
}

export default function App() {
  const [session, setSession] = useState(null), [ready, setReady] = useState(false)
  const [profile, setProfile] = useState(null), [chapters, setChapters] = useState([]), [names, setNames] = useState({})
  const [entered, setEntered] = useState(false), [cur, setCur] = useState(null)
  useEffect(() => {
    sb.auth.getSession().then(({ data }) => { setSession(data.session); setReady(true) })
    const { data: l } = sb.auth.onAuthStateChange((_e, s) => setSession(s)); return () => l.subscription.unsubscribe()
  }, [])
  useEffect(() => {
    if (!session) return
    sb.from('profiles').select('*').then(({ data }) => { setProfile(data?.find(p => p.id === session.user.id) || false); setNames(Object.fromEntries((data || []).map(p => [p.id, p.display_name]))) })
    sb.from('chapters').select('*, questions(*)').order('chapter_number').then(({ data }) => setChapters(data || []))
  }, [session, entered])
  if (!ready) return <Sky />
  return <><Sky />{!session ? <Login /> : profile === false ? <div className="wrap card">Your account isn't added as a member yet. See README step 3.</div>
    : !profile ? null : !entered ? <Welcome onEnter={() => setEntered(true)} />
    : cur ? <Chapter c={cur} me={session.user.id} names={names} back={() => setCur(null)} />
    : <Home profile={profile} chapters={chapters} pick={setCur} />}</>
}
