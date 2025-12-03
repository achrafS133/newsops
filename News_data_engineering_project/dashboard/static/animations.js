// GSAP Animations for News Intelligence Platform
gsap.registerPlugin(ScrollTrigger);

// Page load animations
gsap.timeline()
  .from(".main-title", { duration: 1, y: -50, opacity: 0, ease: "power3.out" })
  .from(".metric-card", { duration: 0.8, y: 30, opacity: 0, stagger: 0.1, ease: "power2.out" }, "-=0.5")
  .from(".chart-container", { duration: 1, scale: 0.9, opacity: 0, stagger: 0.2, ease: "back.out(1.7)" }, "-=0.3");

// Hover animations for cards
gsap.utils.toArray(".metric-card").forEach(card => {
  card.addEventListener("mouseenter", () => {
    gsap.to(card, { duration: 0.3, scale: 1.05, y: -5, boxShadow: "0 10px 30px rgba(0,0,0,0.15)" });
  });
  
  card.addEventListener("mouseleave", () => {
    gsap.to(card, { duration: 0.3, scale: 1, y: 0, boxShadow: "0 2px 10px rgba(0,0,0,0.1)" });
  });
});

// Icon pulse animation
gsap.to(".icon-pulse", { 
  duration: 2, 
  scale: 1.1, 
  opacity: 0.8, 
  repeat: -1, 
  yoyo: true, 
  ease: "power2.inOut" 
});

// Scroll-triggered animations
gsap.utils.toArray(".section").forEach(section => {
  gsap.from(section, {
    scrollTrigger: {
      trigger: section,
      start: "top 80%",
      end: "bottom 20%",
      toggleActions: "play none none reverse"
    },
    duration: 1,
    y: 50,
    opacity: 0,
    ease: "power2.out"
  });
});

// Breaking news alert animation
function showBreakingAlert(message) {
  const alert = document.createElement('div');
  alert.className = 'breaking-alert';
  alert.innerHTML = `
    <div class="alert-content">
      <span class="alert-icon">🚨</span>
      <span class="alert-text">${message}</span>
    </div>
  `;
  document.body.appendChild(alert);
  
  gsap.timeline()
    .from(alert, { duration: 0.5, x: "100%", ease: "power3.out" })
    .to(alert, { duration: 0.5, x: "100%", ease: "power3.in", delay: 5 })
    .call(() => alert.remove());
}