import certificate from '../assets/official/certificate.jpg'
import digitalScene from '../assets/official/digital-scene.png'
import factoryFloor from '../assets/official/factory-floor.png'
import fieldService from '../assets/official/field-service.png'
import wechatQr from '../assets/official/wechat-qr.png'
import windAssembly from '../assets/official/wind-assembly.jpg'

export const officialImageAssets = {
  certificate,
  digitalScene,
  factoryFloor,
  fieldService,
  wechatQr,
  windAssembly
} as const

const officialUploadMap: Record<string, string> = {
  '/UploadFiles/201578185652222.jpg': officialImageAssets.certificate,
  '/UploadFiles/202322316923919.png': officialImageAssets.digitalScene,
  '/UploadFiles/201571033051350.png': officialImageAssets.factoryFloor,
  '/UploadFiles/20157262092864.png': officialImageAssets.fieldService,
  '/UploadFiles/20202182394680.png': officialImageAssets.wechatQr,
  '/UploadFiles/2021612232830330.jpg': officialImageAssets.windAssembly
}

const officialHosts = new Set(['hytorist.com', 'www.hytorist.com'])

export const resolveOfficialAssetUrl = (value?: string | null) => {
  if (!value) {
    return value || ''
  }

  try {
    const parsed = new URL(value)
    if (!officialHosts.has(parsed.hostname)) {
      return value
    }

    return officialUploadMap[parsed.pathname] || value
  } catch {
    return officialUploadMap[value] || value
  }
}
