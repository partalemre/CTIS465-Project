const BASE_URL = 'http://localhost:5108/api';

async function request(url, method = 'GET', body = null) {
    const options = {
        method,
        headers: { 'Content-Type': 'application/json' },
    };
    if (body) options.body = JSON.stringify(body);
    const response = await fetch(`${BASE_URL}${url}`, options);
    if (response.status === 204) return null;
    return response.json();
}

// Directors
export const getDirectors = () => request('/Directors');
export const getDirector = (id) => request(`/Directors/${id}`);
export const createDirector = (data) => request('/Directors', 'POST', data);
export const updateDirector = (data) => request('/Directors', 'PUT', data);
export const deleteDirector = (id) => request(`/Directors/${id}`, 'DELETE');

// Genres
export const getGenres = () => request('/Genres');
export const getGenre = (id) => request(`/Genres/${id}`);
export const createGenre = (data) => request('/Genres', 'POST', data);
export const updateGenre = (data) => request('/Genres', 'PUT', data);
export const deleteGenre = (id) => request(`/Genres/${id}`, 'DELETE');

// Movies
export const getMovies = () => request('/Movies');
export const getMovie = (id) => request(`/Movies/${id}`);
export const createMovie = (data) => request('/Movies', 'POST', data);
export const updateMovie = (data) => request('/Movies', 'PUT', data);
export const deleteMovie = (id) => request(`/Movies/${id}`, 'DELETE');
