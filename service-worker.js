const NOME_DO_CACHE = 'crypto-tracker-v1';
const ficheirosParaCache = [
    './',
    './index.html',
    './manifest.json',
    './icon-192.png',
    './icon-512.png'
];

// 1. Instalação: Guarda a estrutura visual da app no telemóvel
self.addEventListener('install', (evento) => {
    evento.waitUntil(
        caches.open(NOME_DO_CACHE)
            .then((cache) => {
                console.log('Ficheiros guardados em cache com sucesso.');
                return cache.addAll(ficheirosParaCache);
            })
    );
});

// 2. Interceção: Decide como carregar os dados
self.addEventListener('fetch', (evento) => {
    // Se o pedido for para a API da CoinGecko (dados ao vivo)
    if (evento.request.url.includes('api.coingecko.com')) {
        evento.respondWith(
            fetch(evento.request).catch(() => {
                // Se falhar (sem internet), avisa em formato JSON vazio para não quebrar a app
                return new Response(JSON.stringify([]), {
                    headers: { 'Content-Type': 'application/json' }
                });
            })
        );
    } else {
        // Se for para carregar o HTML/CSS/Imagens, usa o cache primeiro para ser instantâneo
        evento.respondWith(
            caches.match(evento.request)
                .then((resposta) => {
                    return resposta || fetch(evento.request);
                })
        );
    }
});