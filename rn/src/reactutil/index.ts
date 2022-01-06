import React from 'react'

// eslint-disable-next-line react-hooks/exhaustive-deps
export const useMountEffect = (effect: React.EffectCallback) => React.useEffect(effect, [])
