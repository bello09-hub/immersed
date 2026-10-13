import { formatMoney, isGrounded, modify, type Life, type Peer, type SocialState, type Stats } from './life-engine';

// Pure relationship, birthday and prefect rules. Social state is derived deterministically until first changed.
const firstNames: Record<string, string[]> = {
  Nigeria: ['Tobi', 'Ngozi', 'Emeka', 'Funke', 'Sade', 'Kelechi', 'Bisi', 'Uche', 'Halima', 'Dayo'],
  Ghana: ['Kwame', 'Abena', 'Yaw', 'Efua', 'Kojo', 'Adwoa', 'Kwesi', 'Esi'],
  France: ['Léa', 'Hugo', 'Chloé', 'Louis', 'Manon', 'Jules', 'Inès', 'Théo'],
  'United Kingdom': ['Harry', 'Poppy', 'Alfie', 'Freya', 'George', 'Evie', 'Archie', 'Rosie'],
  'United States': ['Tyler', 'Madison', 'Ethan', 'Chloe', 'Mason', 'Harper', 'Logan', 'Zoe'],
  Canada: ['Owen', 'Emma', 'Lucas', 'Charlotte', 'Benjamin', 'Léa', 'Ethan', 'Ava'],
  Japan: ['Sora', 'Hina', 'Kaito', 'Aoi', 'Riku', 'Mei', 'Yuto', 'Sakura'],
  Brazil: ['Gabriel', 'Beatriz', 'Pedro', 'Larissa', 'Mateus', 'Júlia', 'Rafael', 'Ana'],
};
function seed(text: string) { return [...text].reduce((n, c) => (n * 31 + c.charCodeAt(0)) >>> 0, 11); }
export function socialOf(life: Life): SocialState {
  if (life.social) return life.social;
  const list = firstNames[life.country] ?? firstNames['United States'] ?? ['Sam'];
  const base = seed(life.name + life.country);
  const peers: Peer[] = Array.from({ length: 6 }, (_, i): Peer => {
    const n = (base >> (i % 8)) + i * 7;
    return { name: list[n % list.length] ?? 'Sam', age: life.age, origin: i < 4 ? 'school' : 'neighborhood', bond: 20 + (n % 30), popular: i === 1 || i === 4, status: 'peer' };
  }).filter((p, i, all) => all.findIndex(q => q.name === p.name) === i);
  return { peers, prefect: { role: null, popularity: 40, respect: 40, lastElection: -1, lastDuty: -1 }, birthdayAge: -1, pendingCleanup: false, permissionAsked: false };
}
function withSocial(life: Life, social: SocialState): Life { return { ...life, social }; }
function log(life: Life, title: string, text: string, effects: Partial<Stats> = {}, money = 0, spend = true): Life {
  return { ...life, actions: life.actions + (spend ? 1 : 0), money: Math.max(0, life.money + money), stats: modify(life, effects), journal: [...life.journal, { age: life.age, title, text, kind: 'activity' }] };
}
const clamp = (n: number) => Math.max(0, Math.min(100, n));
export const canSocialize = (life: Life) => life.alive && life.actions < 3;

export type ParentAction = 'Hug' | 'Watch a movie' | 'Have fun' | 'Compliment';
export const parentActions: ParentAction[] = ['Hug', 'Watch a movie', 'Have fun', 'Compliment'];
const parentLines: Record<ParentAction, string> = { Hug: 'gave me the warmest hug', 'Watch a movie': 'watched a movie with me under one blanket', 'Have fun': 'had a silly afternoon with me', Compliment: 'smiled when I told them they were the best' };
export function parentAction(life: Life, index: number, action: ParentAction): Life {
  const p = life.people[index];
  if (!p || !canSocialize(life)) return life;
  const gain = action === 'Have fun' ? 6 : 4;
  const next = log(life, `${action} with ${p.role}`, `My ${p.role.toLowerCase()} ${parentLines[action]}. Bond +${gain}.`, { happiness: 3 });
  return { ...next, people: next.people.map((q, i) => i === index ? { ...q, bond: clamp(q.bond + gain) } : q) };
}
// Asked once; accepted on healthy bond and finances, then persists.
export function requestPermission(life: Life, index: number): Life {
  const p = life.people[index]; const s = socialOf(life);
  if (!p || life.kid.permission || s.permissionAsked || life.age < 5 || life.age >= 18 || isGrounded(life)) return life;
  const yes = p.bond >= 60 && life.kid.familyFunds >= 500;
  const next = withSocial({ ...life, kid: { ...life.kid, permission: yes } }, { ...s, permissionAsked: true });
  return log(next, 'Sports & activity permission', yes ? `My ${p.role.toLowerCase()} said yes! I can join paid clubs and sports from now on.` : `My ${p.role.toLowerCase()} said no. ${life.kid.familyFunds < 500 ? 'Money is tight this year.' : 'They want me to earn more trust first.'}`, { happiness: yes ? 4 : -3 }, 0, false);
}

