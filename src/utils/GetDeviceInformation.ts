import fpJS from '@fingerprintjs/fingerprintjs';

interface DeviceData {
  deviceId: string;
  languages: readonly string[];
  platform: string;
  screenResolution: [number, number];
}

export async function getDeviceInformation(): Promise<DeviceData | null> {

  try {
    // Inicializa o agente do Fingerprint
    const fp = await fpJS.load();
    
    // Obtém o resultado do fingerprinting
    const result = await fp.get();

    // O "visitorId" funciona como o seu Device ID único do navegador
    const deviceId = result.visitorId;

    // Informações adicionais do dispositivo capturadas pelos componentes internos
    const components = result.components;
    const languages = components.languages.value as readonly string[];
    const platform = components.platform.value as string;
    const screenResolution = components.screenResolution.value as [number, number];

    return {
      deviceId,
      languages,
      platform,
      screenResolution
    };
  } catch (error) {
    console.error('Erro ao obter dados do dispositivo:', error);
    return null;
  }
}