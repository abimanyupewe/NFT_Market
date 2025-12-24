import { RegisterForm } from "../components/register-form";

export default function RegisterAuthorPage() {
    return (
        <div
            className="flex min-h-svh items-center justify-center p-6 md:p-10 bg-bg-primary relative"
        >
            {/* Background grid & gradient */}
            <div
                className="absolute inset-0 z-0 w-full h-full"
                style={{
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
            {/* Centered Register Form */}
            <div className="relative z-10 w-full max-w-4xl flex items-center justify-center">
                <RegisterForm
                    role="author"
                    title="Join as Creator"
                    subtitle="Start your journey as an NFT Creator"
                    signInUrl="/sign-in-author"
                />
            </div>
        </div>
    );
}
