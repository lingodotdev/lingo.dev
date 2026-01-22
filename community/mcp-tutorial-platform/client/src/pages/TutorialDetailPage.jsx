import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getTutorialById } from '../data/tutorialData'
import CodeComparison from '../components/CodeComparison'
import './TutorialDetailPage.css'

function TutorialDetailPage() {
    const { id } = useParams()
    const tutorial = getTutorialById(id)
    const [currentStep, setCurrentStep] = useState(0)

    if (!tutorial) {
        return (
            <div className="tutorial-detail-page">
                <div className="container section">
                    <div className="error-state">
                        <h2>Tutorial not found</h2>
                        <Link to="/tutorials" className="btn btn-primary">
                            ← Back to Tutorials
                        </Link>
                    </div>
                </div>
            </div>
        )
    }

    const step = tutorial.steps[currentStep]
    const isFirstStep = currentStep === 0
    const isLastStep = currentStep === tutorial.steps.length - 1

    const handleNext = () => {
        if (!isLastStep) setCurrentStep(currentStep + 1)
    }

    const handlePrev = () => {
        if (!isFirstStep) setCurrentStep(currentStep - 1)
    }

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text)
    }

    return (
        <div className="tutorial-detail-page">
            {/* Tutorial Header */}
            <section className="tutorial-detail-header section">
                <div className="container">
                    <Link to="/tutorials" className="back-link">
                        ← Back to Tutorials
                    </Link>

                    <div className="tutorial-intro">
                        <div className="tutorial-intro-icon">{tutorial.icon}</div>
                        <div className="tutorial-intro-content">
                            <h1>{tutorial.title}</h1>
                            <p>{tutorial.description}</p>

                            <div className="tutorial-intro-meta">
                                <span className={`badge badge-${tutorial.difficulty.toLowerCase() === 'beginner' ? 'success' : 'warning'}`}>
                                    {tutorial.difficulty}
                                </span>
                                <span className="meta-text">📚 {tutorial.framework}</span>
                                <span className="meta-text">⏱️ {tutorial.duration}</span>
                                <span className="meta-text">📝 {tutorial.steps.length} steps</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Progress Bar */}
            <div className="progress-bar-container">
                <div className="container">
                    <div className="progress-bar">
                        <div
                            className="progress-fill"
                            style={{ width: `${((currentStep + 1) / tutorial.steps.length) * 100}%` }}
                        />
                    </div>
                    <div className="progress-text">
                        Step {currentStep + 1} of {tutorial.steps.length}
                    </div>
                </div>
            </div>

            {/* Tutorial Content */}
            <section className="tutorial-content section">
                <div className="container-wide">
                    <div className="step-content">
                        {/* Step Header */}
                        <div className="step-header">
                            <div className="step-number">Step {currentStep + 1}</div>
                            <h2>{step.title}</h2>
                            <p className="step-description">{step.description}</p>
                            {step.mcpPrompt && (
                                <div className="mcp-badge">
                                    <span className="badge badge-primary">MCP Prompt</span>
                                </div>
                            )}
                        </div>

                        {/* Step Code or Comparison */}
                        {step.code && (
                            <div className="code-block-container">
                                <div className="code-block-header">
                                    <span className="code-language">{step.language || 'code'}</span>
                                    <button
                                        className="btn btn-secondary btn-sm"
                                        onClick={() => copyToClipboard(step.code)}
                                    >
                                        📋 Copy
                                    </button>
                                </div>
                                <pre className="code-block">
                                    <code>{step.code}</code>
                                </pre>
                            </div>
                        )}

                        {step.beforeAfter && (
                            <CodeComparison
                                before={step.beforeAfter.before}
                                after={step.beforeAfter.after}
                            />
                        )}

                        {/* Navigation */}
                        <div className="step-navigation">
                            <button
                                className="btn btn-secondary"
                                onClick={handlePrev}
                                disabled={isFirstStep}
                            >
                                ← Previous
                            </button>

                            {!isLastStep ? (
                                <button
                                    className="btn btn-primary"
                                    onClick={handleNext}
                                >
                                    Next Step →
                                </button>
                            ) : (
                                <Link to="/tutorials" className="btn btn-primary">
                                    Complete ✓
                                </Link>
                            )}
                        </div>
                    </div>

                    {/* Steps Sidebar */}
                    <div className="steps-sidebar card">
                        <h3>Tutorial Steps</h3>
                        <div className="steps-list">
                            {tutorial.steps.map((s, index) => (
                                <button
                                    key={index}
                                    className={`step-item ${index === currentStep ? 'active' : ''} ${index < currentStep ? 'completed' : ''}`}
                                    onClick={() => setCurrentStep(index)}
                                >
                                    <span className="step-item-number">
                                        {index < currentStep ? '✓' : index + 1}
                                    </span>
                                    <span className="step-item-title">{s.title}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default TutorialDetailPage
