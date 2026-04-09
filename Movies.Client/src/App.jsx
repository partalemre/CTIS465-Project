import { useState } from 'react';
import Directors from './pages/Directors';
import Genres from './pages/Genres';
import Movies from './pages/Movies';
import './index.css';

const tabs = ['Movies', 'Directors', 'Genres'];

function App() {
    const [activeTab, setActiveTab] = useState('Movies');

    return (
        <div>
            <header className="app-header">
                <h1>🎬 Movies Microservice</h1>
                <nav className="tab-nav">
                    {tabs.map(tab => (
                        <button
                            key={tab}
                            className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
                            onClick={() => setActiveTab(tab)}
                        >
                            {tab}
                        </button>
                    ))}
                </nav>
            </header>

            <main className="app-main">
                {activeTab === 'Movies' && <Movies />}
                {activeTab === 'Directors' && <Directors />}
                {activeTab === 'Genres' && <Genres />}
            </main>
        </div>
    );
}

export default App;