export const partySizes = [{ id: 'Budget', cost: 50 }, { id: 'Cozy Family', cost: 200 }, { id: 'Big Bash', cost: 800 }] as const;
export const guestLists = ['Family', 'Classmates', 'Everyone'] as const;
export const cakes = [{ id: 'Vanilla Cupcake', cost: 15 }, { id: 'Chocolate Fudge', cost: 60 }, { id: '3-Tier Red Velvet', cost: 250 }] as const;
export type BirthdayPlan = { size: typeof partySizes[number]['id']; guests: typeof guestLists[number]; cake: typeof cakes[number]['id'] };
export function birthdayCost(plan: BirthdayPlan) { return (partySizes.find(s => s.id === plan.size)?.cost ?? 0) + (cakes.find(c => c.id === plan.cake)?.cost ?? 0); }
export function canPlanBirthday(life: Life) { return life.alive && life.age >= 3 && socialOf(life).birthdayAge !== life.age && !socialOf(life).pendingCleanup; }
export function throwBirthday(life: Life, index: number, plan: BirthdayPlan, rng: () => number = Math.random): Life {
  const p = life.people[index]; const s = socialOf(life);
  if (!p || !canPlanBirthday(life)) return life;
  const cost = birthdayCost(plan);
  const parentsPay = life.age < 16;
  if (parentsPay && (life.kid.familyFunds < cost || p.bond < 40)) return log(withSocial(life, { ...s, birthdayAge: life.age }), 'Birthday plans fell through', `My ${p.role.toLowerCase()} said a ${plan.size} party was not possible this year. We had a quiet slice of cake instead.`, { happiness: -3 }, 0, false);
  if (!parentsPay && life.money < cost) return life;
  const outcomes = [
    { t: 'Great memories', x: `Everyone sang, danced and stayed late. One of my favorite days ever.`, e: { happiness: 8 } },
    { t: 'Someone knocked the cake', x: `Someone tripped and the ${plan.cake} hit the floor. We ate it with spoons anyway. Chaos, but iconic.`, e: { happiness: 3, mischief: 2 } },
    { t: 'An uninvited guest', x: `A kid nobody invited showed up and ate half the snacks. ${plan.guests === 'Everyone' ? 'With everyone invited, nobody even noticed.' : 'The drama was unforgettable.'}`, e: { happiness: 2, toughness: 2 } },
  ];
  const o = outcomes[Math.floor(rng() * outcomes.length)] ?? outcomes[0]!;
  const popularity = plan.guests === 'Family' ? 0 : plan.size === 'Big Bash' ? 8 : 4;
  const kid = { ...life.kid, familyFunds: parentsPay ? life.kid.familyFunds - cost : life.kid.familyFunds, popularity: clamp(life.kid.popularity + popularity) };
  const next = withSocial({ ...life, kid }, { ...s, birthdayAge: life.age, pendingCleanup: true, peers: s.peers.map(q => plan.guests === 'Family' ? q : { ...q, bond: clamp(q.bond + 5) }) });
  return log(next, `Birthday party · ${o.t}`, `A ${plan.size} party for ${plan.guests.toLowerCase()} with a ${plan.cake} (${formatMoney(cost, life.country)}${parentsPay ? ', paid by my parents' : ''}). ${o.x}`, o.e, parentsPay ? 0 : -cost, false);
}
export type Cleanup = 'tonight' | 'tomorrow' | 'cleaner';
export const cleanerCost = 150;
export function cleanupParty(life: Life, choice: Cleanup): Life {
  const s = socialOf(life);
  if (!s.pendingCleanup) return life;
  if (choice === 'cleaner' && life.kid.familyFunds < 20000) return life;
  const delta = choice === 'tonight' ? 5 : choice === 'tomorrow' ? -5 : 0;
  const next = withSocial({ ...life, kid: { ...life.kid, approval: clamp(life.kid.approval + delta), familyFunds: life.kid.familyFunds - (choice === 'cleaner' ? cleanerCost : 0) }, people: life.people.map(p => ['Mother', 'Father'].includes(p.role) ? { ...p, bond: clamp(p.bond + delta) } : p) }, { ...s, pendingCleanup: false });
  return log(next, 'After the party', choice === 'tonight' ? 'I cleaned up before bed. My parents praised me for being so responsible.' : choice === 'tomorrow' ? 'I left the mess for tomorrow. Waking up to a scolding and sticky floors was not the vibe.' : 'We hired a cleaner. The house sparkled by morning.', choice === 'tomorrow' ? { happiness: -2 } : { happiness: 1 }, 0, false);
}

