import { useState, useEffect } from 'react';

interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
}

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true, // Siempre activadas
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    // Comprobar si ya aceptó cookies
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      // Mostrar banner después de 1 segundo
      setTimeout(() => setIsVisible(true), 1000);
    }
  }, []);

  const acceptAll = () => {
    const allAccepted = { necessary: true, analytics: true, marketing: true };
    localStorage.setItem('cookie-consent', JSON.stringify(allAccepted));
    localStorage.setItem('cookie-consent-date', new Date().toISOString());
    setIsVisible(false);
    // Aquí cargarías los scripts de analytics/marketing
    loadAnalytics();
  };

  const rejectAll = () => {
    const onlyNecessary = { necessary: true, analytics: false, marketing: false };
    localStorage.setItem('cookie-consent', JSON.stringify(onlyNecessary));
    localStorage.setItem('cookie-consent-date', new Date().toISOString());
    setIsVisible(false);
  };

  const savePreferences = () => {
    localStorage.setItem('cookie-consent', JSON.stringify(preferences));
    localStorage.setItem('cookie-consent-date', new Date().toISOString());
    setIsVisible(false);
    if (preferences.analytics) loadAnalytics();
  };

  const loadAnalytics = () => {
    // Aquí cargarías Google Analytics u otros scripts
    console.log('Analytics cargado');
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50 z-[60]" />
      
      {/* Banner */}
      <div className="fixed bottom-0 left-0 right-0 z-[70] p-4">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden">
          {!showSettings ? (
            // Vista principal
            <div className="p-6">
              <div className="flex items-start gap-4">
                <span className="text-4xl">🍪</span>
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-gray-900 mb-2">
                    Tu privacidad es importante
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Utilizamos cookies para mejorar tu experiencia, personalizar contenido y analizar nuestro tráfico. 
                    Puedes aceptar todas, rechazarlas o configurar tus preferencias.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={acceptAll}
                      className="bg-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors"
                    >
                      Aceptar todas
                    </button>
                    <button
                      onClick={rejectAll}
                      className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                    >
                      Solo necesarias
                    </button>
                    <button
                      onClick={() => setShowSettings(true)}
                      className="text-purple-600 px-6 py-2 rounded-lg font-medium hover:bg-purple-50 transition-colors"
                    >
                      Configurar
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-4">
                    Al hacer clic en "Aceptar todas", aceptas el almacenamiento de cookies en tu dispositivo. 
                    <a href="/cookies" className="text-purple-600 hover:underline ml-1">Más información</a>
                  </p>
                </div>
              </div>
            </div>
          ) : (
            // Vista de configuración
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-lg text-gray-900">Configurar cookies</h3>
                <button
                  onClick={() => setShowSettings(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4 mb-6">
                {/* Necesarias */}
                <div className="flex items-start justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">Cookies necesarias</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      Esenciales para el funcionamiento del sitio web. No se pueden desactivar.
                    </p>
                  </div>
                  <div className="ml-4">
                    <input
                      type="checkbox"
                      checked={true}
                      disabled
                      className="w-5 h-5 rounded text-purple-600"
                    />
                  </div>
                </div>

                {/* Analíticas */}
                <div className="flex items-start justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">Cookies analíticas</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      Nos ayudan a entender cómo usas el sitio web para mejorarlo.
                    </p>
                  </div>
                  <div className="ml-4">
                    <input
                      type="checkbox"
                      checked={preferences.analytics}
                      onChange={(e) => setPreferences({ ...preferences, analytics: e.target.checked })}
                      className="w-5 h-5 rounded text-purple-600 focus:ring-purple-500 cursor-pointer"
                    />
                  </div>
                </div>

                {/* Marketing */}
                <div className="flex items-start justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">Cookies de marketing</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      Permiten mostrarte anuncios relevantes en otras plataformas.
                    </p>
                  </div>
                  <div className="ml-4">
                    <input
                      type="checkbox"
                      checked={preferences.marketing}
                      onChange={(e) => setPreferences({ ...preferences, marketing: e.target.checked })}
                      className="w-5 h-5 rounded text-purple-600 focus:ring-purple-500 cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={savePreferences}
                  className="flex-1 bg-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors"
                >
                  Guardar preferencias
                </button>
                <button
                  onClick={acceptAll}
                  className="flex-1 bg-gray-200 text-gray-700 px-6 py-2 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                >
                  Aceptar todas
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
