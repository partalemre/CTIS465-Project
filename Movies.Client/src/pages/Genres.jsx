import { useState, useEffect } from 'react';
import { getGenres, createGenre, updateGenre, deleteGenre } from '../services/api';

const empty = { name: '' };

export default function Genres() {
    const [genres, setGenres] = useState([]);
    const [form, setForm] = useState(empty);
    const [editing, setEditing] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => { load(); }, []);

    async function load() {
        const data = await getGenres();
        setGenres(data || []);
    }

    function startEdit(g) {
        setForm({ id: g.id, name: g.name });
        setEditing(true);
        setMessage(''); setError('');
    }

    function reset() {
        setForm(empty);
        setEditing(false);
        setMessage(''); setError('');
    }

    async function handleSubmit(e) {
        e.preventDefault();
        const res = editing ? await updateGenre(form) : await createGenre(form);
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
        if (!window.confirm('Delete this genre?')) return;
        const res = await deleteGenre(id);
        if (res && !res.isSuccessful) { setError(res.message); return; }
        load();
    }

    return (
        <div className="page">
            <h2>Genres</h2>

            <form className="form-card" onSubmit={handleSubmit}>
                <h3>{editing ? 'Edit Genre' : 'Add Genre'}</h3>
                {message && <div className="alert success">{message}</div>}
                {error && <div className="alert error">{error}</div>}
                <div className="form-group">
                    <label>Genre Name</label>
                    <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
                </div>
                <div className="form-actions">
                    <button type="submit" className="btn primary">{editing ? 'Update' : 'Add'}</button>
                    {editing && <button type="button" className="btn secondary" onClick={reset}>Cancel</button>}
                </div>
            </form>

            <table className="data-table">
                <thead>
                    <tr><th>#</th><th>Name</th><th>Actions</th></tr>
                </thead>
                <tbody>
                    {genres.length === 0 && <tr><td colSpan={3} className="empty">No genres found.</td></tr>}
                    {genres.map((g, i) => (
                        <tr key={g.id}>
                            <td>{i + 1}</td>
                            <td>{g.name}</td>
                            <td>
                                <button className="btn-sm edit" onClick={() => startEdit(g)}>Edit</button>
                                <button className="btn-sm delete" onClick={() => handleDelete(g.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
