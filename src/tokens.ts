export const color = {
  primary: '#3182F6',
  primaryLight: '#EAF3FE',
  primaryDeep: '#1B64DA',

  heart: '#FF5B3E',
  heartLight: '#FFF0EC',
  heartBorder: '#FFB9A8',

  textPrimary: '#191F28',
  textSecondary: '#4E5968',
  textTertiary: '#6B7684',
  textQuaternary: '#8B95A1',
  textDisabled: '#B0B8C1',
  border: '#E5E8EB',
  borderDashed: '#D1D6DB',
  fillDeep: '#E8EBED',
  fill: '#F2F4F6',
  fillLight: '#F9FAFB',
  canvas: '#EDF0F3',
  surface: '#FFFFFF',

  success: '#38C79C',
  successDeep: '#17A05D',
  kakao: '#FEE500',
} as const

export const AV_PALETTE = ['#3182F6', '#00A5B8', '#7B61FF', '#F5A623', '#FF5B3E', '#38C79C']

export const AV: Record<string, string> = {
  지민: '#3182F6',
  서연: '#00A5B8',
  준호: '#7B61FF',
  지수: '#F5A623',
  하늘: '#FF5B3E',
  도윤: '#38C79C',
}

export const avatarColor = (name: string, index: number): string =>
  AV[name] ?? AV_PALETTE[index % AV_PALETTE.length]
