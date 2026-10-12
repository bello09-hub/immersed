import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { ArrowUpRight, ArrowLeft, ArrowRight, Plus, Sparkles, Heart, Activity, Brain, Smile, BookOpen, Users, GraduationCap, BriefcaseBusiness, House, Settings2, ChevronRight, MapPin, Bookmark, RotateCcw, Shuffle, Check, Leaf, Baby, CalendarDays, Wallet, Save, PanelLeftOpen, UserRound, Footprints, Waves } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { annualEvent, chooseYear, normalizeLife, resolveAthletics, canTrain, startTraining, countries, isLife, makeLife, randomName, stage, takeAction, type Life, type Stats, type LifeEvent, type Sport } from '@/lib/life-engine';
import { OpeningScreens, type Screen } from '@/components/opening-screens';
import { TextSizeControl, type TextSize } from '@/components/text-size-control';
import { AthleticsGame } from '@/components/athletics-game';

export const Route = createFileRoute('/')({
  head: () => ({ meta: [
    { title: 'IMMERSED — Your life. Your story.' },
    { name: 'description', content: 'Live a life that is entirely yours. Explore relationships, grow through meaningful choices, and write your story in IMMERSED, a text-based life simulation.' },
    { property: 'og:title', content: 'IMMERSED — Your life. Your story.' },
    { property: 'og:description', content: 'An endless possibility. Your choice. Your story. A thoughtful text-based life simulation.' },
    { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary_large_image' },
  ] }),
  component: Index,
});
const navigation = [
  { label: 'My life', icon: BookOpen }, { label: 'Relationships', icon: Users }, { label: 'Education', icon: GraduationCap },
  { label: 'Career', icon: BriefcaseBusiness }, { label: 'Activities', icon: Sparkles }, { label: 'Assets', icon: House },
];
const statInfo = [ { key: 'happiness', label: 'Happiness', icon: Smile }, { key: 'health', label: 'Health', icon: Heart }, { key: 'smarts', label: 'Smarts', icon: Brain }, { key: 'looks', label: 'Looks', icon: Sparkles }, { key: 'creativity', label: 'Creativity', icon: Sparkles }, { key: 'mischief', label: 'Mischief', icon: Baby }, { key: 'toughness', label: 'Toughness', icon: Activity } ] as const;
function money(value: number, country: string) { return new Intl.NumberFormat('en', { style: 'currency', currency: country === 'Nigeria' ? 'NGN' : country === 'Ghana' ? 'GHS' : country === 'United Kingdom' ? 'GBP' : country === 'France' ? 'EUR' : country === 'Japan' ? 'JPY' : country === 'Brazil' ? 'BRL' : country === 'Canada' ? 'CAD' : 'USD', maximumFractionDigits: 0 }).format(value); }
function Index() {
  const [life, setLife] = useState<Life>(() => makeLife());
  const [tab, setTab] = useState('Profile');
  const [drawer, setDrawer] = useState(false);
  const [textSize, setTextSize] = useState<TextSize>('small');
  const [trainingRace, setTrainingRace] = useState(false);
  const [race, setRace] = useState<Sport | null>(null);
  function train(sport: Sport) { if (!canTrain(life)) return; setLife(startTraining(life, sport)); setTrainingRace(true); setDrawer(false); setRace(sport); }
  function openPanel(panel: string) { setTab(panel); setDrawer(true); setNotice(''); }
  const [screen, setScreen] = useState<Screen>('intro');
  const [revealed, setRevealed] = useState(false);
  const [started, setStarted] = useState(false);
  const [modal, setModal] = useState<'new' | 'settings' | 'saved' | null>(null);
  const [event, setEvent] = useState<LifeEvent | null>(null);
  const [saved, setSaved] = useState<Life | null>(null);
  const [notice, setNotice] = useState('');
  const [name, setName] = useState(''); const [country, setCountry] = useState('Nigeria'); const [sex, setSex] = useState('Female');
  const [motion, setMotion] = useState(true); const [contrast, setContrast] = useState(false); const [ready, setReady] = useState(false);
  useEffect(() => {
    try { const raw = localStorage.getItem('immersedLife'); if (raw) { const parsed: unknown = JSON.parse(raw); if (isLife(parsed)) { setSaved(normalizeLife(parsed)); } }
      const prefs = JSON.parse(localStorage.getItem('immersedSettings') ?? '{}'); setMotion(prefs.motion !== false); setContrast(prefs.contrast === true); setTextSize(prefs.textSize === 'medium' || prefs.textSize === 'large' ? prefs.textSize : 'small');
    } catch { setNotice('Your previous save could not be read. A fresh life is ready.'); }
    setReady(true);
  }, []);
  useEffect(() => { if (!ready || !started) return; try { localStorage.setItem('immersedLife', JSON.stringify(life)); setSaved(life); } catch { setNotice('Saving is unavailable in this browser. Keep this page open.'); } }, [life, ready, started]);
  useEffect(() => { if (ready) { try { localStorage.setItem('immersedSettings', JSON.stringify({ motion, contrast, textSize })); } catch {} } }, [motion, contrast, textSize, ready]);
  const canAct = life.alive && life.actions < 3;
  function act(title: string, text: string, effects: Partial<Stats>, cost = 0) {
    if (!canAct || life.money < cost) return;
    setLife(takeAction(life, title, text, effects, -cost)); setNotice(text);
  }
  function newLife() { setLife(makeLife(name, country, sex, true)); setStarted(true); setScreen('life'); setDrawer(false); setModal(null); setNotice('A new story begins.'); }
  function loadLife() { if (!saved) return; setLife(saved); setStarted(true); setScreen('life'); setDrawer(false); setNotice('Your saved life has been loaded.'); }
  useEffect(() => { if (screen === 'life' && !drawer) { document.getElementById('latest-memory')?.scrollIntoView({ block: 'nearest', behavior: motion ? 'smooth' : 'instant' }); } }, [life.journal.length, screen, drawer, motion]);
  function save() { try { localStorage.setItem('immersedLife', JSON.stringify(life)); setSaved(life); setNotice('Your life is saved on this browser.'); } catch { setNotice('This browser could not save your life.'); } }
  return <div className={`game-shell text-size-${textSize} ${!motion ? 'no-motion' : ''} ${contrast ? 'high-contrast' : ''}`}>
    {screen !== 'life' ? <OpeningScreens screen={screen} setScreen={setScreen} ready={ready} saved={saved} name={name} setName={setName} country={country} setCountry={setCountry} sex={sex} setSex={setSex} motion={motion} setMotion={setMotion} contrast={contrast} setContrast={setContrast} revealed={revealed} setRevealed={setRevealed} begin={newLife} load={loadLife} notice={notice} textSize={textSize} setTextSize={setTextSize}/> : <div className="text-life">
    <header className="topbar">
      <Button variant="ghost" className="brand" aria-label="Main menu" onClick={() => {setScreen('menu');setNotice('');}}><span className="brand-mark"><Leaf size={19}/></span><span>IMMERSED</span></Button>
      <span className="top-tagline">Your life. Your choices. Your story.</span>
      <div className="header-actions"><span className="saved-status"><span className="status-dot"/> {ready ? 'Autosave on' : 'Your story awaits'}</span><Button variant="ghost" size="icon" title="Settings" aria-label="Settings" onClick={() => setModal('settings')}><Settings2/></Button><div className="profile-avatar">{life.name.split(' ').map(n => n[0]).slice(0,2).join('')}</div></div>
    </header>
    <div className="app-layout">
      <nav className="icon-rail" aria-label="Game sections">
        <Button variant="ghost" size="icon" title="Main menu" aria-label="Main menu" onClick={()=>setScreen('menu')}><Leaf/></Button>
        <Button variant="ghost" size="icon" title="Stats and profile" aria-label="Stats and profile" onClick={()=>openPanel('Profile')}><UserRound/></Button>
        <Button variant="ghost" size="icon" title="Relationships and family" aria-label="Relationships and family" onClick={()=>openPanel('Relationships')}><Users/></Button>
        <Button variant="ghost" size="icon" title="School and activities" aria-label="School and activities" onClick={()=>openPanel('Education')}><GraduationCap/></Button>
        <Button variant="ghost" size="icon" title="More / Expand" aria-label="More / Expand" onClick={()=>openPanel('More')}><PanelLeftOpen/></Button>
        <Button variant="ghost" size="icon" className="rail-bottom" title="Save life" aria-label="Save life" onClick={save}><Save/></Button>
      </nav>
      <main className="main-content" hidden={drawer}>
        <section className="life-identity"><div><h1>{life.name}</h1><p>{life.sex} · {life.country} · {stage(life.age)}</p></div><div className="life-age"><strong>{life.age}</strong><span>YEARS OLD</span></div></section>
        <div className="life-quick-stats">{statInfo.slice(0, 4).map(({key,label})=><div className={`stat-${key}`} key={key}><span>{label}<strong>{life.stats[key]}%</strong></span><progress aria-label={label} value={life.stats[key]} max={100}/></div>)}</div>
        <div className="content-grid">
          <section className="story-section">
            <div className="section-heading"><h2>Your life journal</h2><span><BookOpen size={13}/>{life.journal.length} memories</span></div>
            <div className="journal" aria-label="Life journal">{life.journal.map((entry,i) => <div key={i} id={i === life.journal.length-1 ? 'latest-memory' : undefined}>
              {(i === 0 || life.journal[i-1]?.age !== entry.age) && <h3 className="year-heading">Age {entry.age}{entry.age === 0 ? ' · Newborn' : ''}</h3>}
              <article className="journal-entry"><div><h3>{entry.title}</h3>{entry.choice && <p className="written-choice">I chose: {entry.choice}.</p>}<p>{entry.text}</p></div></article>
            </div>)}</div>
<div className="next-year"><div><span className="next-icon"><CalendarDays size={20}/></span><div><h3>{life.alive ? 'What will the next year bring?' : 'Every ending is a beginning.'}</h3><p>{life.alive ? 'A little older. A little more you.' : 'A new life has a whole new story to tell.'}</p></div></div><Button className="age-button" onClick={() => life.alive ? setEvent(annualEvent(life)) : setScreen('creator')}>{life.alive ? <><Plus size={18}/>AGE<ArrowRight size={16}/></> : <><Plus/>New life</>}</Button></div>
            {notice && <p className="notice" role="status"><Check size={14}/>{notice}</p>}
          </section>
                  </div>
</main>
    {drawer && <section className="hub-screen" aria-label={`${tab} hub`}>
      <header className="hub-header"><Button variant="ghost" onClick={()=>setDrawer(false)}><ArrowLeft/>Back to Story</Button><div className="drawer-brand">IMMERSED · YOUR WORLD</div><h1>{tab === 'More' ? 'Your world' : tab === 'Profile' ? 'Stats & profile' : tab}</h1><p>{life.name} · Age {life.age} · {stage(life.age)}</p></header><div className="hub-content">
      {tab === 'More' && <nav className="drawer-nav" aria-label="Life panels">{[{label:'Profile',icon:UserRound},...navigation.filter(n=>n.label !== 'My life')].map(({label,icon:Icon})=><Button key={label} variant="ghost" className={tab===label?'selected':''} onClick={()=>setTab(label)}><Icon/>{label}</Button>)}</nav>}
      {tab === 'Profile' && <><div className="drawer-stats">{statInfo.map(({key,label,icon:Icon})=><div className={`stat-row stat-${key}`} key={key}><div><span><Icon size={16}/>{label}</span><strong>{life.stats[key]}%</strong></div><progress aria-label={label} value={life.stats[key]} max={100}/></div>)}</div><div className="wealth-row"><span>Net worth</span><strong>{money(life.money,life.country)}</strong></div><p className="save-description">{life.family}</p></>}
      <div className="feature-list">
              {tab === 'Relationships' && life.people.map((person,index) => <article className="person-row" key={person.name}><div className="person-avatar"><Users size={21}/></div><div className="person-details"><h3>{person.name}</h3><p>{person.role} · {person.bond >= 80 ? 'Very close' : person.bond >= 50 ? 'Growing closer' : 'Distant'}</p><progress value={person.bond} max={100}/></div><Button variant="outline" disabled={!canAct} onClick={() => { const updated = takeAction(life, 'Time together', `I spent some time with my ${person.role.toLowerCase()}. We laughed and felt a little closer.`, { happiness: 4 }); updated.people = updated.people.map((p,i) => i === index ? {...p,bond:Math.min(100,p.bond+5)} : p); setLife(updated); setNotice('A little time together makes a difference.'); }}>Spend time</Button></article>)}
              {tab === 'Education' && <><div className="feature-summary"><GraduationCap/><h3>{life.education}</h3><p>{life.age < 6 ? 'Your first classroom is the world around you.' : 'Every new thing you learn becomes a part of you.'}</p></div><Action title={life.age < 6 ? 'Look at picture books' : 'Study a little harder'} detail="Nurture your curiosity" icon={BookOpen} disabled={!canAct} onClick={() => act('Something new', 'I spent time with a book and discovered something I did not know before.', { smarts: 5, happiness: 1 })}/></>}
              {tab === 'Career' && <><div className="feature-summary"><BriefcaseBusiness/><h3>{life.job}</h3><p>{life.age < 18 ? 'For now, growing up is your most important job.' : 'A livelihood, a calling, or a little of both.'}</p></div>{life.age >= 18 && life.job === 'Not working' && <Action title="Apply for a shop assistant role" detail="Start earning an income" icon={BriefcaseBusiness} disabled={!canAct} onClick={() => { const updated = takeAction(life,'My first job','I was hired as a shop assistant. A new kind of independence awaits.',{happiness:4}); updated.job = 'Shop assistant'; setLife(updated); }}/>}<Action title="Practice a useful skill" detail="Build tomorrow’s possibilities" icon={Brain} disabled={!canAct} onClick={() => act('Practice makes progress', 'I practiced a new skill. It is not easy yet, but I am making progress.', { smarts: 5 })}/>{life.job !== 'Not working' && life.job !== 'Retired' && <Action title="Give work my best" detail="A little extra effort" icon={BriefcaseBusiness} disabled={!canAct} onClick={() => act('An honest day’s work', 'I put extra care into my work and earned a small bonus.',{smarts:2,happiness:-1},-500)}/>}</>}
              {tab === 'Activities' && <><p className="training-budget">Training {life.training.sessions}/4 this year · All sports</p><div className="athletics-records">{(['sprint','swim'] as const).map(sport=><div key={sport}><h3>{sport === 'sprint' ? 'Sprint' : 'Swimming'}</h3><dl><div><dt>Last completion</dt><dd>{life.training.lastResults?.[sport]?.completionMs != null ? `${((life.training.lastResults[sport]?.completionMs ?? 0)/1000).toFixed(2)}s` : life.training.lastResults?.[sport] ? 'Not finished' : '—'}</dd></div><div><dt>Personal best</dt><dd>{life.training.personalBests[sport] !== undefined ? `${((life.training.personalBests[sport] ?? 0)/1000).toFixed(2)}s` : '—'}</dd></div></dl></div>)}</div>{life.age >= 5 && life.alive && <><Action title="Sprint training" detail={`Progress ${life.training.progress.sprint} · Best ${life.training.personalBests.sprint ? (life.training.personalBests.sprint / 1000).toFixed(2) + 's' : '—'}`} icon={Footprints} disabled={!canTrain(life)} onClick={()=>train('sprint')}/><Action title="Swimming practice" detail={`Progress ${life.training.progress.swim} · Best ${life.training.personalBests.swim ? (life.training.personalBests.swim / 1000).toFixed(2) + 's' : '—'}`} icon={Waves} disabled={!canTrain(life)} onClick={()=>train('swim')}/></>}<Action title={life.age < 3 ? 'Play with my family' : 'Spend time outdoors'} detail="A breath of fresh air" icon={Leaf} disabled={!canAct} onClick={() => act('A brighter afternoon', 'I enjoyed a little fresh air and time with the people around me.', { health: 4, happiness: 5 })}/><Action title="Explore something creative" detail="Let your imagination wander" icon={Sparkles} disabled={!canAct} onClick={() => act('A little imagination', 'I made something just for the joy of it. There is so much to discover.',{happiness:5,creativity:5})}/><Action title="Rest and recharge" detail="Take care of yourself" icon={Heart} disabled={!canAct} onClick={() => act('A moment of rest','I gave myself time to rest. Tomorrow can wait.',{health:6,happiness:2})}/></>}
              {tab === 'Assets' && <><div className="feature-summary"><House/><h3>{life.assets.length ? 'My possessions & medals' : 'A simpler beginning'}</h3><p>{life.age < 18 ? 'Home is with your family. Your own chapter will come in time.' : 'Build a life around the things that matter to you.'}</p></div>{life.assets.map((a, assetIndex) => <div className="owned-asset" key={`${a}-${assetIndex}`}><House/><span>{a}</span><Check size={16}/></div>)}{life.age >= 18 && !life.assets.includes('My first home') && <Action title="Buy my first home" detail={`${money(50000,life.country)} · A place to put down roots`} icon={House} disabled={!canAct || life.money < 50000} onClick={() => { const updated = takeAction(life,'A home of my own','I bought my first home. Turning the key felt like the start of something new.',{happiness:10},-50000); updated.assets = [...updated.assets,'My first home']; setLife(updated); }}/>}</>}
              <div className="action-budget">{life.actions}/3 moments spent this year{life.actions >= 3 ? ' · A new year is waiting.' : ''}</div>
            </div>
      {notice && <p className="notice" role="status">{notice}</p>}<div className="drawer-actions"><Button variant="ghost" onClick={save}><Save/>Save life</Button><Button variant="ghost" onClick={()=>{setDrawer(false);setModal('settings');}}><Settings2/>Settings</Button><Button variant="ghost" onClick={()=>{setDrawer(false);setScreen('menu');}}><Leaf/>Main menu</Button></div>
    </div></section>}
    </div>
    </div>}
    {race && <AthleticsGame sport={race} personalBest={life.training.personalBests[race]} stats={life.stats} training={trainingRace} textSize={textSize} onComplete={(taps,time)=>{const updated=resolveAthletics(life,race,taps,time);setLife(updated);try{localStorage.setItem('immersedLife',JSON.stringify(updated));setSaved(updated);}catch{setNotice('This browser could not save your race.');}}} onFinish={()=>{setRace(null);setDrawer(false);setNotice('The race is written in your story.');}}/>}
    <Dialog open={modal !== null} onOpenChange={open => { if(!open) setModal(null); }}><DialogContent className={`game-dialog text-size-${textSize} ${contrast ? 'high-contrast' : ''}`}>
      {modal === 'new' && <><div className="dialog-symbol"><Sparkles/></div><DialogTitle>A new life.</DialogTitle><DialogDescription>You don’t choose the life you’re born into. You discover it.{ready && saved ? ' Starting anew will replace the saved life on this browser.' : ''}</DialogDescription><form onSubmit={e => {e.preventDefault();newLife();}}><label className="form-field">Character name <span className="optional">optional</span><div className="name-input"><input aria-label="Character name" value={name} onChange={e=>setName(e.target.value)} placeholder="Let fate choose a name" maxLength={32}/><Button type="button" variant="ghost" size="icon" title="Random name" aria-label="Random name" onClick={()=>setName(randomName(country))}><Shuffle/></Button></div></label><label className="form-field">Birth country<select value={country} onChange={e=>setCountry(e.target.value)}>{countries.map(c=><option key={c}>{c}</option>)}</select></label><label className="form-field">Sex<select value={sex} onChange={e=>setSex(e.target.value)}><option>Female</option><option>Male</option></select></label><Button className="full-action" type="submit">Be born<ArrowRight/></Button></form></>}
      {modal === 'settings' && <><DialogTitle>Make it feel like you.</DialogTitle><DialogDescription>A little space to set your own pace.</DialogDescription><TextSizeControl value={textSize} onChange={setTextSize}/><div className="setting-row"><label htmlFor="motion">Gentle animations</label><Switch id="motion" checked={motion} onCheckedChange={setMotion}/></div><div className="setting-row"><label htmlFor="contrast">Higher text contrast</label><Switch id="contrast" checked={contrast} onCheckedChange={setContrast}/></div><p className="save-description">Your life and preferences are saved on this browser.</p><Button className="full-action" onClick={()=>setModal(null)}>Done<Check/></Button></>}
      {modal === 'saved' && <><DialogTitle>Your saved story.</DialogTitle><DialogDescription>Pick up right where you left off.</DialogDescription>{saved ? <div className="saved-life"><div className="person-avatar"><Bookmark/></div><div><h3>{saved.name}</h3><p>{saved.country} · Age {saved.age} · {stage(saved.age)}</p></div></div> : <p>No saved life yet.</p>}<Button className="full-action" disabled={!saved} onClick={()=>{if(saved){setLife(saved);setTab('My life');setModal(null);setNotice('Your saved life has been loaded.');}}}><RotateCcw/>Load life</Button></>}
    </DialogContent></Dialog>
    <Dialog open={event !== null} onOpenChange={open=>{if(!open)setEvent(null);}}><DialogContent className={`game-dialog event-dialog text-size-${textSize}`}><div className="event-age">AGE {event?.age ?? life.age+1} · A NEW CHAPTER</div><div className="dialog-symbol"><Sparkles/></div><DialogTitle>{event?.title}</DialogTitle><DialogDescription>{event?.text}</DialogDescription><div className="choices" aria-label="Written choices">{event?.choices.map(choice=><Button key={choice.label} variant="outline" onClick={()=>{if(event){setLife(chooseYear(life,event,choice));setEvent(null);setDrawer(false);if(choice.athletic){setTrainingRace(false);setRace(choice.athletic);}setNotice('Your story has moved forward.');}}}>{choice.label}<ArrowUpRight/></Button>)}</div></DialogContent></Dialog>
  </div>;
}
function Action({title,detail,icon:Icon,disabled,onClick}:{title:string;detail:string;icon:typeof Heart;disabled:boolean;onClick:()=>void}) {return <Button variant="ghost" className="activity-action" disabled={disabled} onClick={onClick}><span className="action-icon"><Icon/></span><span><strong>{title}</strong><small>{detail}</small></span><ChevronRight/></Button>;}
