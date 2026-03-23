export const visualAssets = {
  factoryFloor: 'http://www.hytorist.com/UploadFiles/201571033051350.png',
  digitalScene: 'http://www.hytorist.com/UploadFiles/202322316923919.png',
  windAssembly: 'http://www.hytorist.com/UploadFiles/2021612232830330.jpg',
  workshop:
    'https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?auto=format&fit=crop&w=1400&q=80',
  office:
    'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1400&q=80',
  lab:
    'https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?auto=format&fit=crop&w=1400&q=80',
  service:
    'https://images.unsplash.com/photo-1531058020387-3be344556be6?auto=format&fit=crop&w=1400&q=80',
  turbine:
    'https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&w=1400&q=80',
  pipeline:
    'https://images.unsplash.com/photo-1473445361085-b9a07f55608b?auto=format&fit=crop&w=1400&q=80',
  pump:
    'https://images.unsplash.com/photo-1565008447742-97f6f38c985c?auto=format&fit=crop&w=1400&q=80',
  wrench:
    'https://images.unsplash.com/photo-1518773553398-650c184e0bb3?auto=format&fit=crop&w=1400&q=80',
  team:
    'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1400&q=80',
  training:
    'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1400&q=80'
} as const

export const portalHeroVisuals = {
  about: visualAssets.digitalScene,
  manufacturing: visualAssets.factoryFloor,
  products: visualAssets.windAssembly,
  engineering: visualAssets.windAssembly,
  cases: visualAssets.turbine,
  support: visualAssets.factoryFloor,
  news: visualAssets.digitalScene,
  hr: visualAssets.team,
  contact: visualAssets.factoryFloor
} as const
