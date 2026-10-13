import { useState } from 'react';
import { Heart, Users, Cake, PartyPopper, Crown, Lock, Star, Sparkles, Wine, Music, House, Building, Building2, Castle, Landmark, Hotel } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { formatMoney, isGrounded, parentPitch, pitches, type Life, type Pitch } from '@/lib/life-engine';
import { askBestFriend, askDate, askFriendship, birthdayCost, cakes, canPlanBirthday, canRunForPrefect, canSocialize, cleanerCost, cleanupParty, dutyDilemma, goOut, guestLists, homeTier, homeTiers, nightlife, parentAction, parentActions, partySizes, peerAction, peerActions, prefectDuty, prefectRoles, requestPermission, runForPrefect, socialOf, throwBirthday, type BirthdayPlan } from '@/lib/social-engine';

type Props = { life: Life; update: (life: Life) => void; textSize: string };
type Sheet = { kind: 'parent'; index: number } | { kind: 'peer'; name: string } | null;
const tierIcons = [Building, Hotel, House, Building2, Landmark, Castle];

export function HomeTier({ life }: { life: Life }) {
  const tier = homeTier(life); const index = homeTiers.findIndex(t => t.id === tier.id); const Icon = tierIcons[index] ?? House;
  return <article className={`home-tier home-tier-${index}`}><div className="home-tier-art" aria-hidden="true"><Icon/></div><div><span className="eyebrow">TIER {index + 1} OF {homeTiers.length}</span><h2>{tier.id}</h2><p>{tier.detail}</p><div className="tier-ladder" aria-label={`Home tier ${index + 1} of ${homeTiers.length}`}>{homeTiers.map((t, i) => <span key={t.id} className={i <= index ? 'on' : ''}/>)}</div></div></article>;
}

