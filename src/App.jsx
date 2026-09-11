import { useEffect, useRef, useState } from 'react';
import { loadActiveEvent } from './data/loadSchedule.js';

const INFO_DISPLAY_MS = 10_000;
const SCHEDULE_RECHECK_MS = 30 * 60_000;

export default function App() {
  const [screen, setScreen] = useState('welcome');
  const [welcomeSrc, setWelcomeSrc] = useState('./welcome.jpg');
  const [infoSrc, setInfoSrc] = useState('./info.jpg');
  const returnTimer = useRef(null);

  const showInfo = () => {
    if (screen !== 'welcome') return;
    setScreen('info');
    returnTimer.current = setTimeout(() => setScreen('welcome'), INFO_DISPLAY_MS);
  };

  useEffect(() => () => clearTimeout(returnTimer.current), []);

  useEffect(() => {
    const applySchedule = () => {
      loadActiveEvent().then(active => {
        if (active) {
          setWelcomeSrc(active.welcome);
          setInfoSrc(active.info);
        }
      });
    };
    applySchedule();
    const interval = setInterval(applySchedule, SCHEDULE_RECHECK_MS);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="app">
      {screen === 'welcome' ? (
        <div
          className="sign-screen"
          role="button"
          tabIndex={0}
          aria-label="Show event info"
          onClick={showInfo}
          onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && showInfo()}
        >
          <img src={welcomeSrc} alt="Welcome to Rec Hall" className="sign-image" />
        </div>
      ) : (
        <div className="sign-screen">
          <div className="info-fallback">
            <p>Add <code>info.jpg</code> to the <code>public/</code> folder to display the event schedule here.</p>
          </div>
          <img
            src={infoSrc}
            alt="Event schedule and rotation order"
            className="sign-image"
            onError={e => { e.currentTarget.style.display = 'none'; }}
          />
        </div>
      )}
    </div>
  );
}
