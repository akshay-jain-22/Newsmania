/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'newsapi.org',
      'static.foxnews.com',
      'media.cnn.com',
      'www.washingtonpost.com',
      'nypost.com',
      'www.nytimes.com',
      'www.reuters.com',
      'www.bbc.co.uk',
      'ichef.bbci.co.uk',
      'cdn.cnn.com',
      'a57.foxnews.com',
      'media.npr.org',
      'assets.bwbx.io',
      'i.kinja-img.com',
      'assets1.cbsnewsstatic.com',
      'assets2.cbsnewsstatic.com',
      'assets3.cbsnewsstatic.com',
      'media.wired.com',
      'techcrunch.com',
      'images.wsj.net',
      'img.huffingtonpost.com',
      'static01.nyt.com',
      'static.independent.co.uk',
      'i.guim.co.uk',
      'www.aljazeera.com',
      'www.ft.com',
      'www.theguardian.com',
      'cdn.vox-cdn.com',
      'media.newyorker.com',
      'img.etimg.com',
      'www.hindustantimes.com',
      'www.thehindu.com',
      'images.indianexpress.com',
      'www.livemint.com',
      'www.ndtv.com',
      'www.abc.net.au',
      'www.sbs.com.au',
      'www.smh.com.au',
      'www.theage.com.au',
      'www.news.com.au',
      'www.theaustralian.com.au',
      'www.dailytelegraph.com.au',
      'www.heraldsun.com.au',
      'www.couriermail.com.au',
      'www.adelaidenow.com.au',
      'www.perthnow.com.au',
      'www.themercury.com.au',
      'www.ntnews.com.au',
      'images.unsplash.com'
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // Update experimental config for Next.js 15
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000', 'newsmania.vercel.app']
    }
  }
}

export default nextConfig

