import { ArrowLeft, ArrowRight, Shuffle, Leaf } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { countries, randomName, stage, type Life } from '@/lib/life-engine';

export type Screen = 'intro' | 'menu' | 'creator' | 'settings' | 'life';
type Props = {
  screen: Screen; setScreen: (screen: Screen) => void; ready: boolean; saved: Life | null;
  name: string; setName: (name: string) => void; country: string; setCountry: (country: string) => void;
  sex: string; setSex: (sex: string) => void; motion: boolean; setMotion: (value: boolean) => void;
  contrast: boolean; setContrast: (value: boolean) => void; revealed: boolean; setRevealed: (value: boolean) => void;
  begin: () => void; load: () => void; notice: string;
};
export function OpeningScreens(p: Props) {
  if (p.screen === 'intro') return <main className="opening-screen intro-screen">
    <Button variant="ghost" className="intro-tap" aria-label={p.revealed ? 'Enter IMMERSED' : 'Reveal tagline'} disabled={!p.ready} onClick={() => p.revealed ? p.setScreen('menu') : p.setRevealed(true)}>
      <Leaf className="opening-leaf" aria-hidden="true"/>
      <h1 className="opening-wordmark">IMMERSED</h1>
      {p.revealed && <p className="opening-tagline">An endless possibility. Your choice. Your story...</p>}
      <span className="tap-hint">{!p.ready ? 'LOADING YOUR WORLD...' : p.revealed ? 'TAP AGAIN TO ENTER' : 'TAP THE SCREEN'}</span>
      {!p.ready && <span className="opening-loading" role="progressbar" aria-label="Loading game"/>}
    </Button>
  </main>;
  if (p.screen === 'menu') return <main className="opening-screen menu-screen"><div className="opening-inner">
    <div className="menu-brand">IMMERSED</div><h1>ARE YOU READY<br/>TO BE IMMERSED?</h1>
    <div className="opening-buttons"><Button variant="outline" disabled={!p.ready || !p.saved} onClick={p.load}>LOAD GAME</Button><Button onClick={() => p.setScreen('creator')}>START GAME</Button><Button variant="outline" onClick={() => p.setScreen('settings')}>SETTINGS</Button></div>
    {p.saved && <p className="menu-save">{p.saved.name} · Age {p.saved.age} · {stage(p.saved.age)}</p>}
    {p.notice && <p className="opening-message" role="status">{p.notice}</p>}
    <p className="opening-footer">YOUR LIFE. YOUR CHOICES. YOUR STORY.</p>
  </div></main>;
  return <main className="opening-screen"><div className="opening-page"><div className="opening-page-head"><Button variant="ghost" size="icon" aria-label="Back to main menu" onClick={() => p.setScreen('menu')}><ArrowLeft/></Button><h1>{p.screen === 'creator' ? 'A new life' : 'Settings'}</h1></div>
    {p.screen === 'creator' ? <><p className="opening-description">You don’t choose the life you’re born into. You discover it.</p><form onSubmit={e => {e.preventDefault();p.begin();}}>
      <label className="form-field">Character name <span className="optional">(optional)</span><div className="name-input"><input aria-label="Character name" maxLength={32} placeholder="Leave blank for a generated name" value={p.name} onChange={e => p.setName(e.target.value)}/><Button variant="ghost" size="icon" type="button" aria-label="Random name" title="Random name" onClick={() => p.setName(randomName(p.country))}><Shuffle/></Button></div></label>
      <label className="form-field">Birth country<select value={p.country} onChange={e=>p.setCountry(e.target.value)}>{countries.map(c=><option key={c}>{c}</option>)}</select></label>
      <label className="form-field">Sex<select value={p.sex} onChange={e=>p.setSex(e.target.value)}><option>Female</option><option>Male</option></select></label>
      {p.saved && <p className="opening-description">Your new life will replace {p.saved.name}’s saved story on this browser.</p>}
      <Button type="submit" className="full-action">BE BORN<ArrowRight/></Button>
    </form></> : <><p className="opening-description">Make the experience feel right for you.</p><div className="setting-row"><label htmlFor="opening-motion">Atmospheric glow animation</label><Switch id="opening-motion" checked={p.motion} onCheckedChange={p.setMotion}/></div><div className="setting-row"><label htmlFor="opening-contrast">Higher text contrast</label><Switch id="opening-contrast" checked={p.contrast} onCheckedChange={p.setContrast}/></div><Button className="full-action" onClick={()=>p.setScreen('menu')}>DONE</Button></>}
  </div></main>;
}