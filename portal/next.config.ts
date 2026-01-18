import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 's2-ge.glbimg.com' },
      { protocol: 'https', hostname: 'thumbor.globoi.com' },
      { protocol: 'https', hostname: 'fogaonet.com' },
      { protocol: 'https', hostname: 'www.fogaonet.com' },
      { protocol: 'https', hostname: 'i.fogaonet.com' },
      { protocol: 'https', hostname: 'via.placeholder.com' },
      { protocol: 'https', hostname: 'placehold.co' },
      { protocol: 'https', hostname: 'admin.cnnbrasil.com.br' },
      { protocol: 'https', hostname: 'www.botafogo.com.br' },
      { protocol: 'https', hostname: 'p2.trrsf.com' }, // Terra images
      { protocol: 'https', hostname: 'bolavip.com' },
      { protocol: 'https', hostname: '*.lance.com.br' },
      { protocol: 'https', hostname: 'odia.ig.com.br' },
      { protocol: 'https', hostname: '*.ig.com.br' }, // Wildcard for IG if needed
      { protocol: 'https', hostname: '*.bp.blogspot.com' }, // Gazeta uses Blogger
      { protocol: 'https', hostname: 'blogger.googleusercontent.com' },
      { protocol: 'https', hostname: 'i.ytimg.com' },
      { protocol: 'https', hostname: 'upload.wikimedia.org' },
      { protocol: 'https', hostname: 'fogonarede.com.br' },
      { protocol: 'https', hostname: 'www.fogonarede.com.br' },
      { protocol: 'https', hostname: 'a.espncdn.com' },
      { protocol: 'https', hostname: 'secure.espncdn.com' },
      { protocol: 'https', hostname: 'img.a.transfermarkt.technology' },
      { protocol: 'https', hostname: 's.sde.globo.com' },
    ],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin-allow-popups',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
