// DOM Elements
const themeToggle = document.getElementById('theme-toggle');
const extensionsContainer = document.getElementById('extensions-container');
const filterButtons = document.querySelectorAll('.filter-btn');

// State
let extensions = [];
let currentFilter = 'all';

// Fetch extensions data
async function fetchExtensions() {
  try {
    const response = await fetch('data.json');
    extensions = await response.json();
    renderExtensions();
  } catch (error) {
    console.error('Error loading extensions:', error);
    extensionsContainer.innerHTML = '<p>Error loading extensions. Please try again later.</p>';
  }
}

// Render extensions
function renderExtensions() {
  // Clear container
  extensionsContainer.innerHTML = '';
  
  // Filter extensions based on current filter
  const filteredExtensions = filterExtensions(extensions, currentFilter);
  
  // Render each extension
  filteredExtensions.forEach(extension => {
    const card = createExtensionCard(extension);
    extensionsContainer.appendChild(card);
  });
  
  // If no extensions to display
  if (filteredExtensions.length === 0) {
    extensionsContainer.innerHTML = `<p class="no-extensions">No ${currentFilter !== 'all' ? currentFilter : ''} extensions found.</p>`;
  }
}

// Filter extensions based on active/inactive state
function filterExtensions(extensions, filter) {
  switch (filter) {
    case 'active':
      return extensions.filter(ext => ext.isActive);
    case 'inactive':
      return extensions.filter(ext => !ext.isActive);
    default:
      return extensions;
  }
}

// Get logo CSS class based on extension name
function getLogoClass(name) {
  // Create a className by removing spaces and converting to lowercase
  const baseName = name.toLowerCase().replace(/\s+/g, '');
  
  // Map names to their corresponding CSS classes
  const classMap = {
    'devlens': 'devlens',
    'stylespy': 'stylespy',
    'speedboost': 'speedboost',
    'jsonwizard': 'jsonwizard',
    'tabmasterpro': 'tabmaster',
    'viewportbuddy': 'viewportbuddy',
    'markupnotes': 'markup',
    'gridguides': 'gridguides',
    'palettepicker': 'palette',
    'linkchecker': 'linkchecker',
    'domsnapshot': 'dom',
    'consoleplus': 'consoleplus'
  };
  
  return classMap[baseName] || '';
}

// Create extension card element
function createExtensionCard(extension) {
  const card = document.createElement('div');
  card.className = 'extension-card';
  
  // Get the appropriate logo class for background color
  const logoClass = getLogoClass(extension.name);
  const extensionName = extension.name.replace(/ Pro$/, '&nbsp;Pro'); // Keep Pro on same line
  
  card.innerHTML = `
    <div class="extension-header"> 
      <div class="extension-logo ${logoClass}">
        <img src="${extension.logo}" alt="${extension.name} logo">
      </div>
      <div class="extension-content">
        <h3 class="extension-name">${extensionName}</h3>
        <p class="extension-description">${extension.description}</p>
      </div>
    </div>
    <div class="extension-controls">
      <button class="remove-btn" data-name="${extension.name}">Remove</button>
      <label class="switch">
        <input type="checkbox" ${extension.isActive ? 'checked' : ''} data-name="${extension.name}">
        <span class="slider"></span>
      </label>
    </div>
  `;
  
  // Add event listeners
  const removeBtn = card.querySelector('.remove-btn');
  removeBtn.addEventListener('click', handleRemoveExtension);
  
  const toggleSwitch = card.querySelector('input[type="checkbox"]');
  toggleSwitch.addEventListener('change', handleToggleExtension);
  
  return card;
}

// Handle extension removal
function handleRemoveExtension(event) {
  const extensionName = event.target.dataset.name;
  
  // Find and remove extension from array
  extensions = extensions.filter(ext => ext.name !== extensionName);
  
  // Re-render extensions
  renderExtensions();
}

// Handle extension toggle
function handleToggleExtension(event) {
  const extensionName = event.target.dataset.name;
  const isActive = event.target.checked;
  
  // Update extension state
  extensions = extensions.map(ext => {
    if (ext.name === extensionName) {
      return { ...ext, isActive };
    }
    return ext;
  });
  
  // If current filter is not 'all', the card might need to be hidden
  if (currentFilter !== 'all') {
    renderExtensions();
  }
}

// Handle filter button clicks
function handleFilterClick(event) {
  // Only process if not already active
  if (!event.target.classList.contains('active')) {
    // Remove active class from all buttons
    filterButtons.forEach(btn => btn.classList.remove('active'));
    
    // Add active class to clicked button
    event.target.classList.add('active');
    
    // Update current filter
    currentFilter = event.target.dataset.filter;
    
    // Re-render extensions
    renderExtensions();
  }
}

// Theme toggling functionality
function toggleTheme() {
  const html = document.documentElement;
  const currentTheme = html.getAttribute('data-theme');
  
  // Toggle theme
  if (currentTheme === 'dark') {
    html.setAttribute('data-theme', 'light');
    localStorage.setItem('theme', 'light');
  } else {
    html.setAttribute('data-theme', 'dark');
    localStorage.setItem('theme', 'dark');
  }
}

// Load saved theme from localStorage
function loadSavedTheme() {
  const savedTheme = localStorage.getItem('theme');
  
  if (savedTheme) {
    document.documentElement.setAttribute('data-theme', savedTheme);
  } else {
    // Default to dark theme if no saved preference
    document.documentElement.setAttribute('data-theme', 'dark');
  }
}

// Init
function init() {
  // Load saved theme
  loadSavedTheme();
  
  // Add event listeners
  themeToggle.addEventListener('click', toggleTheme);
  filterButtons.forEach(btn => btn.addEventListener('click', handleFilterClick));
  
  // Fetch and render extensions
  fetchExtensions();
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', init); 