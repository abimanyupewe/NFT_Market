import { RegisterForm } from "../components/register-form";

export default function Register() {
    return (
        <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-[#09090b]">
            <div className="w-full max-w-4xl">
                <RegisterForm
                    role="author"
                    title="Join as Creator"
                    subtitle="Start your journey as an NFT Creator"
                    signInUrl="/login"
                />
            </div>
        </div>
    );
}
