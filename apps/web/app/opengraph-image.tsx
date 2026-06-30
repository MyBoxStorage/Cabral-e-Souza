import { ImageResponse } from 'next/og'
import { BUSINESS } from '@cabral-souza/shared'

export const alt = BUSINESS.name
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: 80,
          background: '#0a0a0a',
          color: '#fafaf7',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            fontSize: 28,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: '#8b7355',
            marginBottom: 24,
          }}
        >
          {BUSINESS.tagline}
        </div>
        <div
          style={{
            display: 'flex',
            fontSize: 72,
            fontFamily: 'Georgia, serif',
            fontWeight: 300,
            letterSpacing: '-0.02em',
            lineHeight: 1.05,
          }}
        >
          {BUSINESS.name}
        </div>
        <div
          style={{
            display: 'flex',
            fontSize: 24,
            color: 'rgba(250,250,247,0.55)',
            marginTop: 32,
          }}
        >
          {`Rio de Janeiro · Desde ${BUSINESS.foundedYear}`}
        </div>
      </div>
    ),
    { ...size },
  )
}
