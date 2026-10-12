export type Stats = { happiness: number; health: number; smarts: number; looks: number; creativity: number; mischief: number; toughness: number };
export type Entry = { age: number; title: string; text: string; choice?: string; kind: 'birth' | 'milestone' | 'choice' | 'activity' };
export type Person = { name: string; role: string; bond: number };
export type Life = {
  version: 1; name: string; country: string; sex: string; age: number; family: string;
  stats: Stats; journal: Entry[]; people: Person[]; money: number; job: string;
  education: string; assets: string[]; actions: number; alive: boolean;
  training: { sessions: number; progress: Record<Sport, number>; personalBests: Partial<Record<Sport, number>>; lastResults?: Partial<Record<Sport, { completionMs: number | null; healthGain: number; toughnessGain: number }>> };
};
export type Sport = 'sprint' | 'swim';
export type Choice = { label: string; outcome: string; effects: Partial<Stats>; money?: number; education?: string; job?: string; person?: Person; familyBond?: number; athletic?: Sport };
export type LifeEvent = { title: string; text: string; choices: Choice[]; age?: number };
export const countries = ['Nigeria', 'France', 'United Kingdom', 'United States', 'Canada', 'Ghana', 'Japan', 'Brazil'];
const names: Record<string, string[]> = {
  Nigeria: ['Amara Eze', 'Chidi Nwosu', 'Tunde Adebayo', 'Zainab Musa', 'Ibrahim Bello'],
  France: ['Camille Moreau', 'Gabriel Laurent', 'Amélie Bernard'],
  'United Kingdom': ['Oliver Bennett', 'Amelia Clarke', 'Isla Thompson'],
  'United States': ['Jordan Brooks', 'Avery Johnson', 'Maya Robinson'],
  Canada: ['Noah Martin', 'Sophie Tremblay', 'Liam Wilson'],
  Ghana: ['Ama Mensah', 'Kofi Owusu', 'Akosua Boateng'],
  Japan: ['Haru Sato', 'Yui Tanaka', 'Ren Suzuki'],
  Brazil: ['Lucas Silva', 'Mariana Costa', 'Isabela Oliveira'],
};
export function randomName(country: string): string { const list = names[country] ?? ['Amara Eze', 'Chidi Nwosu']; return list[Math.floor(Math.random() * list.length)] ?? 'Amara Eze'; }
export function makeLife(name = 'Amara Eze', country = 'Nigeria', sex = 'Female', random = false): Life {
  const families = ['A close-knit family', 'A modest household', 'A comfortable household', 'A family under pressure'];
  const family = (random ? families[Math.floor(Math.random() * families.length)] : families[0]) ?? 'A close-knit family';
  return {
    version: 1, name: name.trim() || randomName(country), country, sex, age: 0, family,
    stats: { happiness: 87, health: 96, smarts: 68, looks: 74, creativity: 40, mischief: 20, toughness: 35 },
    money: 0, job: 'Not working', education: 'Not enrolled', assets: [], actions: 0, alive: true,
    training: { sessions: 0, progress: { sprint: 0, swim: 0 }, personalBests: {} },
    people: [{ name: 'Mother', role: 'Mother', bond: 92 }, { name: 'Father', role: 'Father', bond: 86 }],
    journal: [
      { age: 0, title: 'Hello, world.', text: `I was born ${sex === 'Female' ? 'a girl' : 'a boy'} in ${country}. A whole world of possibilities is waiting for me. For now, it begins with a first breath.`, kind: 'birth' },
      { age: 0, title: 'A place to call home', text: `${family}. My parents hold me close, learning who I am as I learn the sound of their voices. I may not remember this day, but this is where my story begins.`, kind: 'milestone' },
    ],
  };
}
export function modify(life: Life, effects: Partial<Stats>) {
  const stats = { ...life.stats };
  for (const key of Object.keys(effects) as (keyof Stats)[]) stats[key] = Math.max(0, Math.min(100, stats[key] + (effects[key] ?? 0)));
  return stats;
}
export function stage(age: number) { return age < 4 ? 'Infancy' : age < 13 ? 'Childhood' : age < 18 ? 'Adolescence' : age < 40 ? 'Young adulthood' : age < 65 ? 'Adulthood' : 'Golden years'; }
// Multiple small dilemmas can happen in a year. Recorded titles keep saves resumable.
export const childhoodEvents: LifeEvent[] = [
  { age: 0, title: 'My very first word', text: 'Mama and Dada lean over your blanket, each campaigning shamelessly for your first word. You have the entire room in the palm of one tiny hand.', choices: [
    { label: 'Mama', outcome: 'I said “Mama.” She melted. Dada immediately demanded a recount.', effects: { happiness: 3, smarts: 2 }, familyBond: 2 },
    { label: 'Dada', outcome: 'I said “Dada.” He celebrated like he had won a trophy. Mama raised one amused eyebrow.', effects: { happiness: 3, smarts: 2 }, familyBond: 2 },
    { label: 'An enormous baby squeal', outcome: 'I squealed with the confidence of an opera star. Nobody understood a word. Everybody clapped.', effects: { creativity: 4, mischief: 3, happiness: 4 }, familyBond: 1 },
  ] },
  { age: 1, title: 'Teletubbies before breakfast', text: 'Morning cartoons are on. The Teletubbies are dancing, your cereal is cooling, and the sofa looks suspiciously like a stage.', choices: [
    { label: 'Dance on the sofa', outcome: 'I bounced along to the Teletubbies. Mama caught me before my grand finale became a floor landing.', effects: { happiness: 4, creativity: 3, mischief: 2 }, familyBond: 1 },
    { label: 'Watch in a complete trance', outcome: 'I stared at the cartoons as if they held the secrets of the universe. My cereal became a very cold mystery.', effects: { happiness: 2, smarts: 1 } },
    { label: 'Throw my toy at the screen', outcome: 'I launched my teddy at the television. Teddy survived. The cartoons were paused for a tiny lesson in kindness.', effects: { mischief: 5, happiness: -1 }, familyBond: -2 },
  ] },
  { age: 2, title: 'The great wax-crayon mural', text: 'A box of wax crayons. A coloring book. One beautifully blank parlor wall. You are an artist with absolutely no concept of a security deposit.', choices: [
    { label: 'Color the book neatly', outcome: 'I colored inside the lines. Mostly. My picture earned a proud spot on the fridge.', effects: { smarts: 3, creativity: 2, happiness: 2 }, familyBond: 2 },
    { label: 'Draw purple spirals on the parlor wall', outcome: 'I covered the parlor wall in magnificent purple spirals. My parents admired my vision while handing me a damp cloth.', effects: { creativity: 6, mischief: 5, happiness: 3 }, familyBond: -2 },
    { label: 'Taste the crayon', outcome: 'I tasted a crayon. It was not grape-flavored. Mama rescued it, checked on me, and moved art supplies out of snack range.', effects: { mischief: 3, health: -2, smarts: 1 }, familyBond: 1 },
  ] },
  { age: 3, title: 'Lunchbox diplomacy', text: 'My first kindergarten lunch. Someone offers a shiny biscuit for my sandwich. Another child forgot their lunch altogether.', choices: [
    { label: 'Trade my sandwich for the biscuit', outcome: 'I negotiated my first lunchbox deal. A biscuit is wonderful, but my tummy missed the sandwich.', effects: { happiness: 3, mischief: 2, health: -1 }, education: 'Kindergarten' },
    { label: 'Share with the child who forgot lunch', outcome: 'I shared my sandwich. We ate together, and a little kindness became a new friend.', effects: { happiness: 4, smarts: 2 }, person: { name: 'Robin', role: 'Friend', bond: 65 }, familyBond: 2, education: 'Kindergarten' },
    { label: 'Keep my carefully packed lunch', outcome: 'I ate what my family packed and saved a story about my day to tell them at home.', effects: { health: 2, smarts: 2 }, familyBond: 1, education: 'Kindergarten' },
  ] },
  { age: 3, title: 'A kingdom in the sandbox', text: 'A castle towers above the sandbox. Its builders invite you over. Your foot is almost exactly the size of the front gate.', choices: [
    { label: 'Help build a magnificent moat', outcome: 'We built a moat together. Our sand kingdom had three towers, four rulers, and excellent teamwork.', effects: { creativity: 4, happiness: 3, smarts: 2 } },
    { label: 'Stomp the castle like a tiny monster', outcome: 'I stomped the castle. The builders were not impressed. I said sorry and helped rebuild one lopsided tower.', effects: { mischief: 5, happiness: -2, smarts: 1 } },
  ] },
  { age: 4, title: 'Just one more bedtime story', text: 'Your blanket is warm. The lamp is low. Your parent says it is bedtime, but surely the teddy bear deserves another story?', choices: [
    { label: 'Ask for one more story and a cuddle', outcome: 'We read one more story, curled up together. I fell asleep before the dragon finished its speech.', effects: { happiness: 4, smarts: 2 }, familyBond: 3 },
    { label: 'Invent a story about a moon-sized biscuit', outcome: 'I told a story about a biscuit that ate the moon. My parent laughed so hard that bedtime became a little later.', effects: { creativity: 5, happiness: 3 }, familyBond: 2 },
    { label: 'Sneak out for a midnight adventure', outcome: 'My midnight adventure reached the hallway. I was carried back to bed like a very small, very sleepy outlaw.', effects: { mischief: 4, health: -1 }, familyBond: -1 },
  ] },
  { age: 4, title: 'But why does the moon follow us?', text: 'On the walk home, the moon seems to follow you. You have questions. Hundreds of them. Your parent has one shopping bag and limited answers.', choices: [
    { label: 'Ask why until we figure it out', outcome: 'I asked why the moon followed us. We looked it up together at home. The world got bigger, and a little less mysterious.', effects: { smarts: 5, happiness: 2 }, familyBond: 2 },
    { label: 'Decide the moon is my secret pet', outcome: 'I named the moon Biscuit and told it to sit. It was extremely well behaved, if a little distant.', effects: { creativity: 5, happiness: 3 } },
    { label: 'Ask whether the moon needs the toilet', outcome: 'I asked whether the moon needed the toilet. My parent laughed all the way home. I still want an answer.', effects: { mischief: 3, creativity: 2, happiness: 3 }, familyBond: 1 },
  ] },
  { age: 5, title: 'Little feet, big sports day', text: 'Kindergarten sports day! The finish line feels miles away. Your teacher waves a ribbon, and your family is cheering louder than everyone else.', choices: [
    { label: 'Run the little sprint', outcome: 'I lined up for my first sports-day sprint, with determined little feet and one slightly crooked sock.', effects: { happiness: 2 }, athletic: 'sprint' },
    { label: 'Cheer for my classmates', outcome: 'I cheered until my voice went squeaky. My teacher said being a good teammate matters, too.', effects: { happiness: 4 }, familyBond: 1 },
  ] },
];
export function annualEvent(life: Life): LifeEvent {
  const childhood = childhoodEvents.find(e => (e.age ?? 0) >= life.age && !life.journal.some(j => j.kind === 'choice' && j.age === e.age && j.title === e.title));
  if (life.age <= 5 && childhood) return childhood;
  const age = life.age + 1;
  if (age === 1) return { title: 'One small step', text: 'The room is full of encouraging voices. Your mother holds out her hands. You wobble to your feet. What do you do?', choices: [
    { label: 'Take a brave little step', outcome: 'I took my first steps! My parents cheered as I stumbled into their arms.', effects: { happiness: 5, health: 2 } },
    { label: 'Crawl over for a cuddle', outcome: 'I crawled into my mother’s lap. The world can wait a little longer.', effects: { happiness: 7 } },
  ] };
  if (age < 4) return { title: age === 2 ? 'A world of little wonders' : 'My own little voice', text: age === 2 ? 'A colorful book and a box of wooden blocks lie on the floor. One of them has caught your attention.' : 'You have a lot to say, and your family is finally starting to understand you. What fills your days?', choices: [
    { label: 'Explore everything', outcome: 'I explored every corner of the house, discovering something new each day.', effects: { smarts: 5, health: 2 } },
    { label: 'Play with my family', outcome: 'We invented silly games and laughed until bedtime. I felt safe and loved.', effects: { happiness: 6 } },
  ] };
  if (age === 6) return { title: 'The first day of school', text: 'A new classroom. Unfamiliar faces. Your teacher asks you to introduce yourself. How will you begin?', choices: [
    { label: 'Say hello to everyone', outcome: 'I started primary school and made my first friend, Alex. It was less scary than I imagined.', effects: { happiness: 5 }, education: 'Primary school', person: { name: 'Alex', role: 'Friend', bond: 60 } },
    { label: 'Find a quiet seat and listen', outcome: 'I started primary school. I listened carefully and discovered that I love learning.', effects: { smarts: 7 }, education: 'Primary school' },
  ] };
  if (age < 13) return { title: age < 6 ? 'A little adventure' : 'Finding my place', text: age < 6 ? 'The afternoon is yours. Outside, the garden is full of possibilities. Inside, your favorite stories are waiting.' : 'There is a school project to finish, but your friends want you to come out and play. What matters most today?', choices: [
    { label: 'Let curiosity lead the way', outcome: 'I spent the afternoon reading and making things. I am getting better at figuring things out.', effects: { smarts: 6, happiness: 1 } },
    { label: 'Make memories with friends', outcome: 'We played outside until the sky changed color. Some days are worth remembering just as they are.', effects: { happiness: 6, health: 3 } },
    { label: 'Spend time with my family', outcome: 'I helped at home and listened to stories about my family. We felt a little closer.', effects: { happiness: 4 } },
  ] };
  if (age === 18) return { title: 'The world opens up', text: 'School is behind you. For the first time, your future feels like something you can choose. Which path will you take?', choices: [
    { label: 'Apply for a university scholarship', outcome: life.stats.smarts >= 65 ? 'My hard work paid off. I earned a scholarship and began my degree.' : 'My scholarship application was declined. I decided to work and keep learning independently.', effects: { smarts: 5 }, education: life.stats.smarts >= 65 ? 'University student' : 'High school graduate' },
    { label: 'Get a job and build independence', outcome: 'I accepted my first full-time job as a shop assistant. My first paycheck felt like a new beginning.', effects: { happiness: 3 }, job: 'Shop assistant', education: 'High school graduate' },
    { label: 'Take time to find myself', outcome: 'I took a gap year. I do not have all the answers, but I am learning to trust my own direction.', effects: { happiness: 8 }, education: 'High school graduate' },
  ] };
  if (age === 22 && life.education === 'University student') return { title: 'A chapter completed', text: 'You stand in your graduation gown, surrounded by the people who believed in you. What comes next?', choices: [
    { label: 'Begin my professional career', outcome: 'I graduated from university and accepted a role as a junior analyst.', effects: { smarts: 8, happiness: 5 }, education: 'University graduate', job: 'Junior analyst' },
    { label: 'Follow a creative calling', outcome: 'I earned my degree, then chose the less certain path of a freelance writer.', effects: { happiness: 10 }, education: 'University graduate', job: 'Freelance writer' },
  ] };
  if (age >= 7 && age % 4 === 0) return { title: age % 8 === 0 ? 'Swimming gala' : 'School sports day', text: 'Your classmates gather beside the starting line. The teacher calls your name. It is your turn to give it a go.', choices: [
    { label: age % 8 === 0 ? 'Enter the swimming race' : 'Enter the sprint', outcome: 'I entered the school race. My classmates gathered to cheer me on.', effects: { happiness: 2 }, athletic: age % 8 === 0 ? 'swim' : 'sprint' },
    { label: 'Support my classmates instead', outcome: 'I cheered from the sidelines. Our teacher thanked me for keeping everyone’s spirits up.', effects: { happiness: 3 } },
  ] };
  if (age < 18) return { title: 'Becoming my own person', text: 'Between school, friendships, and your family’s expectations, you are discovering who you want to be. Where will you put your energy this year?', choices: [
    { label: 'Focus on my studies', outcome: 'I stayed focused at school. My grades improved, and so did my confidence.', effects: { smarts: 7, happiness: -2 }, education: 'Secondary school' },
    { label: 'Try out for the sports team', outcome: 'I joined the sports team. The early mornings were hard, but I found people who had my back.', effects: { health: 7, happiness: 4 }, education: 'Secondary school' },
    { label: 'Explore my creative side', outcome: 'I spent the year making art and music. I am beginning to find my own voice.', effects: { happiness: 7, smarts: 3 }, education: 'Secondary school' },
  ] };
  const adult: LifeEvent[] = [
    { title: 'An unexpected connection', text: 'At a neighborhood gathering, someone strikes up a conversation. You find yourself laughing more than you expected.', choices: [
      { label: 'Make room for a new friendship', outcome: 'I met Sam, and we talked for hours. A new friendship is beginning.', effects: { happiness: 7 }, person: { name: 'Sam', role: 'Friend', bond: 55 } },
      { label: 'Enjoy the moment, then head home', outcome: 'I enjoyed a lovely conversation and a quiet evening at home.', effects: { happiness: 3, health: 2 } },
    ] },
    { title: 'Room to grow', text: 'A new course catches your eye. It could open doors, but it would take time and energy alongside everything else.', choices: [
      { label: 'Invest in myself', outcome: 'I completed an evening course. Learning something new reminded me how much is still possible.', effects: { smarts: 6, happiness: -1 } },
      { label: 'Choose a healthier balance', outcome: 'I made time for rest, long walks, and people I love. I needed this.', effects: { health: 5, happiness: 5 } },
    ] },
    { title: 'What really matters', text: 'Your family invites you to spend the weekend together. At the same time, a personal project is calling for your attention.', choices: [
      { label: 'Be there for my family', outcome: 'We shared a meal and old stories. I realized how much these ordinary moments mean.', effects: { happiness: 6 } },
      { label: 'Keep building my own dream', outcome: 'I spent the weekend working on my project. Small steps are still steps forward.', effects: { smarts: 4, happiness: 2 }, money: 200 },
    ] },
  ];
  if (age === 65) return { title: 'A slower kind of freedom', text: 'After so many busy years, a quieter chapter is calling. How do you want to spend it?', choices: [
    { label: 'Retire and savor the little things', outcome: 'I retired. Now there is more time for the people and places that make life meaningful.', effects: { happiness: 8 }, job: 'Retired' },
    { label: 'Keep doing what I love', outcome: 'I am not ready to slow down completely. I decided to keep working on my own terms.', effects: { smarts: 3, health: -3 } },
  ] };
  return adult[age % adult.length] ?? { title: 'Another year of possibilities', text: 'A new year is waiting. How will you spend it?', choices: [{ label: 'Make the most of it', outcome: 'I made time for the things that mattered to me.', effects: { happiness: 3 } }] };
}
export function chooseYear(life: Life, event: LifeEvent, choice: Choice): Life {
  const age = event.age ?? life.age + 1;
  const job = choice.job ?? life.job;
  const salary = job === 'Junior analyst' ? 42000 : job === 'Freelance writer' ? 24000 : job === 'Shop assistant' ? 18000 : job === 'Retired' ? 9000 : 0;
  const advanced = age > life.age;
  const effects = { ...choice.effects, health: (choice.effects.health ?? 0) - (advanced ? (age > 65 ? 3 : age > 40 ? 1 : 0) : 0) };
  const stats = modify(life, effects);
  const alive = age < 90 && stats.health > 5;
  const people = life.people.map(p => p.role === 'Mother' || p.role === 'Father' ? { ...p, bond: Math.max(0, Math.min(100, p.bond + (choice.familyBond ?? 0))) } : p);
  return { ...life, age, actions: advanced ? 0 : life.actions, training: { ...life.training, sessions: advanced ? 0 : life.training.sessions }, alive, stats, job, education: choice.education ?? life.education,
    money: Math.max(0, life.money + (advanced ? Math.round(salary * .35) : 0) + (choice.money ?? 0)),
    people: choice.person && !people.some(p => p.name === choice.person?.name) ? [...people, choice.person] : people,
    journal: [...life.journal, { age, title: event.title, choice: choice.label, text: choice.outcome, kind: 'choice' }, ...(!alive ? [{ age, title: 'A life remembered', text: 'My story has come to its end. The people I loved, the choices I made, and the little moments in between became a life that was entirely mine.', kind: 'milestone' as const }] : [])],
  };
}
export function takeAction(life: Life, title: string, text: string, effects: Partial<Stats>, money = 0): Life {
  return { ...life, actions: life.actions + 1, stats: modify(life, effects), money: life.money + money, journal: [...life.journal, { age: life.age, title, text, kind: 'activity' }] };
}
export const RACE_DURATION = 5000;
export const RACE_TARGET = 24;
export const TRAINING_LIMIT = 4;
export function canTrain(life: Life) { return life.alive && life.age >= 5 && life.training.sessions < TRAINING_LIMIT; }
export function startTraining(life: Life, sport: Sport): Life {
  if (!canTrain(life)) return life;
  return { ...life, training: { ...life.training, sessions: life.training.sessions + 1, progress: { ...life.training.progress, [sport]: life.training.progress[sport] + 5 } }, journal: [...life.journal, { age: life.age, title: sport === 'sprint' ? 'Sprint training' : 'Swimming practice', text: `I trained ${sport === 'sprint' ? 'on the track' : 'in the pool'}. My ${sport} progress grew by 5. Training session ${life.training.sessions + 1} of 4 this year.`, kind: 'activity' }] };
}
export function raceScore(taps: number) { return Math.min(100, Math.max(0, Math.floor(taps)) / RACE_TARGET * 100); }
export function resolveAthletics(life: Life, sport: Sport, taps: number, completionMs = RACE_DURATION): Life {
  const won = raceScore(taps) >= 100;
  const time = Math.max(1, Math.min(RACE_DURATION, completionMs));
  const previous = life.training.personalBests[sport];
  const personalBests = won ? { ...life.training.personalBests, [sport]: Math.min(previous ?? time, time) } : life.training.personalBests;
  const medal = sport === 'sprint' ? 'Sprint gold medal' : 'Swimming gold medal';
  const text = won ? `I ${sport === 'sprint' ? 'sprinted' : 'swam'} past my rivals and won a gold medal! My teacher praised my determination, and my family cheered. I felt stronger than ever.` : sport === 'sprint' ? 'I ran with all my heart, but my legs apparently had other appointments. I finished behind my rivals. My teacher smiled: “There is always next time.”' : 'I splashed enthusiastically while my rivals actually moved forward. No medal this time, but my teacher praised me for trying. The pool and I will meet again.';
  const summary = won ? ` Completion time: ${(time / 1000).toFixed(2)}s. Personal best: ${((personalBests[sport] ?? time) / 1000).toFixed(2)}s.` : ' The five-second round ended before I finished the distance.';
  const stats = modify(life, won ? { health: 3, toughness: 5, happiness: 5 } : { health: 1, toughness: 2 });
  const lastResults = { ...life.training.lastResults, [sport]: { completionMs: won ? time : null, healthGain: stats.health - life.stats.health, toughnessGain: stats.toughness - life.stats.toughness } };
  return { ...life, training: { ...life.training, personalBests, lastResults }, stats, assets: won ? [...life.assets, medal] : life.assets, journal: [...life.journal, { age: life.age, title: won ? 'A little champion' : 'Not quite a personal best', text: text + summary, kind: 'activity' }] };
}
// Version 1 saves from before temperament stats receive defaults, not a reset.
export function normalizeLife(life: Life): Life {
  return { ...life, training: life.training ?? { sessions: 0, progress: { sprint: 0, swim: 0 }, personalBests: {} }, stats: { ...life.stats, creativity: life.stats.creativity ?? 40, mischief: life.stats.mischief ?? 20, toughness: life.stats.toughness ?? 35 } };
}
export function isLife(value: unknown): value is Life {
  if (!value || typeof value !== 'object') return false;
  const l = value as Partial<Life>;
  return l.version === 1 && typeof l.name === 'string' && typeof l.country === 'string' && typeof l.sex === 'string' && typeof l.family === 'string' && typeof l.age === 'number' && l.age >= 0 && l.age <= 90 && typeof l.alive === 'boolean' && typeof l.money === 'number' && typeof l.actions === 'number' && typeof l.job === 'string' && typeof l.education === 'string' && Array.isArray(l.assets) && l.assets.every(a => typeof a === 'string') && Array.isArray(l.people) && l.people.every(p => p && typeof p.name === 'string' && typeof p.role === 'string' && typeof p.bond === 'number') && Array.isArray(l.journal) && l.journal.every(e => e && typeof e.age === 'number' && typeof e.title === 'string' && typeof e.text === 'string') && !!l.stats && ['happiness', 'health', 'smarts', 'looks'].every(k => typeof l.stats?.[k as keyof Stats] === 'number');
}