'use client'

import { useEffect, useRef } from 'react'
import anime from 'animejs'

export default function AnimatedBackground() {
  const containerRef = useRef<HTMLDivElement>(null)
  const gradientRef = useRef<HTMLDivElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)
  const animationRefs = useRef<anime.AnimeInstance[]>([])

  useEffect(() => {
    if (!containerRef.current) return

    const container = containerRef.current
    const particles: HTMLElement[] = []
    const particleCount = 40

    const gradientMesh = document.createElement('div')
    gradientMesh.className = 'gradient-mesh'
    container.appendChild(gradientMesh)

    const gridPattern = document.createElement('div')
    gridPattern.className = 'grid-pattern'
    container.appendChild(gridPattern)

    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div')
      particle.className = 'animated-particle'
      const size = Math.random() * 200 + 100
      particle.style.width = `${size}px`
      particle.style.height = `${size}px`
      particle.style.left = `${Math.random() * 100}%`
      particle.style.top = `${Math.random() * 100}%`
      particle.style.opacity = `${Math.random() * 0.3 + 0.1}`
      
      const colors = [
        'rgba(59, 130, 246, 0.4)',
        'rgba(139, 92, 246, 0.4)',
        'rgba(16, 185, 129, 0.4)',
        'rgba(245, 158, 11, 0.4)',
        'rgba(236, 72, 153, 0.4)',
        'rgba(168, 85, 247, 0.4)',
        'rgba(34, 197, 94, 0.4)',
      ]
      const color = colors[Math.floor(Math.random() * colors.length)]
      particle.style.background = `radial-gradient(circle, ${color}, transparent 70%)`
      particle.style.borderRadius = '50%'
      particle.style.position = 'absolute'
      particle.style.pointerEvents = 'none'
      particle.style.filter = 'blur(60px)'
      particle.style.transform = 'translate(-50%, -50%)'
      particle.style.mixBlendMode = 'screen'
      
      container.appendChild(particle)
      particles.push(particle)
    }

    const smallParticles: HTMLElement[] = []
    for (let i = 0; i < 60; i++) {
      const particle = document.createElement('div')
      particle.className = 'small-particle'
      const size = Math.random() * 4 + 2
      particle.style.width = `${size}px`
      particle.style.height = `${size}px`
      particle.style.left = `${Math.random() * 100}%`
      particle.style.top = `${Math.random() * 100}%`
      particle.style.opacity = `${Math.random() * 0.6 + 0.2}`
      particle.style.background = '#ffffff'
      particle.style.borderRadius = '50%'
      particle.style.position = 'absolute'
      particle.style.pointerEvents = 'none'
      particle.style.boxShadow = '0 0 10px rgba(255, 255, 255, 0.5)'
      
      container.appendChild(particle)
      smallParticles.push(particle)
    }

    const animateParticle = (particle: HTMLElement, index: number) => {
      const startX = parseFloat(particle.style.left)
      const startY = parseFloat(particle.style.top)
      const endX = Math.random() * 100
      const endY = Math.random() * 100
      const duration = Math.random() * 15000 + 20000
      const scaleEnd = Math.random() * 0.5 + 0.8

      const anim = anime({
        targets: particle,
        left: [`${startX}%`, `${endX}%`],
        top: [`${startY}%`, `${endY}%`],
        scale: [1, scaleEnd, 1],
        opacity: [
          parseFloat(particle.style.opacity),
          Math.random() * 0.3 + 0.1,
          parseFloat(particle.style.opacity),
        ],
        duration: duration,
        easing: 'easeInOutSine',
        complete: () => {
          animateParticle(particle, index)
        },
        delay: index * 100,
      })

      animationRefs.current.push(anim)
    }

    const animateSmallParticle = (particle: HTMLElement, index: number) => {
      const startX = parseFloat(particle.style.left)
      const startY = parseFloat(particle.style.top)
      const endX = Math.random() * 100
      const endY = Math.random() * 100
      const duration = Math.random() * 8000 + 10000

      const anim = anime({
        targets: particle,
        left: [`${startX}%`, `${endX}%`],
        top: [`${startY}%`, `${endY}%`],
        opacity: [0.2, 0.8, 0.2],
        duration: duration,
        easing: 'easeInOutSine',
        complete: () => {
          animateSmallParticle(particle, index)
        },
        delay: index * 50,
      })

      animationRefs.current.push(anim)
    }

    particles.forEach((particle, index) => {
      animateParticle(particle, index)
    })

    smallParticles.forEach((particle, index) => {
      animateSmallParticle(particle, index)
    })

    const gradientAnim = anime({
      targets: gradientMesh,
      background: [
        'radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(139, 92, 246, 0.3) 0%, transparent 50%), radial-gradient(circle at 40% 20%, rgba(16, 185, 129, 0.2) 0%, transparent 50%)',
        'radial-gradient(circle at 80% 20%, rgba(139, 92, 246, 0.3) 0%, transparent 50%), radial-gradient(circle at 20% 80%, rgba(59, 130, 246, 0.3) 0%, transparent 50%), radial-gradient(circle at 60% 60%, rgba(236, 72, 153, 0.2) 0%, transparent 50%)',
        'radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(139, 92, 246, 0.3) 0%, transparent 50%), radial-gradient(circle at 40% 20%, rgba(16, 185, 129, 0.2) 0%, transparent 50%)',
      ],
      duration: 20000,
      easing: 'easeInOutSine',
      loop: true,
    })

    animationRefs.current.push(gradientAnim)

    return () => {
      animationRefs.current.forEach((anim) => {
        if (anim) anim.pause()
      })
      particles.forEach((particle) => {
        if (particle.parentNode) {
          particle.parentNode.removeChild(particle)
        }
      })
      smallParticles.forEach((particle) => {
        if (particle.parentNode) {
          particle.parentNode.removeChild(particle)
        }
      })
      if (gradientMesh.parentNode) {
        gradientMesh.parentNode.removeChild(gradientMesh)
      }
      if (gridPattern.parentNode) {
        gridPattern.parentNode.removeChild(gridPattern)
      }
      animationRefs.current = []
    }
  }, [])

  return <div ref={containerRef} className="animated-background" />
}

