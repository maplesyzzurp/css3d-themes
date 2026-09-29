"use client"

import { useState, useEffect, useRef } from "react"

const THEMES = [
  { id: "neon", label: "Neon Cyberpunk", desc: "Dark void, glowing cyan & magenta nodes" },
  { id: "glass", label: "Glassmorphism", desc: "Frosted panels, pastel gradients" },
  { id: "terminal", label: "Terminal", desc: "Green monospace, CRT flicker" },
  { id: "aurora", label: "Aurora", desc: "Shifting green & purple sky" },
  { id: "synthwave", label: "Synthwave", desc: "Purple-orange sunset, grid floor" },
  { id: "minimal", label: "Minimal Dark", desc: "Charcoal, thin elegant lines" },
  { id: "cosmic", label: "Cosmic", desc: "Starfield, nodes as planets" },
  { id: "blueprint", label: "Blueprint", desc: "Off-white, navy ink lines" },
]

const NODES = [
  { id: "a", label: "Chat 1", x: 0, y: 0, z: 0 },
  { id: "b", label: "Chat 2", x: 180, y: -60, z: 40 },
  { id: "c", label: "Chat 3", x: -140, y: 90, z: -30 },
  { id: "d", label: "Chat 4", x: 60, y: 140, z: 70 },
  { id: "e", label: "Chat 5", x: -200, y: -120, z: 20 },
  { id: "f", label: "Chat 6", x: 120, y: -160, z: -50 },
]

const EDGES = [["a", "b"], ["a", "c"], ["b", "d"], ["c", "d"], ["a", "e"], ["c", "e"], ["d", "f"], ["b", "f"]]

function project(node, rotX, rotY) {
  const radX = (rotX * Math.PI) / 180
  const radY = (rotY * Math.PI) / 180
  const y1 = node.y * Math.cos(radX) - node.z * Math.sin(radX)
  const z1 = node.y * Math.sin(radX) + node.z * Math.cos(radX)
  const x2 = node.x * Math.cos(radY) + z1 * Math.sin(radY)
  const z2 = -node.x * Math.sin(radY) + z1 * Math.cos(radY)
  const scale = 600 / (600 + z2)
  return { x: x2 * scale, y: y1 * scale, z: z2, scale }
}

export default function Home() {
  const [theme, setTheme] = useState("neon")
  const [rotX, setRotX] = useState(20)
  const [rotY, setRotY] = useState(30)
  const dragging = useRef(false)
  const last = useRef({ x: 0, y: 0 })

  useEffect(() => {
    let frame
    const tick = () => {
      if (!dragging.current) setRotY((y) => (y + 0.25) % 360)
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [])

  const onDown = (e) => {
    dragging.current = true
    last.current = { x: e.clientX, y: e.clientY }
  }
  const onMove = (e) => {
    if (!dragging.current) return
    const dx = e.clientX - last.current.x
    const dy = e.clientY - last.current.y
    last.current = { x: e.clientX, y: e.clientY }
    setRotY((y) => y + dx * 0.4)
    setRotX((x) => Math.max(-80, Math.min(80, x - dy * 0.4)))
  }
  const onUp = () => {
    dragging.current = false
  }

  const projected = NODES.map((n) => ({ ...n, ...project(n, rotX, rotY) }))
  const pos = Object.fromEntries(projected.map((n) => [n.id, n]))

  return (
    <div className="stage" data-theme={theme} onMouseDown={onDown} onMouseMove={onMove} onMouseUp={onUp} onMouseLeave={onUp} onTouchStart={(e) => onDown(e.touches[0])} onTouchMove={(e) => onMove(e.touches[0])} onTouchEnd={onUp}>
      <div className="grid-floor" />
      <div className="stars" />
      <svg className="edges" viewBox="-400 -300 800 600" preserveAspectRatio="xMidYMid meet">
        {EDGES.map(([u, v], i) => {
          const a = pos[u], b = pos[v]
          if (!a || !b) return null
          const depth = (a.z + b.z) / 2
          return (
            <line key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y} className="edge" style={{ opacity: Math.max(0.15, 1 - Math.abs(depth) / 500) }} />
          )
        })}
      </svg>
      {projected.map((n) => (
        <div key={n.id} className="node" style={{ transform: `translate3d(${n.x}px, ${n.y}px, ${n.z}px) scale(${n.scale})`, zIndex: Math.round(n.z) }}>
          <span className="node-dot" />
          <span className="node-label">{n.label}</span>
        </div>
      ))}
      <div className="hud">
        <h1>CSS 3D Themes</h1>
        <p className="sub">drag to rotate · auto-spins when idle</p>
        <div className="picker">
          {THEMES.map((t) => (
            <button key={t.id} className={theme === t.id ? "active" : ""} onClick={(e) => { e.stopPropagation(); setTheme(t.id) }} title={t.desc}>
              {t.label}
            </button>
          ))}
        </div>
        <p className="current">{THEMES.find((t) => t.id === theme).desc}</p>
      </div>
    </div>
  )
}
