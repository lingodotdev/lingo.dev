
  
  export default function DynamicComponent({ userName, messageCount }) {
    return (
      <div>
        <h2>Hello, {userName}!</h2>
        <p>You have {messageCount} new messages</p>
        <p>Your account was created on {new Date().toLocaleDateString()}</p>
      </div>
    );
  }
  
  // Lingo.dev Compiler intelligently handles:
  // - Variables like {userName} and {messageCount} stay as variables
  // - Date formatting expressions are preserved
  // - Only the static text gets translated
  // 
  // Result in Spanish:
  // "Hola, {userName}!"
  // "Tienes {messageCount} mensajes nuevos"
  // The variables work exactly the same in all languages!