export function PrefectPanel({ life, update }: Omit<Props, 'textSize'>) {
  const s = socialOf(life).prefect; const [role, setRole] = useState('');
  if (!life.school) return null;
  return <><h2 className="hub-subtitle">Student leadership</h2>
    <dl className="hub-facts"><div><dt>Position</dt><dd>{s.role ?? 'None'}</dd></div><div><dt>Student popularity</dt><dd>{s.popularity}%</dd></div><div><dt>Respect</dt><dd>{s.respect}%</dd></div></dl>
    {life.age < 10 ? <p className="locked-note"><Lock/>Prefect elections open at age 10.</p> : s.role ? (s.lastDuty === life.age ? <p className="budget-line">This year's duty is done. Come back next year.</p> : <article className="duty-card"><Crown/><h3>{s.role} · Annual duty</h3><p>{dutyDilemma(s.role)}</p><div className="kid-actions"><Button variant="ghost" onClick={() => update(prefectDuty(life, 'fair'))}><span><strong>Be fair to everyone</strong><small>+Respect</small></span></Button><Button variant="ghost" onClick={() => update(prefectDuty(life, 'favor'))}><span><strong>Do my friends a favor</strong><small>+Popularity · −Respect</small></span></Button><Button variant="ghost" onClick={() => update(prefectDuty(life, 'strict'))}><span><strong>Follow the rulebook strictly</strong><small>+Respect · −Popularity</small></span></Button></div></article>)
      : canRunForPrefect(life) ? <div className="kid-actions">{prefectRoles(life).map(r => <Button variant="ghost" key={r} className={role === r ? 'selected' : ''} onClick={() => { setRole(r); update(runForPrefect(life, r)); }}><Crown/><span><strong>Run for {r}</strong><small>Win chance grows with popularity and smarts</small></span></Button>)}</div>
      : <p className="budget-line">{s.lastElection === life.age ? 'Elections are over for this year.' : 'Elections are closed right now.'}</p>}
  </>;
}

export function RelationshipsHub({ life, update, textSize }: Props) {
  const [sheet, setSheet] = useState<Sheet>(null);
  const [pitch, setPitch] = useState<number | null>(null);
  const [party, setParty] = useState<{ index: number; step: number; plan: Partial<BirthdayPlan> } | null>(null);
  const social = socialOf(life); const grounded = isGrounded(life); const child = life.age >= 5 && life.age < 18 && life.alive;
  const parents = life.people.map((p, index) => ({ p, index })).filter(({ p }) => ['Mother', 'Father'].includes(p.role));
  const others = life.people.map((p, index) => ({ p, index })).filter(({ p }) => !['Mother', 'Father'].includes(p.role));
  const friends = social.peers.filter(p => p.status !== 'peer'); const peers = social.peers.filter(p => p.status === 'peer');
  const sheetPeer = sheet?.kind === 'peer' ? social.peers.find(p => p.name === sheet.name) : undefined;
  const sheetParent = sheet?.kind === 'parent' ? life.people[sheet.index] : undefined;
  const act = (next: Life) => { update(next); };
  const row = (key: string, name: string, detail: string, bond: number, onClick: () => void) => <Button key={key} variant="ghost" className="person-tap" onClick={onClick}><span className="person-avatar"><Users size={19}/></span><span className="person-details"><strong>{name}</strong><small>{detail}</small><progress value={bond} max={100} aria-label={`${name} relationship`}/></span></Button>;
  return <>
    <p className="budget-line">Family approval {life.kid.approval}% · Moments {life.actions}/3 · {grounded ? 'Grounded this year' : 'Free to roam'}</p>
    <h2 className="hub-subtitle">Family</h2><div className="people-list">{parents.map(({ p, index }) => row(p.role, p.name, `${p.role} · Bond ${p.bond}%`, p.bond, () => setSheet({ kind: 'parent', index })))}
      {others.map(({ p }) => <div className="person-static" key={p.name}><strong>{p.name}</strong><small>{p.role} · Bond {p.bond}%</small></div>)}</div>
    {social.pendingCleanup && <article className="duty-card"><PartyPopper/><h3>The party is over…</h3><p>Paper plates everywhere. Frosting on the ceiling. What now?</p><div className="kid-actions"><Button variant="ghost" onClick={() => act(cleanupParty(life, 'tonight'))}><span><strong>Clean up tonight</strong><small>Earn praise</small></span></Button><Button variant="ghost" onClick={() => act(cleanupParty(life, 'tomorrow'))}><span><strong>Leave it for tomorrow</strong><small>Risk a scolding</small></span></Button><Button variant="ghost" disabled={life.kid.familyFunds < 20000} onClick={() => act(cleanupParty(life, 'cleaner'))}><span><strong>Hire a cleaner</strong><small>{life.kid.familyFunds < 20000 ? 'Wealthy families only' : formatMoney(cleanerCost, life.country)}</small></span></Button></div></article>}
    {life.age >= 3 && <><h2 className="hub-subtitle">Friends</h2><div className="people-list">{friends.length ? friends.map(p => row(p.name, p.name, `${p.status === 'best' ? 'Best friend' : p.status === 'partner' ? 'Partner' : 'Friend'} · ${p.bond}%`, p.bond, () => setSheet({ kind: 'peer', name: p.name }))) : <p className="locked-note">No friends yet. Get past 50% with a classmate, then ask.</p>}</div>
      <h2 className="hub-subtitle">Classmates & neighborhood</h2><div className="people-list">{peers.map(p => row(p.name, p.name, `${p.origin === 'school' ? 'Classmate' : 'Neighbor'}${p.popular ? ' · Popular' : ''} · ${p.bond}%`, p.bond, () => setSheet({ kind: 'peer', name: p.name })))}</div></>}

    <Dialog open={sheet !== null} onOpenChange={o => { if (!o) setSheet(null); }}><DialogContent className={`game-dialog action-sheet text-size-${textSize}`}>
      {sheetParent && sheet?.kind === 'parent' && <><DialogTitle>{sheetParent.name}</DialogTitle><DialogDescription>{sheetParent.role} · Bond {sheetParent.bond}%</DialogDescription><div className="sheet-actions">
        {parentActions.map(a => <Button key={a} variant="outline" disabled={!canSocialize(life)} onClick={() => act(parentAction(life, sheet.index, a))}><Heart/>{a}</Button>)}
        <Button variant="outline" disabled={!child || grounded || life.kid.requests.includes(`${sheet.index}-money`)} onClick={() => { setPitch(sheet.index); setSheet(null); }}><Star/>Ask for money</Button>
        <Button variant="outline" disabled={!canPlanBirthday(life)} onClick={() => { setParty({ index: sheet.index, step: 0, plan: {} }); setSheet(null); }}><Cake/>{social.birthdayAge === life.age ? 'Birthday planned' : 'Plan birthday'}</Button>
        <Button variant="outline" disabled={!child || grounded || life.kid.permission || social.permissionAsked} onClick={() => act(requestPermission(life, sheet.index))}><Sparkles/>{life.kid.permission ? 'Sports permission granted' : social.permissionAsked ? 'Permission declined' : 'Sports & activity permission'}</Button>
      </div>{life.age < 5 && <p className="locked-note">Money and permission requests unlock at age 5.</p>}</>}
      {sheetPeer && <><DialogTitle>{sheetPeer.name}</DialogTitle><DialogDescription>{sheetPeer.status === 'peer' ? (sheetPeer.origin === 'school' ? 'Classmate' : 'Neighbor') : sheetPeer.status === 'best' ? 'Best friend' : sheetPeer.status === 'partner' ? 'Partner' : 'Friend'} · Relationship {sheetPeer.bond}%</DialogDescription><div className="sheet-actions">
        {peerActions(life).map(a => <Button key={a} variant="outline" disabled={!canSocialize(life)} onClick={() => act(peerAction(life, sheetPeer.name, a))}>{a}</Button>)}
        {sheetPeer.status === 'peer' && <Button disabled={sheetPeer.bond <= 50 || !canSocialize(life)} onClick={() => act(askFriendship(life, sheetPeer.name))}><Users/>Become Friends{sheetPeer.bond <= 50 ? ' · needs 51%' : ''}</Button>}
        {sheetPeer.status === 'friend' && <Button disabled={sheetPeer.bond < 100 || !canSocialize(life)} onClick={() => act(askBestFriend(life, sheetPeer.name))}><Star/>Ask to be Best Friends{sheetPeer.bond < 100 ? ' · needs 100%' : ''}</Button>}
        {life.age >= 15 ? sheetPeer.status !== 'partner' && <Button variant="outline" disabled={!canSocialize(life)} onClick={() => act(askDate(life, sheetPeer.name))}><Heart/>Ask on a Date</Button> : <p className="locked-note"><Lock/>Romance unlocks at 15.</p>}
        {life.age >= 18 ? nightlife.map(n => <Button key={n.id} variant="outline" disabled={!canSocialize(life) || life.money < n.cost} onClick={() => act(goOut(life, sheetPeer.name, n.id))}>{n.id === 'Go to Bar' ? <Wine/> : <Music/>}{n.id} · {formatMoney(n.cost, life.country)}</Button>) : <p className="locked-note"><Lock/>Nightlife unlocks at 18.</p>}
      </div></>}
      {!canSocialize(life) && <p className="locked-note">All 3 moments are used this year. Age up for more.</p>}
    </DialogContent></Dialog>

    <Dialog open={pitch !== null} onOpenChange={o => { if (!o) setPitch(null); }}><DialogContent className={`game-dialog text-size-${textSize}`}><DialogTitle>Make your case</DialogTitle><DialogDescription>A little pocket money would go a long way. How will you ask?</DialogDescription><div className="choices">{pitches.map((p: Pitch) => <Button variant="outline" key={p} onClick={() => { if (pitch !== null) act(parentPitch(life, pitch, 'money', p)); setPitch(null); }}><span><strong>{p}</strong><small>{p === 'Polite Bargain' ? 'Promise a chore' : p === 'Sweet Beggar' ? 'Needs bond 75+' : p === 'Academic Logic' ? 'Needs smarts 70+' : 'Risk discipline'}</small></span></Button>)}</div></DialogContent></Dialog>

    <Dialog open={party !== null} onOpenChange={o => { if (!o) setParty(null); }}><DialogContent className={`game-dialog text-size-${textSize}`}>{party && <>
      <div className="event-age">BIRTHDAY PLANNER · STEP {party.step + 1} OF 3</div><DialogTitle>{['How big is the party?', 'Who is invited?', 'Pick the cake'][party.step]}</DialogTitle>
      <DialogDescription>{life.age < 16 ? `Your parents fund it from the family budget (${formatMoney(life.kid.familyFunds, life.country)}).` : `You pay from your own money (${formatMoney(life.money, life.country)}).`}</DialogDescription>
      <div className="choices">
        {party.step === 0 && partySizes.map(s => <Button variant="outline" key={s.id} onClick={() => setParty({ ...party, step: 1, plan: { ...party.plan, size: s.id } })}><span><strong>{s.id}</strong><small>{formatMoney(s.cost, life.country)}</small></span></Button>)}
        {party.step === 1 && guestLists.map(g => <Button variant="outline" key={g} onClick={() => setParty({ ...party, step: 2, plan: { ...party.plan, guests: g } })}><span><strong>{g}</strong><small>{g === 'Family' ? 'Quiet and warm' : g === 'Classmates' ? 'Popularity boost' : 'Maximum chaos'}</small></span></Button>)}
        {party.step === 2 && cakes.map(c => { const plan = { ...party.plan, cake: c.id } as BirthdayPlan; const cost = birthdayCost(plan); return <Button variant="outline" key={c.id} disabled={life.age >= 16 && life.money < cost} onClick={() => { act(throwBirthday(life, party.index, plan)); setParty(null); }}><span><strong>{c.id}</strong><small>{formatMoney(c.cost, life.country)} · Total {formatMoney(cost, life.country)}</small></span></Button>; })}
      </div></>}</DialogContent></Dialog>
  </>;
}
