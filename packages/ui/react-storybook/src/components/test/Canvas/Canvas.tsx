import React, { useEffect, useMemo } from 'react';

import Animation from './Animation';

function Canvas() {
  const animationTest = useMemo(() => new Animation(), []);

  useEffect(() => {
    const obj: () => void = animationTest.run();

    return obj;
  }, [animationTest]);

  return <canvas id='canvas-test' />;
}

export default Canvas;
