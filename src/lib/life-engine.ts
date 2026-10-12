export type Stats = { happiness: number; health: number; smarts: number; looks: number };
export type Entry = { age: number; title: string; text: string; kind: 'birth' | 'milestone' | 'choice' | 'activity' };
export type Person = { name: string; role: string; bond: number };
export type Life = {
  version: 1; name: string; country: string; sex: string; age: number; family: string;
  stats: Stats; journal: Entry[]; people: Person[]; money: number; job: string;
  education: string; assets: string[]; actions: number; alive: boolean;
};
export type Choice = { label: string; outcome: string; effects: Partial<Stats>; money?: number; education?: string; job?: string; person?: Person };
export type LifeEvent = { title: string; text: string; choices: Choice[] };
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
export function randomName(country: string) { const list = names[country] ?? names.Nigeria; return list[Math.floor(Math.random() * list.length)]; }
export function makeLife(name = 'Amara Eze', country = 'Nigeria', sex = 'Female', random = false): Life {
  const families = ['A close-knit family', 'A modest household', 'A comfortable household', 'A family under pressure'];
  const family = random ? families[Math.floor(Math.random() * families.length)] : families[0];
  return {
    version: 1, name: name.trim() || randomName(country), country, sex, age: 0, family,
    stats: { happiness: 87, health: 96, smarts: 68, looks: 74 },
    money: 0, job: 'Not working', education: 'Not enrolled', assets: [], actions: 0, alive: true,
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
export function annualEvent(life: Life): LifeEvent {
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
  return adult[age % adult.length];
}
export function chooseYear(life: Life, event: LifeEvent, choice: Choice): Life {
  const age = life.age + 1;
  const job = choice.job ?? life.job;
  const salary = job === 'Junior analyst' ? 42000 : job === 'Freelance writer' ? 24000 : job === 'Shop assistant' ? 18000 : job === 'Retired' ? 9000 : 0;
  const alive = age < 90 && life.stats.health > 5;
  const effects = { ...choice.effects, health: (choice.effects.health ?? 0) - (age > 65 ? 3 : age > 40 ? 1 : 0) };
  return { ...life, age, actions: 0, alive, stats: modify(life, effects), job, education: choice.education ?? life.education,
    money: Math.max(0, life.money + Math.round(salary * .35) + (choice.money ?? 0)),
    people: choice.person && !life.people.some(p => p.name === choice.person?.name) ? [...life.people, choice.person] : life.people,
    journal: [...life.journal, { age, title: event.title, text: choice.outcome, kind: 'choice' }, ...(!alive ? [{ age, title: 'A life remembered', text: 'My story has come to its end. The people I loved, the choices I made, and the little moments in between became a life that was entirely mine.', kind: 'milestone' as const }] : [])],
  };
}
export function takeAction(life: Life, title: string, text: string, effects: Partial<Stats>, money = 0): Life {
  return { ...life, actions: life.actions + 1, stats: modify(life, effects), money: life.money + money, journal: [...life.journal, { age: life.age, title, text, kind: 'activity' }] };
}
export function isLife(value: unknown): value is Life {
  if (!value || typeof value !== 'object') return false;
  const l = value as Partial<Life>;
  return l.version === 1 && typeof l.name === 'string' && typeof l.country === 'string' && typeof l.sex === 'string' && typeof l.family === 'string' && typeof l.age === 'number' && l.age >= 0 && l.age <= 90 && typeof l.alive === 'boolean' && typeof l.money === 'number' && typeof l.actions === 'number' && typeof l.job === 'string' && typeof l.education === 'string' && Array.isArray(l.assets) && l.assets.every(a => typeof a === 'string') && Array.isArray(l.people) && l.people.every(p => typeof p.name === 'string' && typeof p.role === 'string' && typeof p.bond === 'number') && Array.isArray(l.journal) && l.journal.every(e => typeof e.age === 'number' && typeof e.title === 'string' && typeof e.text === 'string') && !!l.stats && ['happiness', 'health', 'smarts', 'looks'].every(k => typeof l.stats?.[k as keyof Stats] === 'number');
}