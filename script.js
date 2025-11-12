// Wait for the window to load before running the script
window.onload = () => {
  const canvas = document.getElementById("particle-canvas")
  if (!canvas) {
    console.error("Canvas element not found!")
    return
  }
  const ctx = canvas.getContext("2d")
  if (!ctx) {
    console.error("Could not get canvas context!")
    return
  }

  canvas.width = window.innerWidth
  canvas.height = window.innerHeight

  // --- Animation Settings ---
  const particleCount = 100
  const particleColor = "rgba(0, 255, 136, 0.6)"
  const lineColor = "rgba(168, 85, 247, 0.3)"
  const maxDistance = 180
  const mouseRadius = 250
  const mouse = { x: null, y: null }

  let particles = []

  // Particle class
  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width
      this.y = Math.random() * canvas.height
      this.size = Math.random() * 2.5 + 0.5
      this.speedX = Math.random() * 1.5 - 0.75
      this.speedY = Math.random() * 1.5 - 0.75
    }

    update() {
      this.x += this.speedX
      this.y += this.speedY

      if (this.x > canvas.width || this.x < 0) this.speedX *= -1
      if (this.y > canvas.height || this.y < 0) this.speedY *= -1
    }

    draw() {
      ctx.fillStyle = particleColor
      ctx.beginPath()
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
      ctx.fill()
    }
  }

  // Create all particles
  function init() {
    particles = []
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle())
    }
  }

  // Connect particles with lines
  function connect() {
    for (let a = 0; a < particles.length; a++) {
      for (let b = a; b < particles.length; b++) {
        const distance = Math.sqrt((particles[a].x - particles[b].x) ** 2 + (particles[a].y - particles[b].y) ** 2)

        if (distance < maxDistance) {
          ctx.strokeStyle = lineColor
          ctx.lineWidth = 0.8
          ctx.beginPath()
          ctx.moveTo(particles[a].x, particles[a].y)
          ctx.lineTo(particles[b].x, particles[b].y)
          ctx.stroke()
        }
      }
    }
  }

  // Animation loop
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    for (let i = 0; i < particles.length; i++) {
      particles[i].update()
      particles[i].draw()
      if (mouse.x && mouse.y) {
        const dx = mouse.x - particles[i].x
        const dy = mouse.y - particles[i].y
        const distance = Math.sqrt(dx * dx + dy * dy)
        if (distance < mouseRadius) {
          particles[i].x += dx * 0.01
          particles[i].y += dy * 0.01
        }
      }
    }
    connect()
    requestAnimationFrame(animate)
  }

  // Track mouse position
  canvas.addEventListener("mousemove", (e) => {
    mouse.x = e.x
    mouse.y = e.y
  })

  canvas.addEventListener("mouseout", () => {
    mouse.x = null
    mouse.y = null
  })

  // Handle window resizing
  window.addEventListener("resize", () => {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    init()
  })

  const themeToggle = document.getElementById("themeToggle")
  const html = document.documentElement

  const savedTheme = localStorage.getItem("theme") || "light"
  if (savedTheme === "light") {
    html.classList.remove("light-mode")
    themeToggle.textContent = "🌙"
  } else {
    html.classList.add("light-mode")
    themeToggle.textContent = "☀️"
  }

  themeToggle.addEventListener("click", () => {
    const isLightMode = html.classList.toggle("light-mode")
    localStorage.setItem("theme", isLightMode ? "light" : "dark")
    themeToggle.textContent = isLightMode ? "☀️" : "🌙"
  })

  // Form Handler
  document.getElementById("contactForm").addEventListener("submit", async function (e) {
    e.preventDefault()
    try {
      const response = await fetch(this.action, {
        method: "POST",
        body: new FormData(this),
        headers: { Accept: "application/json" },
      })
      if (response.ok) {
        alert("Thank you! Your message has been sent successfully.")
        this.reset()
      } else {
        throw new Error("Form submission failed")
      }
    } catch (error) {
      alert("Sorry, there was a problem sending your message. Please try again.")
    }
  })

  init()
  animate()
}
