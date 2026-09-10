import { useEffect, useRef, useState } from 'react';

const INFO_DISPLAY_MS = 10_000;

export default function App() {
  const [screen, setScreen] = useState('welcome');
  const returnTimer = useRef(null);

  const showInfo = () => {
    if (screen !== 'welcome') return;
    setScreen('info');
    returnTimer.current = setTimeout(() => setScreen('welcome'), INFO_DISPLAY_MS);
  };

  useEffect(() => () => clearTimeout(returnTimer.current), []);

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
          <img src="./welcome.jpg" alt="Welcome to Rec Hall" className="sign-image" />
        </div>
      ) : (
        <div className="sign-screen">
          <div className="info-fallback">
            <p>Add <code>info.jpg</code> to the <code>public/</code> folder to display the event schedule here.</p>
          </div>
          <img
            src="./info.jpg"
            alt="Event schedule and rotation order"
            className="sign-image"
            onError={e => { e.currentTarget.style.display = 'none'; }}
          />
        </div>
      )}
    </div>
  );
}
