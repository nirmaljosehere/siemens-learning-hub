import React, { useState } from 'react';

const VIDEO_URL =
  'https://delivery-p139665-e1420034.adobeaemcloud.com/adobe/assets/urn:aaid:aem:aaa2b30f-8a5d-442c-8e92-3841ee1fdd4d/play';

function FeaturedVideo() {
  const [playing, setPlaying] = useState(false);

  return (
    <section className="featured-video">
      <div className="fv-text">
        <span className="fv-eyebrow">Video</span>
        <h2 className="fv-title">See it in action</h2>
        <p className="fv-desc">
          Watch a hands-on walkthrough of the Siemens Xcelerator Academy and
          explore how our courses accelerate your automation skills.
        </p>
        {playing && (
          <button className="fv-reset" onClick={() => setPlaying(false)}>
            ✕ Close player
          </button>
        )}
      </div>
      <div className="fv-player-wrap">
        {playing ? (
          <iframe
            className="fv-player"
            src={VIDEO_URL}
            title="Featured Video"
            allow="autoplay; fullscreen"
            allowFullScreen
            frameBorder="0"
          />
        ) : (
          <button
            className="fv-poster"
            aria-label="Play featured video"
            onClick={() => setPlaying(true)}
          >
            <div className="fv-play-btn" aria-hidden="true">
              <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="32" cy="32" r="32" fill="rgba(0,0,0,0.45)"/>
                <path d="M26 20l22 12-22 12V20z" fill="#fff"/>
              </svg>
            </div>
          </button>
        )}
      </div>
    </section>
  );
}

export default FeaturedVideo;
