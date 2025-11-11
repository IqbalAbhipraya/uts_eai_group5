/* ===========================
   UNIFIED NAVBAR JAVASCRIPT 
   =========================== */

// Function to load navbar component
async function loadNavbarComponent() {
  try {
    // Detect if we're in a subfolder and adjust path
    const isInSubfolder = window.location.pathname.includes("/Web/");
    const componentPath = isInSubfolder ? "../navbar.html" : "./navbar.html";

    // Fetch navbar component HTML
    const response = await fetch(componentPath);
    const navbarHTML = await response.text();

    // Find navbar placeholder and inject HTML
    const navbarPlaceholder = document.getElementById("navbar-placeholder");
    if (navbarPlaceholder) {
      navbarPlaceholder.innerHTML = navbarHTML;

      // Fix navigation links based on current location
      fixNavigationPaths();

      // Set active page based on current filename
      setActivePage();

      // Initialize navbar functionality
      initNavbarFunctionality();

      console.log("✅ Navbar loaded successfully!");
    } else {
      console.error(
        '❌ Navbar placeholder not found! Add <div id="navbar-placeholder"></div> to your HTML'
      );
    }
  } catch (error) {
    console.error("❌ Failed to load navbar component:", error);
  }
}

// Function to fix navigation paths based on current location
function fixNavigationPaths() {
  const isInSubfolder = window.location.pathname.includes("/Web/");
  const navItems = document.querySelectorAll(".nav-item");
  const adminLink = document.querySelector(".admin-link");

  navItems.forEach((item) => {
    const currentHref = item.getAttribute("href");
    if (isInSubfolder) {
      // If in Web folder, remove Web/ prefix to make relative links
      item.setAttribute("href", currentHref.replace("Web/", ""));
    }
  });

  // Fix admin link
  if (adminLink && isInSubfolder) {
    adminLink.setAttribute("href", "../index.html");
  }
}

// Function to set active page in navigation
function setActivePage() {
  const currentPage =
    window.location.pathname.split("/").pop().replace(".html", "") || "index";
  const navItems = document.querySelectorAll(".nav-item");

  navItems.forEach((item) => {
    item.classList.remove("active");
    const page = item.getAttribute("data-page");
    if (
      page === currentPage ||
      (currentPage === "index" && page === "courses")
    ) {
      item.classList.add("active");
    }
  });
}

// Initialize navbar functionality
function initNavbarFunctionality() {
  // Initialize admin sidebar
  const adminNavbar = new AdminNavbar();
  // Initialize header navbar
  const headerNavbar = new HeaderNavbar();
}

// Admin Sidebar Class
class AdminNavbar {
  constructor() {
    this.sidebar = document.getElementById("sidebar");
    this.toggleBtn = document.getElementById("sidebar-toggle");
    this.mainContent = document.querySelector(".main-content");
    this.isOpen = false;

    this.init();
  }

  init() {
    // Check if required elements exist
    if (!this.sidebar || !this.toggleBtn || !this.mainContent) {
      console.error("Admin navbar: Required elements not found");
      return;
    }

    // Setup event listeners
    this.toggleBtn.addEventListener("click", () => this.toggleSidebar());
    document.addEventListener("click", (e) => this.handleOutsideClick(e));
    document.addEventListener("keydown", (e) => this.handleKeyboard(e));
    window.addEventListener("resize", () => this.handleResize());
  }

  toggleSidebar() {
    this.isOpen = !this.isOpen;

    if (this.isOpen) {
      this.openSidebar();
    } else {
      this.closeSidebar();
    }
  }

  openSidebar() {
    this.sidebar.classList.add("active");
    this.toggleBtn.classList.add("active");
    this.mainContent.classList.add("shifted");

    // Add overlay for mobile
    if (window.innerWidth <= 768) {
      this.addOverlay();
      document.body.classList.add("sidebar-open");
    }
  }

  closeSidebar() {
    this.sidebar.classList.remove("active");
    this.toggleBtn.classList.remove("active");
    this.mainContent.classList.remove("shifted");
    this.removeOverlay();
    document.body.classList.remove("sidebar-open");
  }

