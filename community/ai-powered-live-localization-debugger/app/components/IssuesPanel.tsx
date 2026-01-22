import React from "react";

interface IssuesPanelProps {
  issues: {
    missingKeys?: Array<{
      key: string;
      sourceText: string;
    }>;
    semanticIssues?: Array<{
      key: string;
      sourceText: string;
      targetText: string;
      reason: string;
    }>;
    hardcodedStrings?: Array<{
      text: string;
      line?: number;
    }>;
  } | null;
}

const IssuesPanel: React.FC<IssuesPanelProps> = ({ issues }) => {
  const hasIssues =
    issues &&
    (issues.missingKeys?.length ||
      issues.semanticIssues?.length ||
      issues.hardcodedStrings?.length);

  return (
    <section className="card p-4 md:p-5 flex flex-col gap-4 h-full">

      <div>
        <h2 className="text-lg font-semibold text-foreground">
          Issues Detected
        </h2>
        <p className="text-sm text-muted">
          Localization and internationalization problems found in your input.
        </p>
      </div>
      {!hasIssues && (
        <div className="flex flex-1 items-center justify-center text-sm text-muted border border-border rounded-lg bg-surface-muted">
          No issues detected yet.
        </div>
      )}

      {hasIssues && (
        <div className="flex flex-col gap-4 overflow-auto">
          {issues?.missingKeys && issues.missingKeys.length > 0 && (
            <IssueGroup
              title="Missing Translations"
              count={issues.missingKeys.length}
              variant="error"
            >
              {issues.missingKeys.map((item, index) => (
                <IssueItem
                  key={index}
                  title={item.key}
                  description={`Source text: "${item.sourceText}"`}
                />
              ))}
            </IssueGroup>
          )}

          {issues?.semanticIssues && issues.semanticIssues.length > 0 && (
            <IssueGroup
              title="Semantic Inconsistencies"
              count={issues.semanticIssues.length}
              variant="warning"
            >
              {issues.semanticIssues.map((item, index) => (
                <IssueItem
                  key={index}
                  title={item.key}
                  description={item.reason}
                />
              ))}
            </IssueGroup>
          )}

          {issues?.hardcodedStrings && issues.hardcodedStrings.length > 0 && (
            <IssueGroup
              title="Hardcoded UI Strings"
              count={issues.hardcodedStrings.length}
              variant="error"
            >
              {issues.hardcodedStrings.map((item, index) => (
                <IssueItem
                  key={index}
                  title={`"${item.text}"`}
                  description={
                    item.line
                      ? `Detected near line ${item.line}`
                      : "Detected in source code"
                  }
                />
              ))}
            </IssueGroup>
          )}
        </div>
      )}
    </section>
  );
};

export default IssuesPanel;

interface IssueGroupProps {
  title: string;
  count: number;
  variant: "error" | "warning";
  children: React.ReactNode;
}

const IssueGroup: React.FC<IssueGroupProps> = ({
  title,
  count,
  variant,
  children,
}) => {
  const color =
    variant === "error"
      ? "text-error"
      : "text-warning";

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <h3 className={`text-sm font-medium ${color}`}>
          {title}
        </h3>
        <span className="text-xs text-muted">
          {count}
        </span>
      </div>

      <div className="flex flex-col gap-2">
        {children}
      </div>
    </div>
  );
};

interface IssueItemProps {
  title: string;
  description: string;
}

const IssueItem: React.FC<IssueItemProps> = ({ title, description }) => {
  return (
    <div className="rounded-lg border border-border bg-surface-muted p-3">
      <p className="text-sm font-medium text-foreground">
        {title}
      </p>
      <p className="text-xs text-muted mt-1">
        {description}
      </p>
    </div>
  );
};
