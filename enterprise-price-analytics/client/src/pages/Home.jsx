import React, { useState, useEffect } from 'react'
import { healthCheck } from '../services/api.js'

/* ── Status Indicator ─────────────────────────────────────── */
function StatusDot({ status }) {
  const colors = {
    connected: '#10b981',
    disconnected: '#ef4444',
    checking: '#f59e0b',
  }
  return (
    <span
      style={{
        position: 'relative',
        display: 'inline-block',
        width: 10,
        height: 10,
      }}
    >
      {status === 'connected' && (
        <span
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            background: colors.connected,
            animation: 'pulse-ring 1.5s ease-out infinite',
          }}
        />
      )}
      <span
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '50%',
          background: colors[status] || colors.checking,
        }}
      />
    </span>
  )
}

/* ── API Endpoint Row ─────────────────────────────────────── */
function EndpointRow({ method, path, description }) {
  const methodColors = {
    GET: '#10b981',
    POST: '#6366f1',
    PUT: '#f59e0b',
    DELETE: '#ef4444',
  }
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        padding: '0.6rem 0',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
      }}
    >
      <span
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.7rem',
          fontWeight: 700,
          color: methodColors[method],
          background: `${methodColors[method]}18`,
          border: `1px solid ${methodColors[method]}40`,
          borderRadius: 4,
          padding: '2px 7px',
          minWidth: 48,
          textAlign: 'center',
          letterSpacing: '0.04em',
        }}
      >
        {method}
      </span>
      <code
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.78rem',
          color: '#a5b4fc',
          minWidth: 220,
        }}
      >
        {path}
      </code>
      <span style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)' }}>
        {description}
      </span>
    </div>
  )
}

