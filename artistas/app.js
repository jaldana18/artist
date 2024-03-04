const clientId = '0c5a5450be6344848e65d475b82ef336'; 
const clientSecret = 'b99196955fe34a61a2f9a9d19f39f54d';
const apiUrl = 'https://api.spotify.com/v1/search';

function searchArtists() {
    const searchInput = document.getElementById('searchInput');
    const query = searchInput.value.trim();
    if (query !== '') {
        renderArtists(query); 
    } else {
        alert('Please enter a search query.');
    }
}



async function fetchArtists(query) {
    const searchQuery = `q=${query}&type=artist&limit=1`; 
    const headers = {
        'Authorization': 'Bearer ' + await getAccessToken(),
        'Content-Type': 'application/json'
    };

    try {
        const response = await fetch(`${apiUrl}?${searchQuery}`, { headers });
        const data = await response.json();
        return data.artists.items[0]; 
    } catch (error) {
        console.error('Error fetching artist:', error);
    }
}



async function fetchTopAlbums(artistId) {
    const topAlbumsUrl = `https://api.spotify.com/v1/artists/${artistId}/albums?limit=5&include_groups=album&market=US`; 
    const headers = {
        'Authorization': 'Bearer ' + await getAccessToken(),
        'Content-Type': 'application/json'
    };

    try {
        const response = await fetch(topAlbumsUrl, { headers });
        const data = await response.json();
        return data.items;
    } catch (error) {
        console.error('Error fetching top albums:', error);
    }
}


async function renderArtists(query) {
    const artistsContainer = document.getElementById('artists');
    artistsContainer.innerHTML = ''; 

    if (!query) {
        return;
    }

    const artist = await fetchArtists(query);

    const topAlbums = await fetchTopAlbums(artist.id);
    const top5Albums = topAlbums.slice(0, 5); 

    const artistElement = document.createElement('div');
    artistElement.classList.add('artist');
    artistElement.innerHTML = `
        <img src="${artist.images && artist.images.length > 0 ? artist.images[0].url : 'https://via.placeholder.com/150'}" alt="${artist.name}">
        <h2>${artist.name}</h2>
        <p>${artist.genres && artist.genres.length > 0 ? artist.genres.join(', ') : 'No genres available'}</p>
        <h3>Top Albums:</h3>
        <ul>
            ${top5Albums.map(album => `<li>${album.name}</li>`).join('')}
        </ul>
    `;
    artistsContainer.appendChild(artistElement);
}


async function getAccessToken() {
    const tokenUrl = 'https://accounts.spotify.com/api/token';
    const auth = btoa(`${clientId}:${clientSecret}`);
    const headers = {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded'
    };
    const body = 'grant_type=client_credentials';

    try {
        const response = await fetch(tokenUrl, { method: 'POST', headers, body });
        const data = await response.json();
        return data.access_token;
    } catch (error) {
        console.error('Error fetching access token:', error);
    }
}
