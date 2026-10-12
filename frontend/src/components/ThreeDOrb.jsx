import { useEffect, useRef } from 'react'

export default function ThreeDOrb({ className = '' }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId
    let width = (canvas.width = canvas.offsetWidth * window.devicePixelRatio)
    let height = (canvas.height = canvas.offsetHeight * window.devicePixelRatio)

    // Handle resize
    const handleResize = () => {
      if (!canvas) return
      width = canvas.width = canvas.offsetWidth * window.devicePixelRatio
      height = canvas.height = canvas.offsetHeight * window.devicePixelRatio
    }
    window.addEventListener('resize', handleResize)

    // Mouse tracking with inertia
    let mouseX = 0
    let mouseY = 0
    let targetRotX = 0.3
    let targetRotY = 0.4
    let rotX = 0.3
    let rotY = 0.4

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect()
      const x = (e.clientX - rect.left) / rect.width - 0.5
      const y = (e.clientY - rect.top) / rect.height - 0.5
      targetRotY = x * 1.2
      targetRotX = -y * 1.2
    }
    window.addEventListener('mousemove', handleMouseMove)

    // Particle nodes on 3D sphere
    const nodeCount = 72
    const nodes = []
    const radius = Math.min(width, height) * 0.35

    for (let i = 0; i < nodeCount; i++) {
      const phi = Math.acos(-1 + (2 * i) / nodeCount)
      const theta = Math.sqrt(nodeCount * Math.PI) * phi
      nodes.push({
        x: radius * Math.cos(theta) * Math.sin(phi),
        y: radius * Math.sin(theta) * Math.sin(phi),
        z: radius * Math.cos(phi),
        baseX: radius * Math.cos(theta) * Math.sin(phi),
        baseY: radius * Math.sin(theta) * Math.sin(phi),
        baseZ: radius * Math.cos(phi),
        size: 1.5 + Math.random() * 2.2,
        isSpark: i % 4 === 0,
      })
    }

    // Outer orbital rings - expanded to sweep across maximum area
    const ringSegments = 64
    const rings = [
      { radius: radius * 1.18, tiltX: 0.6, tiltZ: 0.4, speed: 0.005, color: 'rgba(40, 116, 240, ' }, // #2874F0 Primary Blue
      { radius: radius * 1.36, tiltX: -0.5, tiltZ: -0.6, speed: -0.0035, color: 'rgba(255, 63, 108, ' }, // #FF3F6C Secondary Pink
      { radius: radius * 0.95, tiltX: 1.1, tiltZ: 0.2, speed: 0.007, color: 'rgba(255, 153, 0, ' }, // #FF9900 Warm Action Accent
    ]

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let time = 0

    // Animation Loop
    const render = () => {
      time += prefersReducedMotion ? 0.002 : 0.015
      rotX += (targetRotX - rotX) * 0.05
      rotY += (targetRotY + time * (prefersReducedMotion ? 0.02 : 0.15) - rotY) * 0.05

      ctx.clearRect(0, 0, width, height)

      const centerX = width / 2
      const centerY = height / 2

      // Draw subtle ambient glow behind the sphere using clean e-commerce accents
      const gradient = ctx.createRadialGradient(centerX, centerY, 10, centerX, centerY, radius * 1.35)
      gradient.addColorStop(0, 'rgba(40, 116, 240, 0.08)')
      gradient.addColorStop(0.5, 'rgba(255, 63, 108, 0.04)')
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0)')
      ctx.fillStyle = gradient
      ctx.beginPath()
      ctx.arc(centerX, centerY, radius * 1.35, 0, Math.PI * 2)
      ctx.fill()

      // Matrix rotation math
      const cosY = Math.cos(rotY)
      const sinY = Math.sin(rotY)
      const cosX = Math.cos(rotX)
      const sinX = Math.sin(rotX)

      // Project and sort nodes by Z depth
      const projectedNodes = nodes.map((node) => {
        // Rotate around Y
        const x1 = node.baseX * cosY - node.baseZ * sinY
        const z1 = node.baseZ * cosY + node.baseX * sinY

        // Rotate around X
        const y2 = node.baseY * cosX - z1 * sinX
        const z2 = z1 * cosX + node.baseY * sinX

        // Perspective scale
        const fov = radius * 2.8
        const scale = fov / (fov + z2)
        const projX = centerX + x1 * scale
        const projY = centerY + y2 * scale

        return {
          x: projX,
          y: projY,
          z: z2,
          scale,
          isSpark: node.isSpark,
          size: node.size * scale,
        }
      })

      // Sort by Z for proper depth rendering
      projectedNodes.sort((a, b) => a.z - b.z)

      // Draw connecting lines between nearby nodes
      ctx.lineWidth = 0.75 * window.devicePixelRatio
      for (let i = 0; i < projectedNodes.length; i++) {
        for (let j = i + 1; j < projectedNodes.length; j++) {
          const dx = projectedNodes[i].x - projectedNodes[j].x
          const dy = projectedNodes[i].y - projectedNodes[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          const maxDist = 80 * window.devicePixelRatio

          if (dist < maxDist) {
            const alpha = (1 - dist / maxDist) * 0.22 * Math.max(0, (projectedNodes[i].z + radius) / (radius * 2))
            ctx.strokeStyle = projectedNodes[i].isSpark
              ? `rgba(40, 116, 240, ${alpha * 1.5})`
              : `rgba(156, 163, 175, ${alpha * 0.9})`
            ctx.beginPath()
            ctx.moveTo(projectedNodes[i].x, projectedNodes[i].y)
            ctx.lineTo(projectedNodes[j].x, projectedNodes[j].y)
            ctx.stroke()
          }
        }
      }

      // Draw orbital rings
      rings.forEach((ring) => {
        ctx.beginPath()
        const ringTime = time * ring.speed * 40
        for (let s = 0; s <= ringSegments; s++) {
          const theta = (s / ringSegments) * Math.PI * 2 + ringTime
          const rx = ring.radius * Math.cos(theta)
          const rz = ring.radius * Math.sin(theta)
          const ry = 0

          // Apply ring tilt
          const y1 = ry * Math.cos(ring.tiltX) - rz * Math.sin(ring.tiltX)
          const z1 = rz * Math.cos(ring.tiltX) + ry * Math.sin(ring.tiltX)

          const x2 = rx * Math.cos(ring.tiltZ) - y1 * Math.sin(ring.tiltZ)
          const y2 = y1 * Math.cos(ring.tiltZ) + rx * Math.sin(ring.tiltZ)

          // Rotate with scene
          const x3 = x2 * cosY - z1 * sinY
          const z3 = z1 * cosY + x2 * sinY

          const y4 = y2 * cosX - z3 * sinX
          const z4 = z3 * cosX + y2 * sinX

          const fov = radius * 2.8
          const scale = fov / (fov + z4)
          const px = centerX + x3 * scale
          const py = centerY + y4 * scale

          if (s === 0) ctx.moveTo(px, py)
          else ctx.lineTo(px, py)
        }
        ctx.strokeStyle = `${ring.color}0.22)`
        ctx.lineWidth = 1 * window.devicePixelRatio
        ctx.stroke()
      })

      // Draw nodes
      projectedNodes.forEach((node) => {
        const depthAlpha = Math.max(0.15, (node.z + radius) / (radius * 2))
        ctx.beginPath()
        ctx.arc(node.x, node.y, Math.max(1, node.size), 0, Math.PI * 2)

        if (node.isSpark) {
          ctx.fillStyle = `rgba(40, 116, 240, ${depthAlpha * 0.95})`
          ctx.shadowColor = 'rgba(40, 116, 240, 0.4)'
          ctx.shadowBlur = 8 * window.devicePixelRatio
        } else {
          ctx.fillStyle = `rgba(255, 63, 108, ${depthAlpha * 0.85})`
          ctx.shadowColor = 'rgba(255, 63, 108, 0.3)'
          ctx.shadowBlur = 4 * window.devicePixelRatio
        }
        ctx.fill()
        ctx.shadowBlur = 0
      })

      animationFrameId = requestAnimationFrame(render)
    }

    render()

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className={`w-full h-full pointer-events-none ${className}`}
      style={{ touchAction: 'none' }}
    />
  )
}
