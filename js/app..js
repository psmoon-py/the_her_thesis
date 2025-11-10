// The HER Thesis - Complete JavaScript Application
class HERThesisApp {
  constructor() {
    this.isLoaded = false;
    this.currentSection = 'hero';
    this.scientists = null;
    this.scenes = {};
    this.init();
  }

  async init() {
    try {
      // Show loading screen
      this.showLoading();
      
      // Load scientists data
      await this.loadData();
      
      // Initialize core systems
      this.initNavigation();
      this.initAnimations();
      this.init3DScenes();
      this.initScrollEffects();
      this.initEventListeners();
      
      // Hide loading screen
      setTimeout(() => {
        this.hideLoading();
        this.isLoaded = true;
      }, 3000);
      
    } catch (error) {
      console.error('Failed to initialize app:', error);
      this.hideLoading();
    }
  }

  // === LOADING SYSTEM ===
  showLoading() {
    const loadingScreen = document.querySelector('.loading-screen');
    if (loadingScreen) {
      loadingScreen.style.opacity = '1';
      loadingScreen.style.visibility = 'visible';
      
      // Animate progress bar
      const progress = loadingScreen.querySelector('.loading-progress');
      if (progress) {
        setTimeout(() => {
          progress.style.width = '100%';
        }, 100);
      }
    }
  }

  hideLoading() {
    const loadingScreen = document.querySelector('.loading-screen');
    if (loadingScreen) {
      loadingScreen.style.opacity = '0';
      setTimeout(() => {
        loadingScreen.style.visibility = 'hidden';
        this.startIntroAnimation();
      }, 500);
    }
  }

  // === DATA LOADING ===
  async loadData() {
    // Scientists data embedded in app
    this.scientists = {
      physics: [
        {
          id: 'marie-curie',
          name: 'Marie Curie',
          years: '1867-1934',
          field: 'Physics & Chemistry',
          discovery: 'Radioactivity, Discovery of Radium and Polonium',
          contribution: 'First woman to win Nobel Prize, only person to win Nobel Prizes in two different sciences',
          overlooked: 'Her systematic approach to isolating radioactive elements was revolutionary',
          color: '#ff6b6b'
        },
        {
          id: 'lise-meitner',
          name: 'Lise Meitner',
          years: '1878-1968',
          field: 'Nuclear Physics',
          discovery: 'Nuclear Fission Theory',
          contribution: 'Explained the physics behind nuclear fission, coined the term "nuclear fission"',
          overlooked: 'Excluded from Nobel Prize despite being the physicist who explained fission',
          color: '#4fc3f7'
        },
        {
          id: 'chien-shiung-wu',
          name: 'Chien-Shiung Wu',
          years: '1912-1997',
          field: 'Experimental Nuclear Physics',
          discovery: 'Violation of Parity Conservation',
          contribution: 'Wu Experiment proved that identical nuclear particles don\'t always behave identically',
          overlooked: 'Male colleagues won Nobel Prize for theory she experimentally proved',
          color: '#81c784'
        }
      ],
      genetics: [
        {
          id: 'rosalind-franklin',
          name: 'Rosalind Franklin',
          years: '1920-1958',
          field: 'X-ray Crystallography & Molecular Biology',
          discovery: 'DNA Double Helix Structure (Photo 51)',
          contribution: 'X-ray diffraction images crucial for understanding DNA structure',
          overlooked: 'Her systematic X-ray crystallography work was essential for DNA model',
          color: '#66bb6a'
        },
        {
          id: 'barbara-mcclintock',
          name: 'Barbara McClintock',
          years: '1902-1992',
          field: 'Cytogenetics',
          discovery: 'Genetic Transposition (Jumping Genes)',
          contribution: 'Discovered that genes can move within chromosomes, founding mobile genetics',
          overlooked: 'Work ignored for decades until molecular biology caught up',
          color: '#42a5f5'
        }
      ],
      chemistry: [
        {
          id: 'dorothy-hodgkin',
          name: 'Dorothy Hodgkin',
          years: '1910-1994',
          field: 'X-ray Crystallography',
          discovery: 'Structure of Penicillin, Vitamin B12, and Insulin',
          contribution: 'Determined 3D structures of complex biological molecules',
          overlooked: 'Her work enabled synthetic antibiotic development during WWII',
          color: '#ffb74d'
        }
      ],
      astronomy: [
        {
          id: 'cecilia-payne',
          name: 'Cecilia Payne-Gaposchkin',
          years: '1900-1979',
          field: 'Astrophysics',
          discovery: 'Stellar Composition (Stars are mostly Hydrogen & Helium)',
          contribution: 'First to determine what stars are made of, revolutionizing astrophysics',
          overlooked: 'Initially rejected findings later became cornerstone of modern astronomy',
          color: '#ffd54f'
        },
        {
          id: 'katherine-johnson',
          name: 'Katherine Johnson',
          years: '1918-2020',
          field: 'Applied Mathematics & Orbital Mechanics',
          discovery: 'Space Trajectory Calculations',
          contribution: 'Calculated flight paths for Mercury, Apollo missions including moon landing',
          overlooked: 'Human computers like her made space exploration possible before electronic computers',
          color: '#81d4fa'
        }
      ]
    };
  }