  handleOutsideClick(e) {
    // Close sidebar if clicking outside on mobile
    if (window.innerWidth <= 768 && this.isOpen) {
      if (
        !this.sidebar.contains(e.target) &&
        !this.toggleBtn.contains(e.target)
      ) {
        this.closeSidebar();
        this.isOpen = false;
      }
    }
  }

  handleKeyboard(e) {
    // ESC key to close sidebar
    if (e.key === "Escape" && this.isOpen) {
      this.closeSidebar();
      this.isOpen = false;
    }
  }

  handleResize() {
    // Close sidebar on resize to desktop
    if (window.innerWidth > 768 && this.isOpen) {
      this.removeOverlay();
      document.body.classList.remove("sidebar-open");
    }
  }

  addOverlay() {
    if (!document.querySelector(".sidebar-overlay")) {
      const overlay = document.createElement("div");
      overlay.className = "sidebar-overlay";
      document.body.appendChild(overlay);

      setTimeout(() => overlay.classList.add("active"), 10);

      overlay.addEventListener("click", () => {
        this.closeSidebar();
        this.isOpen = false;
      });
    }
  }

  removeOverlay() {
    const overlay = document.querySelector(".sidebar-overlay");
    if (overlay) {
      overlay.classList.remove("active");
      setTimeout(() => overlay.remove(), 300);
    }
  }
}

// Header Navigation Class
class HeaderNavbar {
  constructor() {
    this.navMenu = document.getElementById("nav-menu");
    this.navToggle = document.getElementById("nav-toggle");
    this.navItems = document.querySelectorAll(".nav-item");
    this.isMenuOpen = false;

    this.init();
  }

  init() {
    // Check if elements exist
    if (!this.navMenu || !this.navToggle) {
      console.error("Header navbar: Required elements not found");
      return;
    }

    // Setup event listeners
    this.navToggle.addEventListener("click", () => this.toggleMobileMenu());

    // Navigation item click handlers
    this.navItems.forEach((item) => {
      item.addEventListener("click", (e) => this.handleNavClick(e));
    });

    // Close mobile menu when clicking outside
    document.addEventListener("click", (e) => this.handleOutsideClick(e));

    // Handle window resize
    window.addEventListener("resize", () => this.handleResize());

    // Keyboard navigation
    document.addEventListener("keydown", (e) => this.handleKeyboard(e));
  }

  toggleMobileMenu() {
    this.isMenuOpen = !this.isMenuOpen;

    if (this.isMenuOpen) {
      this.openMobileMenu();
    } else {
      this.closeMobileMenu();
    }
  }

  openMobileMenu() {
    this.navMenu.classList.add("active");
    this.navToggle.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  closeMobileMenu() {
    this.navMenu.classList.remove("active");
    this.navToggle.classList.remove("active");
    document.body.style.overflow = "";
  }

  handleNavClick(e) {
    const clickedItem = e.currentTarget;

    // Remove active class from all items
    this.navItems.forEach((item) => item.classList.remove("active"));

    // Add active class to clicked item
    clickedItem.classList.add("active");

    // Close mobile menu if open
    if (this.isMenuOpen) {
      this.closeMobileMenu();
      this.isMenuOpen = false;
    }
  }

  handleOutsideClick(e) {
    // Close mobile menu if clicking outside
    if (
      this.isMenuOpen &&
      !this.navMenu.contains(e.target) &&
      !this.navToggle.contains(e.target)
    ) {
      this.closeMobileMenu();
      this.isMenuOpen = false;
    }
  }

  handleResize() {
    // Close mobile menu on resize to desktop
    if (window.innerWidth > 768 && this.isMenuOpen) {
      this.closeMobileMenu();
      this.isMenuOpen = false;
    }
  }

  handleKeyboard(e) {
    if (e.key === "Escape" && this.isMenuOpen) {
      this.closeMobileMenu();
      this.isMenuOpen = false;
    }
  }
}

// Auto-load navbar when DOM is ready
document.addEventListener("DOMContentLoaded", async () => {
  await loadNavbarComponent();
});

// Export for manual use
window.loadNavbarComponent = loadNavbarComponent;
