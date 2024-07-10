document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('attractionForm');
    const attractionList = document.getElementById('attractionList');

    form.addEventListener('submit', handleFormSubmit);
    attractionList.addEventListener('click', handleAttractionActions);

    fetchAttractions();

    function handleFormSubmit(e) {
        e.preventDefault();
        const attractionId = document.getElementById('attractionId').value;
        const name = document.getElementById('name').value;
        const location = document.getElementById('location').value;
        const description = document.getElementById('description').value;
        const map_link = document.getElementById('map_link').value;
        const image1 = document.getElementById('image1').value;
        const image2 = document.getElementById('image2').value;
        const image3 = document.getElementById('image3').value;

        const attraction = { name, location, description, map_link, image1, image2, image3 };

        if (attractionId) {
            axios.put(`http://localhost:3000/attraction/${attractionId}`, attraction)
                .then(response => {
                    alert(response.data.message);
                    fetchAttractions();
                    form.reset();
                })
                .catch(error => {
                    console.error(error);
                    alert('Failed to update attraction.');
                });
        } else {
            axios.post('http://localhost:3000/add-attraction', attraction)
                .then(response => {
                    alert(response.data.message);
                    fetchAttractions();
                    form.reset();
                })
                .catch(error => {
                    console.error(error);
                    alert('Failed to add attraction.');
                });
        }
    }

    function fetchAttractions() {
        axios.get('http://localhost:3000/attractions')
            .then(response => {
                attractionList.innerHTML = response.data.data.map(attraction => `
                    <li data-id="${attraction.name}">
                        <div>
                            <h3>${attraction.name}</h3>
                            <p>${attraction.location}</p>
                            <p>${attraction.description}</p>
                            <a href="${attraction.map_link}" target="_blank">Map</a>
                            <div class="image-container">
                                <img src="${attraction.image1}" alt="${attraction.name} Image 1">
                                <img src="${attraction.image2}" alt="${attraction.name} Image 2">
                                <img src="${attraction.image3}" alt="${attraction.name} Image 3">
                            </div>
                        </div>
                        <div class="actions">
                            <button class="edit">Edit</button>
                            <button class="delete">Delete</button>
                        </div>
                    </li>
                `).join('');
            })
            .catch(error => {
                console.error(error);
                alert('Failed to fetch attractions.');
            });
    }

    function handleAttractionActions(e) {
        const li = e.target.closest('li');
        const id = li.dataset.id;

        if (e.target.classList.contains('edit')) {
            axios.get(`http://localhost:3000/attractions`)
                .then(response => {
                    const attraction = response.data.data.find(attraction => attraction.name == id);
                    document.getElementById('attractionId').value = attraction.name;
                    document.getElementById('name').value = attraction.name;
                    document.getElementById('location').value = attraction.location;
                    document.getElementById('description').value = attraction.description;
                    document.getElementById('map_link').value = attraction.map_link;
                    document.getElementById('image1').value = attraction.image1;
                    document.getElementById('image2').value = attraction.image2;
                    document.getElementById('image3').value = attraction.image3;
                })
                .catch(error => {
                    console.error(error);
                    alert('Failed to fetch attraction details.');
                });
        } else if (e.target.classList.contains('delete')) {
            axios.delete(`http://localhost:3000/attraction/${id}`)
                .then(response => {
                    alert(response.data.message);
                    fetchAttractions();
                })
                .catch(error => {
                    console.error(error);
                    alert('Failed to delete attraction.');
                });
        }
    }
});
