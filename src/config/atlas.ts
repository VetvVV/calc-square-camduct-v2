function buildPublicAssetPath(path: string) {
  return `${import.meta.env.BASE_URL}${path}`
}

export type AtlasStatus = 'available' | 'coming_soon'
export type AtlasModuleKey = 'round-duct' | 'spiral-duct' | 'rect-duct'

export interface LocalizedText {
  ru: string
  uk: string
  en: string
}

export interface AtlasItemConfig {
  code: string
  title: LocalizedText
  image?: string
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
        code: 'KRG-001',
        status: 'available',
        moduleKey: 'round-duct',
        title: {
          ru: 'Воздуховод круглый / труба прямошовная',
          uk: 'Труба прямошовна',
          en: 'Round duct / straight seam pipe',
        },
        image: buildPublicAssetPath('assets/atlas/01-round-duct-v2.png'),
      },
      {
        code: 'R-sp-001',
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
        code: 'KRG-002',
        status: 'coming_soon',
        title: {
          ru: 'Отвод круглый',
          uk: 'Відвід 45°',
          en: 'Round elbow',
        },
        image: buildPublicAssetPath('assets/atlas/02-round-elbow-45.png'),
      },
      {
        code: 'KRG-003',
        status: 'coming_soon',
        title: {
          ru: 'Переход круглый центральный',
          uk: 'Перехід круглий центральний',
          en: 'Central round transition',
        },
        image: buildPublicAssetPath('assets/atlas/02-round-elbow-90.png'),
      },
      {
        code: 'KRG-004',
        status: 'coming_soon',
        title: {
          ru: 'Переход круглый со смещением / односторонний',
          uk: 'Перехід круглий зі зміщенням / односторонній',
          en: 'Offset / one-sided round transition',
        },
        image: buildPublicAssetPath('assets/atlas/03-round-transition-v4-welded-no-rivets.png'),
      },
      {
        code: 'KRG-005',
        status: 'coming_soon',
        title: {
          ru: 'Тройник круглый',
          uk: 'Трійник круглий',
          en: 'Round tee',
        },
        image: buildPublicAssetPath('assets/atlas/04-round-offset-transition-v8-full-transition-seam.png'),
      },
      {
        code: 'KRG-006',
        status: 'coming_soon',
        title: {
          ru: 'Тройник нестандартный круглый',
          uk: 'Трійник нестандартний круглий',
          en: 'Custom round tee',
        },
        image: buildPublicAssetPath('assets/atlas/05-round-tee-v6-even-shorter-trunk.png'),
      },
      {
        code: 'KRG-007',
        status: 'coming_soon',
        title: {
          ru: 'Заглушка круглая',
          uk: 'Заглушка кругла',
          en: 'Round cap',
        },
        image: buildPublicAssetPath('assets/atlas/06-round-tee-custom-v2-transition-with-branch.png'),
      },
      {
        code: 'KRG-008',
        status: 'coming_soon',
        title: {
          ru: 'Врезка круглая',
          uk: 'Врізка кругла',
          en: 'Round inset',
        },
        image: buildPublicAssetPath('assets/atlas/07-round-cap.png'),
      },
      {
        code: 'KRG-009',
        status: 'coming_soon',
        title: {
          ru: 'Седло',
          uk: 'Сідло',
          en: 'Saddle',
        },
        image: buildPublicAssetPath('assets/atlas/08-round-inset-v4-base-radius-joint.png'),
      },
      {
        code: 'KRG-010',
        status: 'coming_soon',
        title: {
          ru: 'Ниппель круглый',
          uk: 'Ніпель круглий',
          en: 'Round nipple',
        },
        image: buildPublicAssetPath('assets/atlas/09-round-saddle.png'),
      },
      {
        code: 'KRG-011',
        status: 'coming_soon',
        title: {
          ru: 'Шумоглушитель круглый',
          uk: 'Шумоглушник круглий',
          en: 'Round silencer',
        },
        image: buildPublicAssetPath('assets/atlas/10-round-nipple.png'),
      },
      {
        code: 'KRG-012',
        status: 'coming_soon',
        title: {
          ru: 'Зонт круглый',
          uk: 'Зонт круглий',
          en: 'Round hood',
        },
        image: buildPublicAssetPath('assets/atlas/11-round-silencer.png'),
      },
      {
        code: 'KRG-013',
        status: 'coming_soon',
        title: {
          ru: 'Дроссель круглый',
          uk: 'Дросель круглий',
          en: 'Round damper',
        },
        image: buildPublicAssetPath('assets/atlas/12-round-cross.png'),
      },
      { code: 'KRG-014', status: 'coming_soon', title: { ru: 'Фланец круглый', uk: 'Фланець круглий', en: 'Round flange' } },
      { code: 'KRG-015', status: 'coming_soon', title: { ru: 'Крестовина круглая', uk: 'Хрестовина кругла', en: 'Round cross' } },
      { code: 'KRG-016', status: 'coming_soon', title: { ru: 'Утка круглая', uk: 'Утка кругла', en: 'Round offset' } },
      { code: 'KRG-017', status: 'coming_soon', title: { ru: 'Обратный клапан круглый', uk: 'Зворотний клапан круглий', en: 'Round backdraft damper' } },
      { code: 'KRG-018', status: 'coming_soon', title: { ru: 'Дефлектор', uk: 'Дефлектор', en: 'Deflector' } },
      { code: 'KRG-019', status: 'coming_soon', title: { ru: 'Муфта', uk: 'Муфта', en: 'Coupling' } },
    ],
  },
  {
    categoryKey: 'rectangular',
    title: {
      ru: 'Прямоугольные изделия',
      uk: 'Прямокутні вироби',
      en: 'Rectangular products',
    },
    items: [
      { code: 'PRM-001', status: 'available', moduleKey: 'rect-duct', title: { ru: 'Воздуховод прямоугольный', uk: 'Повітропровід прямокутний', en: 'Rectangular duct' } },
      { code: 'PRM-002', status: 'coming_soon', title: { ru: 'Отвод прямоугольный', uk: 'Відвід прямокутний', en: 'Rectangular elbow' } },
      { code: 'PRM-003', status: 'coming_soon', title: { ru: 'Колено прямоугольное переходное', uk: 'Коліно прямокутне перехідне', en: 'Rectangular reducing elbow' } },
      { code: 'PRM-004', status: 'coming_soon', title: { ru: 'Переход прямоугольный', uk: 'Перехід прямокутний', en: 'Rectangular transition' } },
      { code: 'PRM-005', status: 'coming_soon', title: { ru: 'Тройник прямоугольный', uk: 'Трійник прямокутний', en: 'Rectangular tee' } },
      { code: 'PRM-006', status: 'coming_soon', title: { ru: 'Крестовина прямоугольная', uk: 'Хрестовина прямокутна', en: 'Rectangular cross' } },
      { code: 'PRM-007', status: 'coming_soon', title: { ru: 'Утка прямоугольная', uk: 'Утка прямокутна', en: 'Rectangular offset' } },
      { code: 'PRM-008', status: 'coming_soon', title: { ru: 'Заглушка прямоугольная', uk: 'Заглушка прямокутна', en: 'Rectangular cap' } },
      { code: 'PRM-009', status: 'coming_soon', title: { ru: 'Врезка прямоугольная', uk: 'Врізка прямокутна', en: 'Rectangular inset' } },
      { code: 'PRM-010', status: 'coming_soon', title: { ru: 'Прямоугольный воздуховод с прямоугольной врезкой', uk: 'Прямокутний повітропровід з прямокутною врізкою', en: 'Rectangular duct with rectangular inset' } },
      { code: 'PRM-011', status: 'coming_soon', title: { ru: 'Шумоглушитель прямоугольный', uk: 'Шумоглушник прямокутний', en: 'Rectangular silencer' } },
      { code: 'PRM-012', status: 'coming_soon', title: { ru: 'Зонт прямоугольный', uk: 'Зонт прямокутний', en: 'Rectangular hood' } },
      { code: 'PRM-013', status: 'coming_soon', title: { ru: 'Дроссель прямоугольный', uk: 'Дросель прямокутний', en: 'Rectangular damper' } },
    ],
  },
  {
    categoryKey: 'combined',
    title: {
      ru: 'Комбинированные изделия',
      uk: 'Комбіновані вироби',
      en: 'Combined products',
    },
    items: [
      { code: 'KMB-001', status: 'coming_soon', title: { ru: 'Переход прямоугольник → круг', uk: 'Перехід прямокутник → круг', en: 'Rectangular to round transition' } },
      { code: 'KMB-002', status: 'coming_soon', title: { ru: 'Седло с прямоугольной врезкой', uk: 'Сідло з прямокутною врізкою', en: 'Saddle with rectangular inset' } },
      { code: 'KMB-003', status: 'coming_soon', title: { ru: 'Тройник круг-прямоугольник', uk: 'Трійник круг-прямокутник', en: 'Round-rectangular tee' } },
      { code: 'KMB-004', status: 'coming_soon', title: { ru: 'Тройник прямоугольник-круг / прямоугольный воздуховод с круглой врезкой', uk: 'Трійник прямокутник-круг / прямокутний повітропровід з круглою врізкою', en: 'Rectangular-round tee / rectangular duct with round inset' } },
      { code: 'KMB-005', status: 'coming_soon', title: { ru: 'Адаптер круглый', uk: 'Адаптер круглий', en: 'Round adapter' } },
      { code: 'KMB-006', status: 'coming_soon', title: { ru: 'Адаптер прямоугольный', uk: 'Адаптер прямокутний', en: 'Rectangular adapter' } },
      { code: 'KMB-007', status: 'coming_soon', title: { ru: 'Жироуловитель', uk: 'Жироуловлювач', en: 'Grease trap' } },
    ],
  }
]