/* ── Home Page ────────────────────────────────────────────── */
function Home() {
  const [connectionStatus, setConnectionStatus] = useState('checking')
  const [apiMessage, setApiMessage] = useState('')
  const [responseTime, setResponseTime] = useState(null)
  const [checking, setChecking] = useState(true)

  const checkBackend = async () => {
    setChecking(true)
    setConnectionStatus('checking')
    const start = performance.now()
    try {
      const res = await healthCheck()
      const elapsed = Math.round(performance.now() - start)
      setConnectionStatus('connected')
      setApiMessage(res.data.message)
      setResponseTime(elapsed)
    } catch {
      setConnectionStatus('disconnected')
      setApiMessage('Cannot reach the backend server.')
      setResponseTime(null)
    } finally {
      setChecking(false)
    }
  }

  useEffect(() => {
    checkBackend()
    const interval = setInterval(checkBackend, 30000)
    return () => clearInterval(interval)
  }, [])

  const apiEndpoints = [
    { method: 'GET',    path: '/api/health',         description: 'Health check' },
    { method: 'GET',    path: '/api/products',        description: 'List products (search, filter, paginate)' },
    { method: 'GET',    path: '/api/products/:id',    description: 'Get product by ID' },
    { method: 'POST',   path: '/api/products',        description: 'Create new product' },
    { method: 'PUT',    path: '/api/products/:id',    description: 'Update product' },
    { method: 'DELETE', path: '/api/products/:id',    description: 'Delete product' },
    { method: 'GET',    path: '/api/jobs',            description: 'List scraping jobs' },
    { method: 'GET',    path: '/api/jobs/:id',        description: 'Get job by ID' },
    { method: 'POST',   path: '/api/jobs',            description: 'Create scraping job' },
    { method: 'PUT',    path: '/api/jobs/:id',        description: 'Update job status' },
    { method: 'GET',    path: '/api/sources',         description: 'List data sources' },
    { method: 'GET',    path: '/api/sources/:id',     description: 'Get source by ID' },
    { method: 'POST',   path: '/api/sources',         description: 'Add new source' },
    { method: 'PUT',    path: '/api/sources/:id',     description: 'Update source' },
  ]

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--color-bg-primary)',
        backgroundImage: 'var(--gradient-hero)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '3rem 1.5rem',
        fontFamily: 'var(--font-sans)',
      }}
    >
      {/* ── Header ─────────────────────────────────────────── */}
      <div style={{ textAlign: 'center', marginBottom: '3rem', animation: 'fade-in-up 0.6s ease' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'rgba(99,102,241,0.1)',
            border: '1px solid rgba(99,102,241,0.25)',
            borderRadius: 'var(--radius-full)',
            padding: '6px 16px',
            marginBottom: '1.5rem',
          }}
        >
          <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#a5b4fc', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Phase 1 — Foundation
          </span>
        </div>

        <h1
          style={{
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            fontWeight: 800,
            letterSpacing: '-0.03em',
            lineHeight: 1.1,
            marginBottom: '1rem',
            background: 'linear-gradient(135deg, #f1f5f9 0%, #a5b4fc 50%, #8b5cf6 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Enterprise Price Analytics Engine
        </h1>

        <p
          style={{
            color: 'var(--color-text-secondary)',
            maxWidth: 520,
            margin: '0 auto',
            fontSize: '1.05rem',
            lineHeight: 1.7,
          }}
        >
          High-throughput web scraper &amp; real-time price analytics platform.
          Backend foundation ready for scraper &amp; ML integration.
        </p>
      </div>

      {/* ── Connection Status Card ──────────────────────────── */}
      <div
        className="card"
        style={{
          width: '100%',
          maxWidth: 560,
          marginBottom: '2rem',
          animation: 'fade-in-up 0.6s ease 0.1s both',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>
            Backend Connection Status
          </h2>
          <button
            onClick={checkBackend}
            disabled={checking}
            style={{
              background: 'rgba(99,102,241,0.1)',
              border: '1px solid rgba(99,102,241,0.3)',
              borderRadius: 'var(--radius-sm)',
              color: '#a5b4fc',
              padding: '4px 12px',
              fontSize: '0.75rem',
              fontWeight: 600,
              cursor: checking ? 'not-allowed' : 'pointer',
              fontFamily: 'var(--font-sans)',
              transition: 'var(--transition-fast)',
            }}
          >
            {checking ? 'Checking…' : 'Refresh'}
          </button>
        </div>

        {/* Status Row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            padding: '1rem 1.25rem',
            background: connectionStatus === 'connected'
              ? 'rgba(16,185,129,0.06)'
              : connectionStatus === 'disconnected'
              ? 'rgba(239,68,68,0.06)'
              : 'rgba(245,158,11,0.06)',
            border: `1px solid ${connectionStatus === 'connected' ? 'rgba(16,185,129,0.2)' : connectionStatus === 'disconnected' ? 'rgba(239,68,68,0.2)' : 'rgba(245,158,11,0.2)'}`,
            borderRadius: 'var(--radius-md)',
            marginBottom: '1rem',
          }}
        >
          {checking ? (
            <div className="spinner" />
          ) : (
            <StatusDot status={connectionStatus} />
          )}

          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span
                style={{
                  fontWeight: 700,
                  fontSize: '1rem',
                  color: connectionStatus === 'connected'
                    ? '#10b981'
                    : connectionStatus === 'disconnected'
                    ? '#ef4444'
                    : '#f59e0b',
                }}
              >
                Backend: {checking ? 'Checking…' : connectionStatus === 'connected' ? 'Connected ✓' : 'Disconnected ✗'}
              </span>
              {responseTime && (
                <span
                  style={{
                    fontSize: '0.7rem',
                    color: 'var(--color-text-secondary)',
                    fontFamily: 'var(--font-mono)',
                  }}
                >
                  {responseTime}ms
                </span>
              )}
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginTop: 2 }}>
              {apiMessage || 'Attempting to reach http://localhost:5000/api/health'}
            </p>
          </div>
        </div>

        {/* Endpoint Info */}
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          {[
            { label: 'API Base', value: import.meta.env.VITE_API_URL || 'http://localhost:5000/api' },
            { label: 'Health', value: '/api/health' },
          ].map(({ label, value }) => (
            <div
              key={label}
              style={{
                flex: 1,
                minWidth: 200,
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid var(--color-border-subtle)',
                borderRadius: 'var(--radius-sm)',
                padding: '0.6rem 0.9rem',
              }}
            >
              <div style={{ fontSize: '0.65rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 3 }}>{label}</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: '#a5b4fc' }}>{value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── API Endpoints Card ─────────────────────────────── */}
      <div
        className="card"
        style={{
          width: '100%',
          maxWidth: 720,
          marginBottom: '2rem',
          animation: 'fade-in-up 0.6s ease 0.2s both',
        }}
      >
        <h2 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1.25rem', color: 'var(--color-text-primary)' }}>
          Available API Endpoints
        </h2>
        <div>
          {apiEndpoints.map(({ method, path, description }) => (
            <EndpointRow key={`${method}-${path}`} method={method} path={path} description={description} />
          ))}
        </div>
      </div>

      {/* ── Stack Info ─────────────────────────────────────── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: '1rem',
          width: '100%',
          maxWidth: 720,
          animation: 'fade-in-up 0.6s ease 0.3s both',
        }}
      >
        {[
          { icon: '⚛️', label: 'Frontend', tech: 'React + Vite' },
          { icon: '🟢', label: 'Backend',  tech: 'Node + Express' },
          { icon: '🐘', label: 'Database', tech: 'Supabase PostgreSQL' },
          { icon: '🔄', label: 'Client',   tech: 'Axios + Router' },
        ].map(({ icon, label, tech }) => (
          <div
            key={label}
            style={{
              background: 'var(--color-bg-card)',
              border: '1px solid var(--color-border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '1rem',
              textAlign: 'center',
              transition: 'var(--transition-normal)',
            }}
          >
            <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{icon}</div>
            <div style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>{label}</div>
            <div style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)', fontWeight: 500 }}>{tech}</div>
          </div>
        ))}
      </div>

      <p style={{ marginTop: '2.5rem', fontSize: '0.75rem', color: 'var(--color-text-muted)', textAlign: 'center' }}>
        Part 1 — Project Foundation &amp; Backend. Full dashboard in Part 2.
      </p>
    </div>
  )
}

export default Home
