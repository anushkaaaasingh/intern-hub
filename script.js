// Load internships from JSON and localStorage
async function loadInternships() {
  const response = await fetch('./internships.json');
  const jsonInternships = await response.json();
  const userInternships = JSON.parse(localStorage.getItem('userInternships') || '[]');
  const allInternships = [...jsonInternships, ...userInternships];
  displayInternships(allInternships);
}

// Display internships (for index.html)
function displayInternships(internships) {
  const list = document.getElementById('internship-list');
  if (!list) return;
  list.innerHTML = '';
  internships.forEach(internship => {
    const card = document.createElement('div');
    card.className = 'internship-card';
    card.innerHTML = `
      <h3>${internship.title}</h3>
      <p>Role: ${internship.role}</p>
      <p>Year: ${internship.year}</p>
      <p>Tech: ${internship.tech.join(', ')}</p>
      <p>Deadline: ${internship.deadline}</p>
      <div>${internship.tags.map(tag => `<span class="tag tag-${tag.toLowerCase().replace(' ', '-')}">${tag}</span>`).join('')}</div>
      <a href="${internship.applyLink}" class="apply-btn" target="_blank">Apply Now</a>
      <button onclick="bookmarkInternship('${internship.title}')">Bookmark</button>
    `;
    list.appendChild(card);
  });
}

// Bookmark internship
function bookmarkInternship(title) {
  let bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
  if (!bookmarks.includes(title)) {
    bookmarks.push(title);
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    alert(`Bookmarked ${title}!`);
  } else {
    alert(`${title} is already bookmarked!`);
  }
}

// Display bookmarked internships (for tracker.html)
async function displayBookmarkedInternships() {
  const list = document.getElementById('tracker-list');
  if (!list) return;
  const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
  if (bookmarks.length === 0) {
    list.innerHTML = '<p class="tracker-empty">No internships bookmarked yet.</p>';
    return;
  }

  const response = await fetch('./internships.json');
  const jsonInternships = await response.json();
  const userInternships = JSON.parse(localStorage.getItem('userInternships') || '[]');
  const allInternships = [...jsonInternships, ...userInternships];
  const bookmarkedInternships = allInternships.filter(internship => bookmarks.includes(internship.title));

  list.innerHTML = '';
  bookmarkedInternships.forEach(internship => {
    const card = document.createElement('div');
    card.className = 'internship-card';
    card.innerHTML = `
      <h3>${internship.title}</h3>
      <p>Role: ${internship.role}</p>
      <p>Year: ${internship.year}</p>
      <p>Tech: ${internship.tech.join(', ')}</p>
      <p>Deadline: ${internship.deadline}</p>
      <div>${internship.tags.map(tag => `<span class="tag tag-${tag.toLowerCase().replace(' ', '-')}">${tag}</span>`).join('')}</div>
      <a href="${internship.applyLink}" class="apply-btn" target="_blank">Apply Now</a>
      <button onclick="removeBookmark('${internship.title}')">Remove Bookmark</button>
    `;
    list.appendChild(card);
  });
}

// Remove bookmark
function removeBookmark(title) {
  let bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
  bookmarks = bookmarks.filter(t => t !== title);
  localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
  displayBookmarkedInternships();
  alert(`Removed ${title} from bookmarks.`);
}

// Filter internships
function filterInternships(internships) {
  const role = document.getElementById('role-filter')?.value || '';
  const year = document.getElementById('year-filter')?.value || '';
  const tag = document.getElementById('tag-filter')?.value || '';

  return internships.filter(internship => {
    return (
      (!role || internship.role === role) &&
      (!year || internship.year === year) &&
      (!tag || internship.tags.includes(tag))
    );
  });
}

// Handle form submission (for add-internship.html)
function setupForm() {
  const form = document.getElementById('internship-form');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    const newInternship = {
      title: document.getElementById('title').value,
      role: document.getElementById('role').value,
      year: document.getElementById('year').value,
      tech: document.getElementById('tech').value.split(',').map(t => t.trim()).filter(t => t),
      tags: document.getElementById('tags').value.split(',').map(t => t.trim()).filter(t => t),
      deadline: document.getElementById('deadline').value,
      applyLink: document.getElementById('applyLink').value
    };

    let userInternships = JSON.parse(localStorage.getItem('userInternships') || '[]');
    userInternships.push(newInternship);
    localStorage.setItem('userInternships', JSON.stringify(userInternships));
    alert('Internship added successfully!');
    form.reset();
  });
}
