import { useEffect, useRef, useState } from 'react';
import { Footprints, Waves, Trophy, Flag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { RACE_DURATION, RACE_TARGET, raceScore, type Sport } from '@/lib/life-engine';

export function AthleticsGame({ sport, onFinish }: { sport: Sport; onFinish: (taps: number) => void }) {
  const [phase, setPhase] = useState<'ready' | 'racing' | 'result'>('ready');
  const [remaining, setRemaining] = useState(RACE_DURATION);
  const [taps, setTaps] = useState(0);
  const deadline = useRef(0);
  const tapCount = useRef(0);
  useEffect(() => {
    if (phase !== 'racing') return;
    const timer = window.setInterval(() => {
      const time = Math.max(0, deadline.current - performance.now());
      setRemaining(time);
      if (time === 0) setPhase('result');
    }, 40);
    return () => window.clearInterval(timer);
  }, [phase]);
  const won = taps >= RACE_TARGET;
  const Icon = sport === 'sprint' ? Footprints : Waves;
  function start() { deadline.current = performance.now() + RACE_DURATION; setPhase('racing'); }
  function tap() {
    if (phase !== 'racing' || performance.now() >= deadline.current) return;
    tapCount.current += 1;
    setTaps(tapCount.current);
  }
  return <Dialog open><DialogContent className="game-dialog athletics-dialog" onEscapeKeyDown={e => e.preventDefault()} onPointerDownOutside={e => e.preventDefault()} aria-describedby="race-description">
    <div className="event-age">IMMERSED · ATHLETICS</div>
    <DialogTitle>{phase === 'result' ? won ? 'Gold medal!' : 'A brave effort.' : sport === 'sprint' ? 'On your marks.' : 'Into the water.'}</DialogTitle>
    <DialogDescription id="race-description">{phase === 'ready' ? `Five seconds. ${RACE_TARGET} ${sport === 'sprint' ? 'strides' : 'strokes'}. Your rivals are ready.` : phase === 'racing' ? 'Your classmates are cheering!' : won ? 'You beat your rivals. Your teacher is beaming.' : 'Your rivals got there first. There is always next time.'}</DialogDescription>
    <div className="race-clock" aria-live={phase === 'result' ? 'polite' : 'off'}>{phase === 'result' ? <Trophy/> : <span>{(remaining / 1000).toFixed(1)}<small>SECONDS</small></span>}</div>
    <div className="race-lanes"><div><span>You <strong>{taps} {sport === 'sprint' ? 'strides' : 'strokes'}</strong></span><progress aria-label="Your race meter" value={raceScore(taps)} max={100}/></div><div className="rival-lane"><span>Rivals<Flag size={14}/></span><progress aria-label="Rivals race meter" value={phase === 'result' ? 100 : (RACE_DURATION - remaining) / RACE_DURATION * 100} max={100}/></div></div>
    {phase === 'ready' ? <Button className="full-action" onClick={start}>Start race<Icon/></Button> : phase === 'racing' ? <Button className="tap-race-button" aria-label={sport === 'sprint' ? 'Run' : 'Swim'} onPointerDown={e => { if(e.button === 0) { e.preventDefault(); tap(); } }} onClick={e => { if(e.detail === 0) tap(); }}><Icon size={32}/>{sport === 'sprint' ? 'RUN!' : 'SWIM!'}</Button> : <Button className="full-action" onClick={() => onFinish(taps)}>Back to my story<Flag/></Button>}
  </DialogContent></Dialog>;
}