export type PeerAction = 'Play together' | 'Share snacks' | 'Study together' | 'Gossip' | 'Hang out' | 'Compliment' | 'Insult';
const peerGates: Record<PeerAction, [number, number]> = { 'Play together': [3, 12], 'Share snacks': [3, 12], 'Study together': [6, 30], Gossip: [8, 90], 'Hang out': [10, 90], Compliment: [3, 90], Insult: [3, 90] };
export function peerActions(life: Life): PeerAction[] { return (Object.keys(peerGates) as PeerAction[]).filter(a => life.age >= peerGates[a][0] && life.age <= peerGates[a][1]); }
function updatePeer(life: Life, name: string, fn: (p: Peer) => Peer): Life { const s = socialOf(life); return withSocial(life, { ...s, peers: s.peers.map(p => p.name === name ? fn(p) : p) }); }
export function peerAction(life: Life, name: string, action: PeerAction): Life {
  const peer = socialOf(life).peers.find(p => p.name === name);
  if (!peer || !canSocialize(life) || !peerActions(life).includes(action)) return life;
  const gain = action === 'Insult' ? -15 : action === 'Gossip' ? 4 : action === 'Hang out' || action === 'Play together' ? 8 : 6;
  const effects: Partial<Stats> = action === 'Study together' ? { smarts: 3 } : action === 'Insult' ? { mischief: 4 } : action === 'Gossip' ? { mischief: 2, happiness: 1 } : { happiness: 3 };
  const text = action === 'Insult' ? `I insulted ${name}. Their face fell. That one will be remembered.` : `${action} with ${name}. Friendship ${gain > 0 ? '+' : ''}${gain}.`;
  return log(updatePeer(life, name, p => ({ ...p, bond: clamp(p.bond + gain) })), action, text, effects);
}
export function askFriendship(life: Life, name: string, rng: () => number = Math.random): Life {
  const peer = socialOf(life).peers.find(p => p.name === name);
  if (!peer || peer.status !== 'peer' || peer.bond <= 50 || !canSocialize(life)) return life;
  const declines = peer.popular && life.kid.popularity < 60 && rng() < 0.6;
  if (declines) return log(updatePeer(life, name, p => ({ ...p, bond: clamp(p.bond - 5) })), 'Friend request declined', `${name} laughed and said they already have enough friends. Ouch.`, { happiness: -4 });
  return log(updatePeer(life, name, p => ({ ...p, status: 'friend' })), 'A new friend', `${name} said yes! We are officially friends now.`, { happiness: 5 });
}
export function askBestFriend(life: Life, name: string): Life {
  const peer = socialOf(life).peers.find(p => p.name === name);
  if (!peer || peer.status !== 'friend' || peer.bond < 100 || !canSocialize(life)) return life;
  return log(updatePeer(life, name, p => ({ ...p, status: 'best' })), 'Best friends forever', `I asked ${name} to be my best friend. They hugged me and said "obviously".`, { happiness: 8 });
}
export function askDate(life: Life, name: string): Life {
  const peer = socialOf(life).peers.find(p => p.name === name);
  if (!peer || life.age < 15 || peer.status === 'partner' || !canSocialize(life)) return life;
  const yes = peer.bond >= 60 && (life.stats.looks + peer.bond) / 2 >= 55;
  return log(updatePeer(life, name, p => yes ? { ...p, status: 'partner', bond: clamp(p.bond + 10) } : { ...p, bond: clamp(p.bond - 8) }), yes ? 'A first date' : 'Turned down', yes ? `${name} said yes. We got ice cream and talked until the shop closed.` : `${name} said they only see me as a friend. My heart did a small dramatic collapse.`, yes ? { happiness: 8, looks: 1 } : { happiness: -6 });
}
export const nightlife = [{ id: 'Go to Club', cost: 40 }, { id: 'Go to Bar', cost: 25 }, { id: 'Throw House Party', cost: 120 }] as const;
export function goOut(life: Life, name: string, id: typeof nightlife[number]['id']): Life {
  const option = nightlife.find(n => n.id === id);
  if (!option || life.age < 18 || life.money < option.cost || !canSocialize(life)) return life;
  return log(updatePeer(life, name, p => ({ ...p, bond: clamp(p.bond + 10) })), id, id === 'Throw House Party' ? `I threw a house party with ${name}. The neighbors complained, the playlist did not miss.` : `${name} and I hit the ${id === 'Go to Club' ? 'club and danced until 3 a.m.' : 'bar for a few drinks and big laughs'}.`, { happiness: 6, health: -2 }, -option.cost);
}

