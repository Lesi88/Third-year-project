document.getElementById('attractionForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const formData = {
        name: document.getElementById('name').value,
        location: document.getElementById('location').value,
        description: document.getElementById('description').value,
        map_link: document.getElementById('map_link').value,
        image1: document.getElementById('image1').value,
        image2: document.getElementById('image2').value,
        image3: document.getElementById('image3').value
    };

    axios.post('http://localhost:3000/add-attraction', formData)
        .then(response => {
            alert(response.data.message);
        })
        .catch(error => {
            console.error('There was an error!', error);
            alert('Failed to add attraction.');
        });
});