  // === NAVIGATION ===
  initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');

    // Navigation link clicks
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetSection = link.getAttribute('data-section');
        this.navigateToSection(targetSection);
      });
    });

    // Mobile menu toggle
    if (navToggle && navMenu) {
      navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
        document.body.classList.toggle('nav-open');
      });
    }

    // Scroll-based navigation updates
    this.initScrollNavigation();
  }

  initScrollNavigation() {
    const sections = document.querySelectorAll('.section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const currentId = entry.target.getAttribute('id');
          this.currentSection = currentId;
          
          // Update active navigation
          navLinks.forEach(link => {
            const targetSection = link.getAttribute('data-section');
            if (targetSection === currentId) {
              link.classList.add('active');
            } else {
              link.classList.remove('active');
            }
          });

          // Update navigation background
          this.updateNavBackground();
        }
      });
    }, {
      threshold: 0.3,
      rootMargin: '-80px 0px -80px 0px'
    });

    sections.forEach(section => observer.observe(section));
  }

  updateNavBackground() {
    const nav = document.querySelector('.nav');
    const scrollY = window.scrollY;
    
    if (scrollY > 100) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }

  navigateToSection(sectionId) {
    const targetElement = document.getElementById(sectionId);
    if (!targetElement) return;

    const navHeight = 80;
    const targetPosition = targetElement.offsetTop - navHeight;

    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth'
    });
  }

  // === 3D SCENES ===
  init3DScenes() {
    if (typeof THREE === 'undefined') return;

    // Initialize hero scene
    this.initHeroScene();
    
    // Initialize section scenes
    this.initSectionScenes();
    
    // Start animation loop
    this.animate3D();
  }

  initHeroScene() {
    const canvas = document.querySelector('#hero-canvas');
    if (!canvas) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);

    // Create floating DNA helix
    const geometry = new THREE.TorusKnotGeometry(8, 2, 100, 16);
    const material = new THREE.MeshBasicMaterial({
      color: 0xd4af37,
      wireframe: true,
      transparent: true,
      opacity: 0.6
    });
    
    const helix = new THREE.Mesh(geometry, material);
    scene.add(helix);

    // Add particles
    this.addParticles(scene, 150, 0xc9ada7);

    camera.position.z = 50;

    this.scenes.hero = { scene, camera, renderer, helix };
  }

  initSectionScenes() {
    const sections = ['physics', 'genetics', 'chemistry', 'astronomy'];
    
    sections.forEach(sectionId => {
      const canvas = document.querySelector(`#${sectionId}-canvas`);
      if (!canvas) return;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(75, canvas.offsetWidth / canvas.offsetHeight, 0.1, 1000);
      const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
      
      renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);
      renderer.setClearColor(0x000000, 0);

      // Create section-specific 3D content
      this.createSectionContent(scene, sectionId);

      camera.position.z = 40;

      this.scenes[sectionId] = { scene, camera, renderer };
    });
  }

  createSectionContent(scene, sectionId) {
    switch (sectionId) {
      case 'physics':
        this.createAtomicStructure(scene);
        break;
      case 'genetics':
        this.createDNAStructure(scene);
        break;
      case 'chemistry':
        this.createMolecularStructure(scene);
        break;
      case 'astronomy':
        this.createStellarSystem(scene);
        break;
    }
  }

  createAtomicStructure(scene) {
    // Nuclear center
    const nucleus = new THREE.Mesh(
      new THREE.SphereGeometry(2, 16, 16),
      new THREE.MeshBasicMaterial({ color: 0xff6b6b, transparent: true, opacity: 0.8 })
    );
    scene.add(nucleus);

    // Electron orbits
    for (let i = 0; i < 3; i++) {
      const electron = new THREE.Mesh(
        new THREE.SphereGeometry(0.5, 8, 8),
        new THREE.MeshBasicMaterial({ color: 0x4fc3f7 })
      );
      
      electron.userData = {
        orbitRadius: 8 + (i * 4),
        angle: (i * Math.PI * 2) / 3,
        speed: 0.02 + (i * 0.01)
      };
      
      scene.add(electron);
    }
  }

  createDNAStructure(scene) {
    const helixHeight = 30;
    const radius = 8;
    
    for (let i = 0; i < 40; i++) {
      const y = (i / 40) * helixHeight - helixHeight / 2;
      const angle1 = (i / 40) * Math.PI * 6;
      const angle2 = angle1 + Math.PI;
      
      // Base pairs
      const colors = [0xff7043, 0x42a5f5, 0x66bb6a, 0xffa726];
      const color = colors[i % 4];
      
      const sphere1 = new THREE.Mesh(
        new THREE.SphereGeometry(0.5, 8, 8),
        new THREE.MeshBasicMaterial({ color })
      );
      
      sphere1.position.set(
        Math.cos(angle1) * radius,
        y,
        Math.sin(angle1) * radius
      );
      scene.add(sphere1);
      
      const sphere2 = sphere1.clone();
      sphere2.position.set(
        Math.cos(angle2) * radius,
        y,
        Math.sin(angle2) * radius
      );
      scene.add(sphere2);
    }
  }

  createMolecularStructure(scene) {
    // Central molecule
    const center = new THREE.Mesh(
      new THREE.SphereGeometry(1.5, 16, 16),
      new THREE.MeshBasicMaterial({ color: 0xffb74d })
    );
    scene.add(center);

    // Surrounding molecules
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2;
      const colors = [0xe57373, 0x81c784, 0x64b5f6];
      
      const molecule = new THREE.Mesh(
        new THREE.SphereGeometry(0.8, 12, 12),
        new THREE.MeshBasicMaterial({ color: colors[i % 3] })
      );
      
      molecule.position.set(
        Math.cos(angle) * 8,
        Math.sin(angle) * 3,
        Math.sin(angle) * 8
      );
      
      scene.add(molecule);
    }
  }

  createStellarSystem(scene) {
    // Central star
    const sun = new THREE.Mesh(
      new THREE.SphereGeometry(3, 20, 20),
      new THREE.MeshBasicMaterial({ color: 0xffd54f, transparent: true, opacity: 0.9 })
    );
    scene.add(sun);

    // Orbiting elements
    for (let i = 0; i < 15; i++) {
      const star = new THREE.Mesh(
        new THREE.SphereGeometry(0.3, 8, 8),
        new THREE.MeshBasicMaterial({ 
          color: Math.random() > 0.5 ? 0x81d4fa : 0xf8bbd9 
        })
      );
      
      star.userData = {
        orbitRadius: 10 + Math.random() * 15,
        angle: Math.random() * Math.PI * 2,
        speed: 0.005 + Math.random() * 0.01
      };
      
      scene.add(star);
    }
  }

  addParticles(scene, count, color) {
    const particles = new THREE.BufferGeometry();
    const positions = [];
    
    for (let i = 0; i < count; i++) {
      positions.push(
        (Math.random() - 0.5) * 200,
        (Math.random() - 0.5) * 200,
        (Math.random() - 0.5) * 200
      );
    }
    
    particles.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    
    const particleMaterial = new THREE.PointsMaterial({
      color: color,
      size: 0.5,
      transparent: true,
      opacity: 0.6
    });
    
    const particleSystem = new THREE.Points(particles, particleMaterial);
    scene.add(particleSystem);
  }

  animate3D() {
    requestAnimationFrame(() => this.animate3D());

    // Animate hero scene
    if (this.scenes.hero) {
      const { helix, renderer, scene, camera } = this.scenes.hero;
      helix.rotation.x += 0.005;
      helix.rotation.y += 0.01;
      renderer.render(scene, camera);
    }

    // Animate other scenes
    Object.entries(this.scenes).forEach(([key, sceneData]) => {
      if (key === 'hero') return;
      
      const { scene, camera, renderer } = sceneData;
      
      // Animate objects in scene
      scene.children.forEach((child, index) => {
        if (child.userData && child.userData.orbitRadius) {
          child.userData.angle += child.userData.speed;
          child.position.x = Math.cos(child.userData.angle) * child.userData.orbitRadius;
          child.position.z = Math.sin(child.userData.angle) * child.userData.orbitRadius;
        } else if (child.isPoints) {
          child.rotation.y += 0.002;
        }
      });
      
      renderer.render(scene, camera);
    });
  }

  // === ANIMATIONS ===
  initAnimations() {
    if (typeof gsap === 'undefined') return;
    
    // Register ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);
    
    this.initScrollAnimations();
    this.initHoverAnimations();
  }

  startIntroAnimation() {
    if (typeof gsap === 'undefined') return;
    
    const tl = gsap.timeline();
    
    // Hero title animation
    tl.from('.hero-title', {
      y: 100,
      opacity: 0,
      duration: 1.2,
      ease: 'power3.out'
    })
    .from('.hero-subtitle', {
      y: 50,
      opacity: 0,
      duration: 1,
      ease: 'power2.out'
    }, '-=0.8')
    .from('.hero-meta', {
      y: 30,
      opacity: 0,
      duration: 0.8,
      ease: 'power2.out'
    }, '-=0.6');
  }

  initScrollAnimations() {
    // Section titles
    gsap.utils.toArray('.section-title').forEach(title => {
      gsap.from(title, {
        y: 60,
        opacity: 0,
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: title,
          start: 'top 80%',
          toggleActions: 'play none none reverse'
        }
      });
    });

    // Scientist cards
    gsap.utils.toArray('.scientist-card').forEach((card, index) => {
      gsap.from(card, {
        y: 80,
        opacity: 0,
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: card,
          start: 'top 75%',
          toggleActions: 'play none none reverse'
        }
      });
    });

    // Legacy items
    gsap.utils.toArray('.legacy-item').forEach((item, index) => {
      gsap.from(item, {
        y: 60,
        opacity: 0,
        duration: 1,
        delay: index * 0.1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: item,
          start: 'top 80%',
          toggleActions: 'play none none reverse'
        }
      });
    });
  }

  initHoverAnimations() {
    // Scientist card hover effects
    document.querySelectorAll('.scientist-card').forEach(card => {
      card.addEventListener('mouseenter', () => {
        gsap.to(card, {
          scale: 1.02,
          duration: 0.3,
          ease: 'power2.out'
        });
      });

      card.addEventListener('mouseleave', () => {
        gsap.to(card, {
          scale: 1,
          duration: 0.3,
          ease: 'power2.out'
        });
      });
    });

    // Button hover effects
    document.querySelectorAll('.btn').forEach(btn => {
      btn.addEventListener('mouseenter', () => {
        gsap.to(btn, {
          y: -3,
          duration: 0.3,
          ease: 'power2.out'
        });
      });

      btn.addEventListener('mouseleave', () => {
        gsap.to(btn, {
          y: 0,
          duration: 0.3,
          ease: 'power2.out'
        });
      });
    });
  }

  // === SCROLL EFFECTS ===
  initScrollEffects() {
    let ticking = false;

    const updateScrollEffects = () => {
      this.updateNavBackground();
      this.updateParallax();
      ticking = false;
    };

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(updateScrollEffects);
        ticking = true;
      }
    });
  }

  updateParallax() {
    const scrollY = window.scrollY;
    
    // Hero parallax
    const heroCanvas = document.querySelector('.hero-canvas');
    if (heroCanvas) {
      heroCanvas.style.transform = `translateY(${scrollY * 0.3}px)`;
    }

    // Section canvas parallax
    document.querySelectorAll('.section-canvas').forEach(canvas => {
      const rect = canvas.getBoundingClientRect();
      const speed = 0.2;
      canvas.style.transform = `translateY(${scrollY * speed}px)`;
    });
  }

  // === EVENT LISTENERS ===
  initEventListeners() {
    // Window resize
    window.addEventListener('resize', () => {
      this.handleResize();
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      this.handleKeyboard(e);
    });

    // Page visibility
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.pauseAnimations();
      } else {
        this.resumeAnimations();
      }
    });
  }

  handleResize() {
    // Update 3D scene sizes
    Object.entries(this.scenes).forEach(([key, sceneData]) => {
      const { camera, renderer } = sceneData;
      if (camera && renderer) {
        if (key === 'hero') {
          camera.aspect = window.innerWidth / window.innerHeight;
          renderer.setSize(window.innerWidth, window.innerHeight);
        } else {
          const canvas = renderer.domElement;
          const rect = canvas.getBoundingClientRect();
          camera.aspect = rect.width / rect.height;
          renderer.setSize(rect.width, rect.height);
        }
        camera.updateProjectionMatrix();
      }
    });

    // Update ScrollTrigger
    if (typeof ScrollTrigger !== 'undefined') {
      ScrollTrigger.refresh();
    }
  }

  handleKeyboard(e) {
    const sections = ['hero', 'physics', 'genetics', 'chemistry', 'astronomy', 'legacy'];
    const currentIndex = sections.indexOf(this.currentSection);

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        if (currentIndex < sections.length - 1) {
          this.navigateToSection(sections[currentIndex + 1]);
        }
        break;
      case 'ArrowUp':
        e.preventDefault();
        if (currentIndex > 0) {
          this.navigateToSection(sections[currentIndex - 1]);
        }
        break;
      case 'Home':
        e.preventDefault();
        this.navigateToSection('hero');
        break;
      case 'End':
        e.preventDefault();
        this.navigateToSection('legacy');
        break;
    }
  }

  pauseAnimations() {
    // Pause 3D animations when tab is not visible
    Object.values(this.scenes).forEach(sceneData => {
      if (sceneData.renderer) {
        sceneData.renderer.setAnimationLoop(null);
      }
    });
  }

  resumeAnimations() {
    // Resume animations when tab becomes visible
    this.animate3D();
  }

  // === PUBLIC API ===
  getCurrentSection() {
    return this.currentSection;
  }

  getScientistData(id) {
    for (const field of Object.values(this.scientists)) {
      const scientist = field.find(s => s.id === id);
      if (scientist) return scientist;
    }
    return null;
  }

  showScientistModal(id) {
    const scientist = this.getScientistData(id);
    if (!scientist) return;

    // Create and show modal with scientist details
    this.createScientistModal(scientist);
  }

  createScientistModal(scientist) {
    const modal = document.createElement('div');
    modal.className = 'scientist-modal';
    modal.innerHTML = `
      <div class="modal-backdrop" onclick="this.parentElement.remove()"></div>
      <div class="modal-content">
        <button class="modal-close" onclick="this.closest('.scientist-modal').remove()">×</button>
        <h2>${scientist.name}</h2>
        <p class="scientist-years">${scientist.years}</p>
        <p class="scientist-field">${scientist.field}</p>
        <div class="scientist-details">
          <h3>Major Discovery</h3>
          <p>${scientist.discovery}</p>
          <h3>Key Contribution</h3>
          <p>${scientist.contribution}</p>
          <h3>Often Overlooked</h3>
          <p>${scientist.overlooked}</p>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    // Animate in
    gsap.from(modal.querySelector('.modal-content'), {
      scale: 0.8,
      opacity: 0,
      duration: 0.3,
      ease: 'power2.out'
    });
  }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.herThesisApp = new HERThesisApp();
});

// Utility functions
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

function throttle(func, limit) {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  }
}