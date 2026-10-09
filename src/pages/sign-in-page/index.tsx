import SignIn from "../../components/auth/sign-in";
import AuthLayout from "../../components/auth/auth-layout";

export default function SignInPage() {
  return (
    <AuthLayout
      eyebrow="Welcome back"
      title="Sign in to your account"
      description="Enter your mobile number and we’ll send you a one-time password to sign in securely."
    >
      <SignIn />
    </AuthLayout>
  );
}
