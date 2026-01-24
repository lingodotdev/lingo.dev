import { useLingoLocale } from 'lingo.dev/react/client';
  
  export default function DynamicComponent({ userName, messageCount }) {
    const locale = useLingoLocale();
    const createdOn = new Date().toLocaleDateString(locale ?? undefined);
    return (
      <div>
        <h2>Hello, {userName}!</h2>
        <p>You have {messageCount} new messages</p>
        <p>Your account was created on {createdOn}</p>
      </div>
    );
  }
  
  