import { describe, it, expect } from 'vitest';
import { makeLife, annualEvent, chooseYear, availableChores, doChore, skipChore, parentPitch, privateEligibility, tuitionAt, buyItem, depositSavings, academicEffort, normalizeLife, canTrain, gearMultiplier, worldAction } from '../lib/life-engine';
function child(age=6){const life=makeLife('Divine Bello');return {...life,age};}
describe('childhood economy and school',()=>{
 it('checks tuition and scholarship, enrolls at six and charges only family',()=>{
  const life=child(5);const event=annualEvent({...life,journal:[...life.journal,{age:5,title:'Little feet, big sports day',text:'Cheered',kind:'choice'}]});
  const publicChoice=event.choices[0];const privateChoice=event.choices[1];if(!publicChoice||!privateChoice)throw Error('No enrollment');
  const enrolled=chooseYear(life,event,privateChoice);expect(enrolled.age).toBe(6);expect(enrolled.school?.tuition).toBe(12000);expect(enrolled.kid.familyFunds).toBe(10000);expect(enrolled.money).toBe(0);
  const poor={...life,kid:{...life.kid,familyFunds:100}};expect(privateEligibility(poor).allowed).toBe(false);expect(chooseYear(poor,event,privateChoice)).toBe(poor);expect(chooseYear(poor,event,publicChoice).school?.type).toBe('public');
  const smart={...poor,stats:{...poor.stats,smarts:90}};expect(chooseYear(smart,event,privateChoice).school?.scholarship).toBe(true);expect(tuitionAt(12)).toBe(18000);expect(tuitionAt(15)).toBe(25000);
 });
 it('pays correct chore tiers once, costs energy, and freezes grounded allowance',()=>{
  expect(availableChores(child(4))).toHaveLength(0);expect(availableChores(child(5)).map(c=>c.reward)).toEqual([3,5,6,8,10]);expect(availableChores(child(8)).map(c=>c.reward)).toEqual([12,15,18,25,30]);expect(availableChores(child(12)).map(c=>c.reward)).toEqual([35,45,55,65,85]);
  const next=doChore(child(5),'Tidy toys');expect(next.money).toBe(3);expect(next.kid.energy).toBe(96);expect(doChore(next,'Tidy toys')).toBe(next);const grounded=skipChore(next);expect(canTrain(grounded)).toBe(false);expect(doChore(grounded,'Wipe table').money).toBe(3);
 });
 it('handles parent promises and risky pitches without unlimited money',()=>{
  const life=child();const next=parentPitch(life,0,'money','Polite Bargain');expect(next.money).toBe(10);expect(next.kid.promisedChore).toBe(true);expect(parentPitch(next,0,'money','Sweet Beggar')).toBe(next);expect(doChore(next,'Pair socks').kid.promisedChore).toBe(false);expect(parentPitch(life,0,'sports','Meltdown').kid.groundedUntil).toBe(7);
 });
 it('purchases gear and savings, applies academic upgrades and releases at eighteen',()=>{
  const life=normalizeLife({...child(),money:200});const gear=buyItem(life,'gear');expect(gear.money).toBe(160);expect(gearMultiplier(gear)).toBe(1.2);expect(buyItem(gear,'gear')).toBe(gear);let saved=depositSavings(buyItem(gear,'piggy'),50);expect(saved.kid.savings).toBe(50);expect(saved.money).toBe(100);saved={...saved,age:17};const event=annualEvent(saved);const choice=event.choices[0];if(!choice)throw Error('No choice');const adult=chooseYear(saved,event,choice);expect(adult.kid.savings).toBe(0);expect(adult.money).toBe(150);expect(academicEffort(life,'study').school?.gpa).toBeGreaterThan(life.school?.gpa??0);
 });
 it('upgrades old saves without changing the journal and enforces world gates',()=>{
  const life=child();const {kid,school,...old}=life;const next=normalizeLife(old as typeof life);expect(next.journal).toEqual(life.journal);expect(next.school?.type).toBe('public');expect(next.kid.energy).toBe(100);expect(worldAction({...life,money:10000},'France')).toMatchObject({country:'Nigeria',money:10000});expect(worldAction({...life,age:21,money:10000},'France',true).country).toBe('France');
 });
});