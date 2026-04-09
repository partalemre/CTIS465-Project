import { useState, useEffect } from 'react';
import { getDirectors, createDirector, updateDirector, deleteDirector } from '../services/api';

const empty = { firstName: '', lastName: '', isRetired: false };

export default function Directors() {
    const [directors, setDirectors] = useState([]);
    const [form, setForm] = useState(empty);
    const [editing, setEditing] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => { load(); }, []);

    async function load() {
        const data = await getDirectors();
        setDirectors(data || []);
    }

    function startEdit(d) {
        setForm({ id: d.id, firstName: d.firstName, lastName: d.lastName, isRetired: d.isRetired });
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
        const res = editing ? await updateDirector(form) : await createDirector(form);
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
        if (!window.confirm('Delete this director?')) return;
        const res = await deleteDirector(id);
        if (res && !res.isSuccessful) { setError(res.message); return; }
        load();
    }

    return (
        <div className="page">
            <h2>Directors</h2>

            <form className="form-card" onSubmit={handleSubmit}>
                <h3>{editing ? 'Edit Director' : 'Add Director'}</h3>
                {message && <div className="alert success">{message}</div>}
                {error && <div className="alert error">{error}</div>}
                <div className="form-row">
                    <div className="form-group">
                        <label>First Name</label>
                        <input value={form.firstName} onChange={e => setForm({ ...form, firstName: e.target.value })} required />
                    </div>
                    <div className="form-group">
                        <label>Last Name</label>
                        <input value={form.lastName} onChange={e => setForm({ ...form, lastName: e.target.value })} required />
                    </div>
                </div>
                <div className="form-group checkbox-group">
                    <label>
                        <input type="checkbox" checked={form.isRetired} onChange={e => setForm({ ...form, isRetired: e.target.checked })} />
                        &nbsp;Is Retired
                    </label>
                </div>
                <div className="form-actions">
                    <button type="submit" className="btn primary">{editing ? 'Update' : 'Add'}</button>
                    {editing && <button type="button" className="btn secondary" onClick={reset}>Cancel</button>}
                </div>
            </form>

            <table className="data-table">
                <thead>
                    <tr><th>#</th><th>Full Name</th><th>Status</th><th>Actions</th></tr>
                </thead>
                <tbody>
                    {directors.length === 0 && <tr><td colSpan={4} className="empty">No directors found.</td></tr>}
                    {directors.map((d, i) => (
                        <tr key={d.id}>
                            <td>{i + 1}</td>
                            <td>{d.fullName}</td>
                            <td><span className={`badge ${d.isRetired ? 'retired' : 'active'}`}>{d.isRetiredF}</span></td>
                            <td>
                                <button className="btn-sm edit" onClick={() => startEdit(d)}>Edit</button>
                                <button className="btn-sm delete" onClick={() => handleDelete(d.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
