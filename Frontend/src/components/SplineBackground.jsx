import React from 'react';
import Spline from '@splinetool/react-spline';

const SplineBackground = () => {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      zIndex: -1,
      pointerEvents: 'none'
    }}>
      <Spline
        scene="https://prod.spline.design/6Wq1Q7YGyM-iab9i/scene.splinecode"
        style={{
          width: '100%',
          height: '100%'
        }}
      />
    </div>
  );
};

export default SplineBackground; 