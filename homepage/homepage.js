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
    div.innerHTML = `<h3>${attraction.name}</h3>
                     <p>${attraction.description}</p>
                     <div>
                       <img src="${attraction.image1}" alt="${attraction.name}">
                       <img src="${attraction.image2}" alt="${attraction.name}">
                       <img src="${attraction.image3}" alt="${attraction.name}">
                       <p><a href="${attraction.map_link}" target="_blank">Open in Maps</a></p>
                     </div>
                     <div id="reviewsList"></div>
                     <form>
                       <h4>Add a review:</h4>
                       <input type="hidden" id="attractionName" value="${attraction.name}">
                       <input type="number" id="rating" placeholder="Rating" min="1" max="5">
                       <textarea id="comment" placeholder="Comment"></textarea>
                       <button type="button" onclick="submitReview()">Submit Review</button>
                     </form>`;
    attractionDetails.appendChild(div);
    fetchReviews(attraction.name); // Fetch and display reviews for the selected attraction
  }

  async function fetchReviews(attraction_name) {
    try {
      const response = await axios.get(`http://localhost:3000/reviews/${attraction_name}`);
      if (response.data.success) {
        displayReviews(response.data.data);
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
      alert('An error occurred while fetching reviews.');
    }
  }

  function displayReviews(reviews) {
    const reviewsList = document.getElementById('reviewsList');
    reviewsList.innerHTML = '<h4>Reviews:</h4>';
    reviews.forEach(review => {
      const div = document.createElement('div');
      div.className = 'review';
      div.innerHTML = `<p><strong>${review.user_id}</strong> rated <strong> ${review.rating}</strong> stars </p>
                       <p>${review.comment}</p>`;
      reviewsList.appendChild(div);
    });
  }

  window.submitReview = async function() {
    const attractionName = document.getElementById('attractionName').value;
    const rating = document.getElementById('rating').value;
    const comment = document.getElementById('comment').value;

    const token = localStorage.getItem('token');
    if (!token) {
      alert('You must be logged in to submit a review.');
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const userName = payload.name;

      if (!rating || !comment) {
        alert('All fields are required.');
        return;
      }

      const response = await axios.post('http://localhost:3000/add-review', {
        attraction_name: attractionName,
        user_id: userName,
        rating: parseInt(rating),
        comment: comment
      });
      if (response.data.success) {
        alert('Review added successfully!');
        fetchReviews(attractionName); // Refresh the reviews
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error('Error adding review:', error);
      alert('An error occurred while adding the review.');
    }
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
