import SignUp from "../../components/auth/sign-up";
import AuthLayout from "../../components/auth/auth-layout";

export default function SignUpPage() {
  return (
    <AuthLayout
      eyebrow="Join DehatWala"
      title="Create your account"
      description="Start with your mobile number. We’ll verify it securely before creating your account."
    >
      <SignUp />
    </AuthLayout>
  );
}
