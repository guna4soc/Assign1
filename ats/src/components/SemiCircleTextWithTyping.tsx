import React from 'react';
import './SemiCircleTextWithTyping.css';

const SemiCircleTextWithTyping: React.FC = () => {
  return (
    <div className="semi-circle-container">
      <svg viewBox="0 0 300 150" width="300" height="150">
        <path id="semiCirclePath" d="M 60 130 A 90 90 0 0 1 240 130" fill="transparent" />
        <text fill="white" fontSize="24" fontWeight="bold">
          <textPath href="#semiCirclePath" startOffset="0%" textAnchor="middle">
            blod
          </textPath>
        </text>
      </svg>
      {/* Add smaller blobs below the main semi-circle */}
      {/* <div className="blobs-row">
        <span className="blob" />
        <span className="blob" />
        <span className="blob" />
      </div> */}
      {/* Typing animation further below */}
      {/* <div className="typing-animation" style={{ marginTop: '40px' }}>
        <span className="typed-text">Welcome to ATS!</span>
        <span className="cursor">|</span>
      </div> */}
    </div>
  );
};

export default SemiCircleTextWithTyping;
