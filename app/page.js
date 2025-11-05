"use client"
import { useEffect, useState } from "react"

// Estilos como objetos para melhor organização
const styles = {
  main: {
    backgroundColor: "#020617",
    color: "#e2e8f0",
    minHeight: "100vh",
    padding: "2rem",
  },
  header: {
    textAlign: "center",
    marginBottom: "3rem",
    fontSize: "2rem",
    fontWeight: "600",
    color: "#cbd5e1",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "1.5rem",
  },
  card: {
    background: "linear-gradient(145deg, #1e293b, #0f172a)",
    borderRadius: "16px",
    padding: "1.5rem",
    boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    transition: "transform 0.2s ease-in-out",
  },
  cardHeader: {
    fontSize: "0.875rem",
    color: "#94a3b8",
    marginBottom: "0.5rem",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  },
  cardValue: {
    fontSize: "2.25rem",
    fontWeight: "700",
    color: "#f8fafc",
    marginBottom: "1rem",
  },
}

export default function Home() {
  const [data, setData] = useState({ speed: 0, accel: 0, bpm: 0, stamina: 100 })
  const [history, setHistory] = useState({
    speed: [],
    accel: [],
    bpm: [],
    stamina: [],
  })

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch("/api/dados-jogadora")
        const json = await res.json()
        setData(json)
        setHistory((prev) => {
          const updated = { ...prev }
          Object.keys(json).forEach((k) => {
            updated[k] = [...(prev[k] || []), json[k]].slice(-30)
          })
          return updated
        })
      } catch (err) {
        console.error("Erro ao buscar dados:", err)
      }
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const drawGraph = (arr) => {
    if (arr.length < 2) return null
    const max = Math.max(...arr)
    const min = Math.min(...arr)
    const range = max - min || 1

    const points = arr
      .map((v, i) => {
        const x = (i / (arr.length - 1)) * 100
        const y = 100 - ((v - min) / range) * 100
        return `${x},${y}`
      })
      .join(" ")

    const areaPoints = `0,100 ${points} 100,100`

    return (
      <>
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop
              offset="0%"
              style={{ stopColor: "#38bdf8", stopOpacity: 0.4 }}
            />
            <stop
              offset="100%"
              style={{ stopColor: "#38bdf8", stopOpacity: 0 }}
            />
          </linearGradient>
        </defs>
        <polygon fill="url(#gradient)" points={areaPoints} />
        <polyline
          fill="none"
          stroke="#38bdf8"
          strokeWidth="2.5"
          points={points}
        />
      </>
    )
  }

  const handleMouseOver = (e) => {
    e.currentTarget.style.transform = "translateY(-5px)"
  }

  const handleMouseOut = (e) => {
    e.currentTarget.style.transform = "translateY(0)"
  }

  return (
    <main style={styles.main}>
      <h2 style={styles.header}>
        Dashboard da Jogadora — Análise em Tempo Real
      </h2>
      <div style={styles.grid}>
        {Object.entries(data).map(([key, value]) => (
          <div
            key={key}
            style={styles.card}
            onMouseOver={handleMouseOver}
            onMouseOut={handleMouseOut}
          >
            <div style={styles.cardHeader}>{key}</div>
            <div style={styles.cardValue}>{value.toFixed(2)}</div>
            <svg
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              width="100%"
              height="50"
            >
              {drawGraph(history[key] || [])}
            </svg>
          </div>
        ))}
      </div>
    </main>
  )
}
