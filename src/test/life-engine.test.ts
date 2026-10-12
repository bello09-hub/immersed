import { describe, expect, it } from 'vitest';
import { makeLife, annualEvent, chooseYear, takeAction, isLife, modify } from '../lib/life-engine';

describe('IMMERSED life simulation', () => {
  it('creates a valid newborn with family and memories', () => {
    const life = makeLife('Divine Bello', 'Nigeria', 'Male');
    expect(isLife(life)).toBe(true);
    expect(life.age).toBe(0);
    expect(life.people).toHaveLength(2);
    expect(life.journal[0]?.text).toContain('a boy in Nigeria');
  });
  it('records consequences and resets yearly activity allowance', () => {
    const life = takeAction(makeLife(), 'Rest', 'I rested.', { health: 8 });
    const event = annualEvent(life);
    const choice = event.choices[0];
    if (!choice) throw new Error('Expected a yearly choice');
    const next = chooseYear(life, event, choice);
    expect(next.age).toBe(1);
    expect(next.actions).toBe(0);
    expect(next.journal.at(-1)?.text).toBe(choice.outcome);
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
});