export function prefectRoles(life: Life) { return life.school?.type === 'private' ? ['Head Prefect', 'Food Prefect', 'Sports Prefect', 'Dorm Prefect'] : ['Student President', 'Head Prefect', 'Food Prefect', 'Sports Prefect']; }
export function canRunForPrefect(life: Life) { const s = socialOf(life); return !!life.school && life.alive && life.age >= 10 && life.age < 18 && !s.prefect.role && s.prefect.lastElection !== life.age && !isGrounded(life); }
export function runForPrefect(life: Life, role: string, rng: () => number = Math.random): Life {
  const s = socialOf(life);
  if (!canRunForPrefect(life) || !prefectRoles(life).includes(role)) return life;
  const chance = (life.kid.popularity * 0.5 + life.stats.smarts * 0.3 + s.prefect.respect * 0.2) / 100;
  const won = rng() < chance;
  const next = withSocial(life, { ...s, prefect: { ...s.prefect, role: won ? role : null, lastElection: life.age, popularity: clamp(s.prefect.popularity + (won ? 10 : -5)) } });
  return log(next, won ? `Elected ${role}` : 'Election lost', won ? `The votes were counted and I became ${role}! My badge is shiny and my responsibilities are real.` : `I campaigned for ${role} but lost. My poster was very good, though.`, won ? { happiness: 8, smarts: 1 } : { happiness: -4, toughness: 2 }, 0, false);
}
export type Duty = 'fair' | 'favor' | 'strict';
export function dutyDilemma(role: string) {
  if (role.includes('Food')) return 'A friend begs for extra portions at lunch while the queue watches.';
  if (role.includes('Sports')) return 'The team captain wants you to skip a talented newcomer so his friends can play.';
  if (role.includes('Dorm')) return 'You catch your roommates sneaking snacks after lights out.';
  if (role.includes('President')) return 'The student council budget can fund a new library shelf or a popular end-of-year party.';
  return 'Two students are fighting in the corridor, and one of them is your friend.';
}
export function prefectDuty(life: Life, duty: Duty): Life {
  const s = socialOf(life); const role = s.prefect.role;
  if (!role || s.prefect.lastDuty === life.age || !life.alive) return life;
  const d = duty === 'fair' ? { pop: 2, res: 8, t: 'I treated everyone the same. Some grumbled, but teachers and students respected me.' } : duty === 'favor' ? { pop: 6, res: -8, t: 'I did my friends a favor. They loved it, but others whispered about unfairness.' } : { pop: -6, res: 5, t: 'I went fully by the rulebook. Order was kept, but I am not winning any popularity contests.' };
  const next = withSocial(life, { ...s, prefect: { ...s.prefect, lastDuty: life.age, popularity: clamp(s.prefect.popularity + d.pop), respect: clamp(s.prefect.respect + d.res) } });
  return log({ ...next, kid: { ...next.kid, popularity: clamp(next.kid.popularity + Math.round(d.pop / 2)) } }, `${role} duty`, d.t, duty === 'favor' ? { mischief: 2 } : { smarts: 1 }, 0, false);
}

export const homeTiers = [
  { id: 'Studio Apartment', min: 0, detail: 'One cozy room where the whole family shares everything, including the TV remote.' },
  { id: 'Shared Flat', min: 70000, detail: 'A compact flat above a busy street with noisy, friendly neighbors.' },
  { id: 'Suburban Bungalow', min: 100000, detail: 'A single-storey home with a small yard and a wobbly gate.' },
  { id: 'Townhouse', min: 200000, detail: 'A narrow, tall house with stairs you race up every night.' },
  { id: 'Gated Villa', min: 400000, detail: 'A secure villa behind tall gates, with a garden and a guard who waves.' },
  { id: 'Sprawling Estate', min: 650000, detail: 'A mansion with long corridors, manicured lawns, and rooms you have never entered.' },
] as const;
export function homeTier(life: Life) { return [...homeTiers].reverse().find(t => life.kid.homeValue >= t.min) ?? homeTiers[0]; }
