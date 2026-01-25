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

  const isDateOnlyISO = /^\d{4}-\d{2}-\d{2}$/.test(createdAt);

  let createdOnDate;
  if (isDateOnlyISO) {
    const [year, month, day] = createdAt.split('-').map(Number);
    createdOnDate = new Date(year, month - 1, day); // local date
  } else {
    createdOnDate = new Date(createdAt);
  }

  const createdOn = createdOnDate.toLocaleDateString(locale ?? undefined);

  return (
    <div>
      <h2>Hello, {userName}!</h2>
      <p>You have {messageCount} new messages</p>
      <p>Your account was created on {createdOn}</p>
    </div>
  );
}
