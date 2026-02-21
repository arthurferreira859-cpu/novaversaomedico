
/**
 * Serviço de rastreamento neutralizado para evitar erros de console.
 */
export const trackEvent = (eventName: string, params?: object) => {
  // Apenas loga no console em desenvolvimento se necessário, sem tentar acessar window.fbq que causa erros
  // console.debug('Track:', eventName, params);
};

export const trackCustomEvent = (eventName: string, params?: object) => {
  // Neutralizado
};
