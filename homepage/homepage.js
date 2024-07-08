document.addEventListener('DOMContentLoaded', () => {
  const searchButton = document.getElementById('searchButton');
  const searchInput = document.getElementById('searchInput');
  const attractionList = document.querySelector('.attractions');
  const attractionDetails = document.querySelector('.details');

  let attractions = [];

  async function fetchAttractions() {
    try {
      const response = await axios.get('http://localhost:3000/attractions');
      if (response.data.success) {
        attractions = response.data.data;
        displayAttractions(attractions);
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error('Error fetching attractions:', error);
      alert('An error occurred while fetching attractions.');
    }
  }

  function displayAttractions(attractions) {
    attractionList.innerHTML = '';
    if (!Array.isArray(attractions)) {
      console.error('Expected an array of attractions, got:', attractions);
      return;
    }
    attractions.forEach(attraction => {
      const div = document.createElement('div');
      div.className = 'attraction';
      div.textContent = `${attraction.name} - ${attraction.description}`;
      div.addEventListener('click', () => displayDetails(attraction));
      attractionList.appendChild(div);
    });
  }

  function displayDetails(attraction) {
    attractionDetails.innerHTML = '';
    const div = document.createElement('div');
    div.className = 'detail';
    div.innerHTML = `<h3>${attraction.name}</h3><p>${attraction.description}<div>
                <img src="${attraction.image1}" alt="${attraction.name}">
                <img src="${attraction.image2}" alt="${attraction.name}">
                <img src="${attraction.image3}" alt="${attraction.name}">
              </div></p>`;
    attractionDetails.appendChild(div);
  }

  searchButton.addEventListener('click', () => {
    const query = searchInput.value.toLowerCase();
    const filteredAttractions = attractions.filter(attraction =>
      attraction.name.toLowerCase().includes(query) || attraction.description.toLowerCase().includes(query)
    );
    displayAttractions(filteredAttractions);
  });

  // Fetch and display attractions on page load
  fetchAttractions();
});