/**
 * React component example.
 *
 * @param {Object} props - Component props
 * @param {string} props.userName - User name
 * @param {number} props.messageCount - Number of messages
 * @param {string} props.createdAt - ISO date string for account creation date
 * @returns {JSX.Element}
 */

import { useLingoLocale } from 'lingo.dev/react/client';
  
  export default function DynamicComponent({ userName, messageCount, createdAt }) {
    const locale = useLingoLocale();
    const createdOn = new Date(createdAt).toLocaleDateString(locale ?? undefined);
    return (
      <div>
        <h2>Hello, {userName}!</h2>
        <p>You have {messageCount} new messages</p>
        <p>Your account was created on {createdOn}</p>
      </div>
    );
  }
  
  