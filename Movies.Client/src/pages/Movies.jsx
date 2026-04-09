import { useState, useEffect } from 'react';
import { getMovies, createMovie, updateMovie, deleteMovie } from '../services/api';
import { getDirectors } from '../services/api';
import { getGenres } from '../services/api';

const empty = { name: '', releaseDate: '', totalRevenue: 0, directorId: '', genreIds: [] };

export default function Movies() {
    const [movies, setMovies] = useState([]);
    const [directors, setDirectors] = useState([]);
    const [genres, setGenres] = useState([]);
    const [form, setForm] = useState(empty);
    const [editing, setEditing] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        load();
        getDirectors().then(d => setDirectors(d || []));
        getGenres().then(g => setGenres(g || []));
    }, []);

    async function load() {
        const data = await getMovies();
        setMovies(data || []);
    }

    function startEdit(m) {
        setForm({
            id: m.id,
            name: m.name,
            releaseDate: m.releaseDate ? m.releaseDate.split('T')[0] : '',
            totalRevenue: m.totalRevenue,
            directorId: m.directorId,
            genreIds: m.genreIds || []
        });
        setEditing(true);
        setMessage(''); setError('');
        window.scrollTo(0, 0);
    }

    function reset() {
        setForm(empty);
        setEditing(false);
        setMessage(''); setError('');
    }

    function toggleGenre(id) {
        setForm(prev => ({
            ...prev,
            genreIds: prev.genreIds.includes(id)
                ? prev.genreIds.filter(g => g !== id)
                : [...prev.genreIds, id]
        }));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        const payload = {
            ...form,
            directorId: Number(form.directorId),
            totalRevenue: Number(form.totalRevenue),
            releaseDate: form.releaseDate || null
        };
        const res = editing ? await updateMovie(payload) : await createMovie(payload);
        if (res && res.isSuccessful) {
            setMessage(res.message);
            setError('');
            reset();
            load();
        } else {
            setError(res?.message || 'An error occurred.');
        }
    }

    async function handleDelete(id) {
        if (!window.confirm('Delete this movie?')) return;
        const res = await deleteMovie(id);
        if (res && !res.isSuccessful) { setError(res.message); return; }
        load();
    }

    return (
        <div className="page">
            <h2>Movies</h2>

            <form className="form-card" onSubmit={handleSubmit}>
                <h3>{editing ? 'Edit Movie' : 'Add Movie'}</h3>
                {message && <div className="alert success">{message}</div>}
                {error && <div className="alert error">{error}</div>}

                <div className="form-row">
                    <div className="form-group">
                        <label>Movie Name</label>
                        <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
                    </div>
                    <div className="form-group">
                        <label>Release Date</label>
                        <input type="date" value={form.releaseDate} onChange={e => setForm({ ...form, releaseDate: e.target.value })} />
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label>Total Revenue ($)</label>
                        <input type="number" value={form.totalRevenue} onChange={e => setForm({ ...form, totalRevenue: e.target.value })} min="0" />
                    </div>
                    <div className="form-group">
                        <label>Director</label>
                        <select value={form.directorId} onChange={e => setForm({ ...form, directorId: e.target.value })} required>
                            <option value="">-- Select Director --</option>
                            {directors.map(d => (
                                <option key={d.id} value={d.id}>{d.fullName}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="form-group">
                    <label>Genres</label>
                    <div className="genre-checkboxes">
                        {genres.map(g => (
                            <label key={g.id} className="genre-check">
                                <input
                                    type="checkbox"
                                    checked={form.genreIds.includes(g.id)}
                                    onChange={() => toggleGenre(g.id)}
                                />
                                &nbsp;{g.name}
                            </label>
                        ))}
                    </div>
                </div>

                <div className="form-actions">
                    <button type="submit" className="btn primary">{editing ? 'Update' : 'Add'}</button>
                    {editing && <button type="button" className="btn secondary" onClick={reset}>Cancel</button>}
                </div>
            </form>

            <table className="data-table">
                <thead>
                    <tr><th>#</th><th>Name</th><th>Director</th><th>Release Date</th><th>Revenue</th><th>Genres</th><th>Actions</th></tr>
                </thead>
                <tbody>
                    {movies.length === 0 && <tr><td colSpan={7} className="empty">No movies found.</td></tr>}
                    {movies.map((m, i) => (
                        <tr key={m.id}>
                            <td>{i + 1}</td>
                            <td><strong>{m.name}</strong></td>
                            <td>{m.directorFullName}</td>
                            <td>{m.releaseDateF || '-'}</td>
                            <td>${m.totalRevenueF}</td>
                            <td>
                                {m.genresF && m.genresF.map(g => (
                                    <span key={g} className="genre-tag">{g}</span>
                                ))}
                            </td>
                            <td>
                                <button className="btn-sm edit" onClick={() => startEdit(m)}>Edit</button>
                                <button className="btn-sm delete" onClick={() => handleDelete(m.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
