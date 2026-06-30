function buildPublicAssetPath(path: string) {
  return `${import.meta.env.BASE_URL}${path}`
}

export interface AtlasVariantConfig {
  moduleKey: 'round-duct' | 'spiral-duct'
  code: string
  title: {
    ru: string
    uk: string
    en: string
  }
  image: string
}

export interface AtlasFamilyConfig {
  familyKey: string
  title: {
    ru: string
    uk: string
    en: string
  }
  image: string
  variants: AtlasVariantConfig[]
}

export interface AtlasCategoryConfig {
  categoryKey: string
  title: {
    ru: string
    uk: string
    en: string
  }
  families: AtlasFamilyConfig[]
}

export const atlasConfig: AtlasCategoryConfig[] = [
  {
    categoryKey: 'round',
    title: {
      ru: 'Круглые',
      uk: 'Круглі',
      en: 'Round',
    },
    families: [
      {
        familyKey: 'round-duct',
        title: {
          ru: 'Воздуховод круглый',
          uk: 'Повітропровід круглий',
          en: 'Round duct',
        },
        image: buildPublicAssetPath('assets/atlas/round-duct-v2.png'),
        variants: [
          {
            moduleKey: 'round-duct',
            code: 'R-001',
            title: {
              ru: 'Труба прямошовная',
              uk: 'Труба прямошовна',
              en: 'Straight seam duct',
            },
            image: buildPublicAssetPath('assets/atlas/round-duct-v2.png'),
          },
          {
            moduleKey: 'spiral-duct',
            code: 'SPIRAL-001',
            title: {
              ru: 'Труба спирально-навивная',
              uk: 'Труба спірально-навивна',
              en: 'Spiral duct',
            },
            image: buildPublicAssetPath('assets/atlas/round-duct-spiro.png'),
          },
        ],
      },
    ],
  },
]
