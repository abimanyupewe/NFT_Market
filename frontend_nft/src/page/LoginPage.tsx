import { LoginForm } from "../components/login-form";

export default function LoginPage() {
  return (
    <div
      className="flex min-h-svh items-center justify-center p-6 md:p-10 bg-[#020617] relative"
      style={{ background: "#020617" }}
    >
      {/* Background grid & gradient */}
      <div
        className="absolute inset-0 z-0 w-full h-full"
        style={{
          background: "#020617",
          backgroundImage: `linear-gradient(
            to right,
            rgba(71, 85, 105, 0.15) 1px,
            transparent 1px
          ),
          linear-gradient(to bottom, rgba(71, 85, 105, 0.15) 1px, transparent 1px),
          radial-gradient(
            circle at 50% 60%,
            rgba(230, 46, 89, 0.15) 0%,
            rgba(168, 85, 247, 0.05) 40%,
            transparent 70%
          )`,
          backgroundSize: "40px 40px, 40px 40px, 100% 100%",
        }}
      />
      {/* Centered Login Form */}
      <div className="relative z-10 w-full max-w-sm md:max-w-4xl flex items-center justify-center">
        <LoginForm />
      </div>
    </div>
  );
}
