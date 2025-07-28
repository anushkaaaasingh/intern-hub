async function loadInternships() {
  try {
    const response = await fetch('/internships.json');
    if (!response.ok) throw new Error(`Failed to fetch internships.json: ${response.status}`);
    const jsonInternships = await response.json();
    const userInternships = JSON.parse(localStorage.getItem('userInternships') || '[]');
    return [...jsonInternships, ...userInternships];
  } catch (error) {
    console.error('Error loading internships:', error);
    alert('Failed to load internships. Check console for details.');
    return [];
  }
}

function displayInternships(internships) {
  const list = document.getElementById('internship-list');
  if (!list) return;
  list.innerHTML = '';
  if (internships.length === 0) {
    list.innerHTML = '<p>No internships found.</p>';
    return;
  }
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

async function displayBookmarkedInternships() {
  const list = document.getElementById('tracker-list');
  if (!list) return;
  const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
  if (bookmarks.length === 0) {
    list.innerHTML = '<p class="tracker-empty">No internships bookmarked yet.</p>';
    return;
  }

  try {
    const allInternships = await loadInternships();
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
  } catch (error) {
    console.error('Error loading bookmarked internships:', error);
    alert('Failed to load bookmarked internships. Check console for details.');
  }
}

function removeBookmark(title) {
  let bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
  bookmarks = bookmarks.filter(t => t !== title);
  localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
  displayBookmarkedInternships();
  alert(`Removed ${title} from bookmarks.`);
}

function filterInternships(internships, role, year, tag) {
  return internships.filter(internship => {
    return (
      (!role || internship.role === role) &&
      (!year || internship.year === year) &&
      (!tag || internship.tags.includes(tag))
    );
  });
}

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

async function init() {
  const internships = await loadInternships();
  const roleFilter = document.getElementById('role-filter');
  const yearFilter = document.getElementById('year-filter');
  const tagFilter = document.getElementById('tag-filter');

  if (roleFilter && yearFilter && tagFilter) {
    // Initial display with current filter values
    const filteredInternships = filterInternships(
      internships,
      roleFilter.value,
      yearFilter.value,
      tagFilter.value
    );
    displayInternships(filteredInternships);

    // Event listeners for filters
    roleFilter.addEventListener('change', () => {
      const filtered = filterInternships(
        internships,
        roleFilter.value,
        yearFilter.value,
        tagFilter.value
      );
      displayInternships(filtered);
    });

    yearFilter.addEventListener('change', () => {
      const filtered = filterInternships(
        internships,
        roleFilter.value,
        yearFilter.value,
        tagFilter.value
      );
      displayInternships(filtered);
    });

    tagFilter.addEventListener('change', () => {
      const filtered = filterInternships(
        internships,
        roleFilter.value,
        yearFilter.value,
        tagFilter.value
      );
      displayInternships(filtered);
    });
  }

  setupForm();
  displayBookmarkedInternships();
}

init();
