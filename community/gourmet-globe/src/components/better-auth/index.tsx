import Section from "../common/section";
import LogoutButton from "./logout-button";
import AuthButtons from "./auth-buttons";

interface BetterAuthProps {
  userEmail?: string;
}

export default function BetterAuth({ userEmail }: BetterAuthProps) {
  const isLoggedIn = !!userEmail;
  return (
    <Section title={<span data-lingo-skip>Better Auth</span>}>
      {isLoggedIn ? <LogoutButton userEmail={userEmail} /> : <AuthButtons />}
    </Section>
  );
}
