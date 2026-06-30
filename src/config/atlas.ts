function buildPublicAssetPath(path: string) {
  return `${import.meta.env.BASE_URL}${path}`
}

export type AtlasStatus = 'available' | 'coming_soon'
export type AtlasModuleKey = 'round-duct' | 'spiral-duct'

export interface LocalizedText {
  ru: string
  uk: string
  en: string
}

export interface AtlasItemConfig {
  code: string
  title: LocalizedText
  image: string
  status: AtlasStatus
  moduleKey?: AtlasModuleKey
}

export interface AtlasCategoryConfig {
  categoryKey: string
  title: LocalizedText
  items: AtlasItemConfig[]
}

export const atlasConfig: AtlasCategoryConfig[] = [
  {
    categoryKey: 'round',
    title: {
      ru: 'Круглые изделия',
      uk: 'Круглі вироби',
      en: 'Round products',
    },
    items: [
      {
        code: 'R-001',
        status: 'available',
        moduleKey: 'round-duct',
        title: {
          ru: 'Труба прямошовная',
          uk: 'Труба прямошовна',
          en: 'Straight seam duct',
        },
        image: buildPublicAssetPath('assets/atlas/01-round-duct-v2.png'),
      },
      {
        code: 'SPIRAL-001',
        status: 'available',
        moduleKey: 'spiral-duct',
        title: {
          ru: 'Труба спирально-навивная',
          uk: 'Спірально-навивна труба',
          en: 'Spiral duct',
        },
        image: buildPublicAssetPath('assets/atlas/round-duct-spiro.png'),
      },
      {
        code: 'R-002',
        status: 'coming_soon',
        title: {
          ru: 'Отвод 45°',
          uk: 'Відвід 45°',
          en: 'Round elbow 45°',
        },
        image: buildPublicAssetPath('assets/atlas/02-round-elbow-45.png'),
      },
      {
        code: 'R-003',
        status: 'coming_soon',
        title: {
          ru: 'Отвод 90°',
          uk: 'Відвід 90°',
          en: 'Round elbow 90°',
        },
        image: buildPublicAssetPath('assets/atlas/02-round-elbow-90.png'),
      },
      {
        code: 'R-004',
        status: 'coming_soon',
        title: {
          ru: 'Переход круглый',
          uk: 'Перехід круглий',
          en: 'Round transition',
        },
        image: buildPublicAssetPath('assets/atlas/03-round-transition-v4-welded-no-rivets.png'),
      },
      {
        code: 'R-005',
        status: 'coming_soon',
        title: {
          ru: 'Переход круглый со смещением',
          uk: 'Перехід круглий зі зміщенням',
          en: 'Round offset transition',
        },
        image: buildPublicAssetPath('assets/atlas/04-round-offset-transition-v8-full-transition-seam.png'),
      },
      {
        code: 'R-006',
        status: 'coming_soon',
        title: {
          ru: 'Тройник круглый',
          uk: 'Трійник круглий',
          en: 'Round tee',
        },
        image: buildPublicAssetPath('assets/atlas/05-round-tee-v6-even-shorter-trunk.png'),
      },
      {
        code: 'R-007',
        status: 'coming_soon',
        title: {
          ru: 'Тройник переходной',
          uk: 'Трійник перехідний',
          en: 'Reducing tee',
        },
        image: buildPublicAssetPath('assets/atlas/06-round-tee-custom-v2-transition-with-branch.png'),
      },
      {
        code: 'R-008',
        status: 'coming_soon',
        title: {
          ru: 'Заглушка круглая',
          uk: 'Заглушка кругла',
          en: 'Round cap',
        },
        image: buildPublicAssetPath('assets/atlas/07-round-cap.png'),
      },
      {
        code: 'R-009',
        status: 'coming_soon',
        title: {
          ru: 'Врезка круглая',
          uk: 'Врізка кругла',
          en: 'Round inset',
        },
        image: buildPublicAssetPath('assets/atlas/08-round-inset-v4-base-radius-joint.png'),
      },
      {
        code: 'R-010',
        status: 'coming_soon',
        title: {
          ru: 'Седло круглое',
          uk: 'Сідло кругле',
          en: 'Round saddle',
        },
        image: buildPublicAssetPath('assets/atlas/09-round-saddle.png'),
      },
      {
        code: 'R-011',
        status: 'coming_soon',
        title: {
          ru: 'Ниппель круглый',
          uk: 'Ніпель круглий',
          en: 'Round nipple',
        },
        image: buildPublicAssetPath('assets/atlas/10-round-nipple.png'),
      },
      {
        code: 'R-012',
        status: 'coming_soon',
        title: {
          ru: 'Шумоглушитель круглый',
          uk: 'Шумоглушник круглий',
          en: 'Round silencer',
        },
        image: buildPublicAssetPath('assets/atlas/11-round-silencer.png'),
      },
      {
        code: 'R-013',
        status: 'coming_soon',
        title: {
          ru: 'Крестовина круглая',
          uk: 'Хрестовина кругла',
          en: 'Round cross',
        },
        image: buildPublicAssetPath('assets/atlas/12-round-cross.png'),
      },
    ],
  },
]