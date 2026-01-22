import { useState } from 'react'
import { Link } from 'react-router-dom'
import { tutorials, frameworkFilters } from '../data/tutorialData'
import './TutorialsPage.css'

function TutorialsPage() {
    const [activeFilter, setActiveFilter] = useState('all')

    const filteredTutorials = activeFilter === 'all'
        ? tutorials
        : tutorials.filter(t => {
            if (activeFilter === 'nextjs') return t.framework === 'Next.js'
            if (activeFilter === 'react-router') return t.framework === 'React Router'
            if (activeFilter === 'tanstack') return t.framework === 'TanStack Start'
            return false
        })

    return (
        <div className="tutorials-page">
            <section className="tutorials-header section">
                <div className="container">
                    <h1 className="gradient-text">Interactive Tutorials</h1>
                    <p className="section-subtitle">
                        Step-by-step guides to master Lingo.dev MCP for your favorite React frameworks
                    </p>
                </div>
            </section>

            <section className="tutorials-content">
                <div className="container">
                    {/* Filter Buttons */}
                    <div className="filter-tabs">
                        {frameworkFilters.map(filter => (
                            <button
                                key={filter.id}
                                className={`filter-tab ${activeFilter === filter.id ? 'active' : ''}`}
                                onClick={() => setActiveFilter(filter.id)}
                            >
                                {filter.label}
                                <span className="filter-count">{filter.count}</span>
                            </button>
                        ))}
                    </div>

                    {/* Tutorials Grid */}
                    <div className="tutorials-grid">
                        {filteredTutorials.map(tutorial => (
                            <Link
                                key={tutorial.id}
                                to={`/tutorials/${tutorial.id}`}
                                className="tutorial-card card"
                            >
                                <div className="tutorial-header">
                                    <div className="tutorial-icon">{tutorial.icon}</div>
                                    <div className="tutorial-badges">
                                        <span className={`badge badge-${tutorial.difficulty.toLowerCase() === 'beginner' ? 'success' : 'warning'}`}>
                                            {tutorial.difficulty}
                                        </span>
                                    </div>
                                </div>

                                <h3>{tutorial.title}</h3>
                                <p className="tutorial-description">{tutorial.description}</p>

                                <div className="tutorial-meta">
                                    <span className="meta-item">
                                        <span className="meta-icon">📚</span>
                                        {tutorial.framework}
                                    </span>
                                    <span className="meta-item">
                                        <span className="meta-icon">⏱️</span>
                                        {tutorial.duration}
                                    </span>
                                    <span className="meta-item">
                                        <span className="meta-icon">📝</span>
                                        {tutorial.steps.length} steps
                                    </span>
                                </div>

                                <div className="tutorial-action">
                                    <span className="btn-text">Start Tutorial →</span>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {filteredTutorials.length === 0 && (
                        <div className="empty-state">
                            <div className="empty-icon">📦</div>
                            <h3>No tutorials found</h3>
                            <p>Tutorials for this framework are coming soon!</p>
                        </div>
                    )}
                </div>
            </section>
        </div>
    )
}

export default TutorialsPage
