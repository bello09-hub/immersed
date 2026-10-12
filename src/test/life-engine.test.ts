import { describe, expect, it } from 'vitest';
import { makeLife, annualEvent, chooseYear, takeAction, isLife, modify, childhoodEvents, normalizeLife, resolveAthletics, raceScore, RACE_TARGET } from '../lib/life-engine';

describe('IMMERSED life simulation', () => {
  it('creates a valid newborn with family and memories', () => {
    const life = makeLife('Divine Bello', 'Nigeria', 'Male');
    expect(isLife(life)).toBe(true);
    expect(life.age).toBe(0);
    expect(life.people).toHaveLength(2);
    expect(life.journal[0]?.text).toContain('a boy in Nigeria');
  });
  it('records consequences and resets yearly activity allowance', () => {
    const life = takeAction({ ...makeLife(), age: 6 }, 'Rest', 'I rested.', { health: 8 });
    const event = annualEvent(life);
    const choice = event.choices[0];
    if (!choice) throw new Error('Expected a yearly choice');
    const next = chooseYear(life, event, choice);
    expect(next.age).toBe(7);
    expect(next.actions).toBe(0);
    expect(next.journal.at(-1)?.text).toBe(choice.outcome);
    expect(next.journal.at(-1)?.choice).toBe(choice.label);
    expect(next.stats.happiness).toBeGreaterThan(life.stats.happiness);
  });
  it('keeps stats in bounds', () => {
    expect(modify(makeLife(), { health: 200, smarts: -500 })).toMatchObject({ health: 100, smarts: 0 });
  });
  it('supports school, university, work, retirement and a completed life', () => {
    let life = makeLife();
    while(life.alive) {
      const event = annualEvent(life);
      const choice = event.choices[0];
      if (!choice) throw new Error('Expected a yearly choice');
      life = chooseYear(life, event, choice);
      if(life.age === 6) expect(life.education).toBe('Primary school');
      if(life.age === 18) expect(life.education).toBe('University student');
      if(life.age === 22) expect(life.job).toBe('Junior analyst');
      if(life.age === 65) expect(life.job).toBe('Retired');
      expect(isLife(life)).toBe(true);
    }
    expect(life.money).toBeGreaterThan(0);
    expect(life.journal.at(-1)?.title).toBe('A life remembered');
  });
  it('rejects corrupt and old incompatible saves', () => {
    expect(isLife(null)).toBe(false);
    expect(isLife({ name: 'Divine', age: 3 })).toBe(false);
    expect(isLife({ ...makeLife(), people: [null] })).toBe(false);
  });
  it('plays every childhood dilemma once, including multiple moments at one age', () => {
    let life = makeLife();
    for (const expected of childhoodEvents) {
      const event = annualEvent(life);
      expect(event.title).toBe(expected.title);
      const choice = event.choices[0];
      if (!choice) throw new Error('Missing choice');
      life = chooseYear(life, event, choice);
      expect(life.age).toBe(expected.age);
      expect(life.journal.at(-1)?.choice).toBe(choice.label);
      life = normalizeLife(JSON.parse(JSON.stringify(life)));
    }
    expect(annualEvent(life).title).toBe('The first day of school');
    expect(life.journal.filter(j => j.kind === 'choice')).toHaveLength(childhoodEvents.length);
  });
  it('changes creativity, mischief and family bonds for cheeky decisions', () => {
    const event = childhoodEvents.find(e => e.age === 2);
    const choice = event?.choices[1];
    if (!event || !choice) throw new Error('Missing mural event');
    const life = makeLife();
    const next = chooseYear(life, event, choice);
    expect(next.stats.creativity).toBe(life.stats.creativity + 6);
    expect(next.stats.mischief).toBe(life.stats.mischief + 5);
    expect(next.people[0]?.bond).toBe(90);
  });
  it('does not reset action allowance or pay salary for a same-age moment', () => {
    const life = { ...makeLife(), age: 3, actions: 2, job: 'Shop assistant' };
    const event = childhoodEvents.find(e => e.age === 3);
    const choice = event?.choices[0];
    if (!event || !choice) throw new Error('Missing event');
    const next = chooseYear(life, event, choice);
    expect(next.actions).toBe(2);
    expect(next.money).toBe(0);
  });
  it('upgrades legacy saves without losing their story', () => {
    const life = makeLife();
    const { creativity, mischief, toughness, ...oldStats } = life.stats;
    const legacy = { ...life, stats: oldStats };
    expect(isLife(legacy)).toBe(true);
    if (!isLife(legacy)) throw new Error('Invalid legacy save');
    const upgraded = normalizeLife(legacy);
    expect(upgraded.stats).toEqual(life.stats);
    expect(upgraded.journal).toEqual(life.journal);
  });
  it('awards medals and praise only at the race threshold, with funny losses', () => {
    const life = makeLife();
    const won = resolveAthletics(life, 'sprint', RACE_TARGET);
    const lost = resolveAthletics(life, 'swim', RACE_TARGET - 1);
    expect(raceScore(RACE_TARGET + 10)).toBe(100);
    expect(raceScore(-1)).toBe(0);
    expect(won.assets).toContain('Sprint gold medal');
    expect(won.stats.toughness).toBe(life.stats.toughness + 5);
    expect(won.journal.at(-1)?.text).toContain('teacher praised');
    expect(lost.assets).toHaveLength(0);
    expect(lost.journal.at(-1)?.text).toContain('splashed enthusiastically');
    expect(isLife(won)).toBe(true);
  });
});