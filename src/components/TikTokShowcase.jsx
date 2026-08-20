import React from 'react';
import { ExternalLink, Play } from 'lucide-react';

const TIKTOK_PROFILE = 'https://www.tiktok.com/@husseinsellaboudy';

const videos = [
  { image: 'hero_banner.jpg', label: 'Golden Car transformations' },
  { image: 'brakes.jpg', label: 'Performance upgrades' },
  { image: 'intercooler.jpg', label: 'Premium car tech' },
  { image: 'springs.jpg', label: 'Ride and comfort' },
  { image: 'exhaust.jpg', label: 'Exterior styling' },
  { image: 'hussien-sayed.jpg', label: 'Behind the workshop' },
];

function TikTokCard({ video }) {
  return (
    <a
      className="tiktok-video-card"
      href={TIKTOK_PROFILE}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Watch ${video.label} on TikTok`}
    >
      <img src={`/img/${video.image}`} alt="" loading="lazy" />
      <span className="tiktok-video-shade" />
      <span className="tiktok-play"><Play size={18} fill="currentColor" /></span>
      <span className="tiktok-video-copy">
        <span className="tiktok-video-kicker">TikTok / @husseinsellaboudy</span>
        <strong>{video.label}</strong>
      </span>
      <ExternalLink className="tiktok-video-link" size={16} />
    </a>
  );
}

export default function TikTokShowcase({ isAr }) {
  const loopedVideos = [...videos, ...videos];

  return (
    <section className="tiktok-showcase" aria-label="TikTok videos">
      <div className="tiktok-showcase-header">
        <div>
          <div className="eyebrow">{isAr ? 'من الورشة إلى تيك توك' : 'FROM THE WORKSHOP TO TIKTOK'}</div>
          <h2>{isAr ? 'شوف شغلنا على تيك توك' : 'See what is happening on TikTok'}</h2>
        </div>
        <a className="tiktok-follow-link" href={TIKTOK_PROFILE} target="_blank" rel="noopener noreferrer">
          {isAr ? 'تابع الحساب' : 'Follow the account'} <ExternalLink size={15} />
        </a>
      </div>
      <div className="tiktok-marquee" dir="ltr">
        <div className="tiktok-marquee-track">
          {loopedVideos.map((video, index) => (
            <TikTokCard key={`${video.image}-${index}`} video={video} />
          ))}
        </div>
      </div>
    </section>
  );
}