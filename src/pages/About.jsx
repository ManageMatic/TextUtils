import React from 'react';

export default function About(props) {
  return (
    <div className="d-flex flex-column gap-4 my-2">
      {/* Intro Glass Card */}
      <div className="glass-card text-center py-5">
        <h1 className="display-5 fw-extrabold mb-3" style={{ background: 'linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          About TextUtils
        </h1>
        <p className="fs-5 mx-auto text-secondary" style={{ maxWidth: '700px' }}>
          An state-of-the-art, feature-dense text workspace designed for authors, editors, developers, and students. Experience live formatting, speech telemetry, and reading graders.
        </p>
      </div>

      {/* Feature Grid */}
      <div className="row g-4">
        {/* Core pillar 1 */}
        <div className="col-md-4">
          <div className="glass-card h-100 d-flex flex-column gap-2">
            <div className="d-flex align-items-center gap-3">
              <span className="p-3 rounded-4" style={{ backgroundColor: 'var(--accent-light)', color: 'var(--accent-primary)' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-gear-fill" viewBox="0 0 16 16">
                  <path d="M9.405 1.05c-.413-1.4-2.397-1.4-2.81 0l-.1.34a1.464 1.464 0 0 1-2.105.872l-.31-.17c-1.283-.698-2.686.705-1.987 1.987l.17.311c.586 1.06.072 2.307-.872 2.105l-.34-.1c-1.4-.413-1.4 1.574 0 1.986l.34.1a1.464 1.464 0 0 1 .872 2.105l-.17.31c-.699 1.283.705 2.686 1.987 1.987l.311-.17a1.464 1.464 0 0 1 2.105.872l.1.34c.413 1.4 2.397 1.4 2.81 0l.1-.34a1.464 1.464 0 0 1 2.105-.872l.31.17c1.283.699 2.686-.705 1.987-1.987l-.17-.311a1.464 1.464 0 0 1 .872-2.105l.34.1c1.4.413 1.4-1.574 0-1.986l-.34-.1a1.464 1.464 0 0 1-.872-2.105l.17-.31c.699-1.283-.705-2.686-1.987-1.987l-.311.17a1.464 1.464 0 0 1-2.105-.872zM8 10.93a2.929 2.929 0 1 1 0-5.86 2.929 2.929 0 0 1 0 5.858z"/>
                </svg>
              </span>
              <h3 className="h5 mb-0" style={{ color: 'var(--text-primary)' }}>Text Manipulation</h3>
            </div>
            <p className="text-secondary mt-2 mb-0" style={{ fontSize: '0.95rem' }}>
              Perform real-time actions including case conversion (Title Case, Sentence case, slugs), space trimming, URL coding, and raw Base64 data encoding/decoding.
            </p>
          </div>
        </div>

        {/* Core pillar 2 */}
        <div className="col-md-4">
          <div className="glass-card h-100 d-flex flex-column gap-2">
            <div className="d-flex align-items-center gap-3">
              <span className="p-3 rounded-4" style={{ backgroundColor: 'var(--accent-light)', color: 'var(--accent-primary)' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-graph-up-arrow" viewBox="0 0 16 16">
                  <path fillRule="evenodd" d="M0 0h1v15h15v1H0zm10 3.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-1 0V4.9l-3.61 3.61a.5.5 0 0 1-.707 0L8.005 7.32l-3 3a.5.5 0 0 1-.707-.707l3.354-3.354a.5.5 0 0 1 .707 0l1.17 1.17L13.1 4H10.5a.5.5 0 0 1-.5-.5"/>
                </svg>
              </span>
              <h3 className="h5 mb-0" style={{ color: 'var(--text-primary)' }}>Readability Analytics</h3>
            </div>
            <p className="text-secondary mt-2 mb-0" style={{ fontSize: '0.95rem' }}>
              Get automated, mathematical diagnostics on reading difficulty using Flesch scoring indices alongside estimated speaking velocities and keyword frequency charts.
            </p>
          </div>
        </div>

        {/* Core pillar 3 */}
        <div className="col-md-4">
          <div className="glass-card h-100 d-flex flex-column gap-2">
            <div className="d-flex align-items-center gap-3">
              <span className="p-3 rounded-4" style={{ backgroundColor: 'var(--accent-light)', color: 'var(--accent-primary)' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-mic-fill" viewBox="0 0 16 16">
                  <path d="M5 3a3 3 0 0 1 6 0v5a3 3 0 0 1-6 0z"/>
                  <path d="M3.5 6.5A.5.5 0 0 1 4 7v1a4 4 0 0 0 8 0V7a.5.5 0 0 1 1 0v1a5 5 0 0 1-4.5 4.975V15h3a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1h3v-2.025A5 5 0 0 1 3 8V7a.5.5 0 0 1 .5-.5"/>
                </svg>
              </span>
              <h3 className="h5 mb-0" style={{ color: 'var(--text-primary)' }}>Speech Integration</h3>
            </div>
            <p className="text-secondary mt-2 mb-0" style={{ fontSize: '0.95rem' }}>
              Dictate content using state-of-the-art Web Speech Recognition APIs or read typed texts back using configured synthesis controls (rate, pitch, and voice filters).
            </p>
          </div>
        </div>
      </div>

      {/* Philosophy Glass Card */}
      <div className="glass-card">
        <h2 className="h4 mb-3">Our Core Philosophy</h2>
        <p className="mb-0">
          We believe in constructing blazing-fast, serverless interfaces that respect user privacy. All text data processed in <strong>TextUtils</strong> remains entirely within your local browser sandbox. No characters, paragraphs, or credentials are ever transmitted over external networks. This makes TextUtils highly private, fast, and completely secure.
        </p>
      </div>
    </div>
  );
}