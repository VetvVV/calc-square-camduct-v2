export const parameterColorTokens = {
  width: 'parameter.width',
  height: 'parameter.height',
  length: 'parameter.length',
  diameter: 'parameter.diameter',
  angle: 'parameter.angle',
  radius: 'parameter.radius',
} as const

export type ParameterColorToken = (typeof parameterColorTokens)[keyof typeof parameterColorTokens]
