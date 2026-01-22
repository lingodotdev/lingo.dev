import './CodeComparison.css'

function CodeComparison({ before, after }) {
    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text)
    }

    return (
        <div className="code-comparison">
            <div className="comparison-header">
                <h3>Before/After Comparison</h3>
                <p>See what MCP generates for you automatically</p>
            </div>

            <div className="comparison-container">
                {/* Before Code */}
                <div className="comparison-panel">
                    <div className="panel-header before-header">
                        <span className="panel-title">
                            <span className="panel-icon">📄</span>
                            Before
                        </span>
                        <button
                            className="copy-btn"
                            onClick={() => copyToClipboard(before)}
                            title="Copy code"
                        >
                            📋
                        </button>
                    </div>
                    <pre className="code-content">
                        <code>{before}</code>
                    </pre>
                </div>

                {/* Arrow */}
                <div className="comparison-arrow">
                    <div className="arrow-icon">→</div>
                    <div className="arrow-label">MCP Magic</div>
                </div>

                {/* After Code */}
                <div className="comparison-panel">
                    <div className="panel-header after-header">
                        <span className="panel-title">
                            <span className="panel-icon">✨</span>
                            After
                        </span>
                        <button
                            className="copy-btn"
                            onClick={() => copyToClipboard(after)}
                            title="Copy code"
                        >
                            📋
                        </button>
                    </div>
                    <pre className="code-content">
                        <code>{after}</code>
                    </pre>
                </div>
            </div>
        </div>
    )
}

export default CodeComparison
