import { useState, useContext } from "react";
import { assets } from "../assets/assets";
import { cn } from "../lib/util";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Field, FieldGroup, FieldLabel } from "./ui/field";
import { Input } from "./ui/input";
import { Eye, EyeOff } from "lucide-react";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";

export interface RegisterFormProps extends React.ComponentProps<"div"> {
  role?: string;
  title?: string;
  subtitle?: string;
  signInUrl?: string;
}

export function RegisterForm({
  className,
  role = "customer",
  title = "Create Account",
  subtitle = "Join the future of NFT Marketplace",
  signInUrl = "/sign-in",
  ...props
}: RegisterFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { register } = useContext(AppContext)!;
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);

    // Inject role into data
    const registrationData = { ...data, role };

    // Attempt Register
    const success = await register(registrationData);

    if (success) {
      if (role === 'author') {
        navigate("/author/dashboard");
      } else {
        navigate("/");
      }
    }
    setLoading(false);
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0 bg-secondary/10 backdrop-blur-3xl border-border/5 shadow-2xl text-white">
        <CardContent className="grid p-0 md:grid-cols-2 min-h-[500px]">
          <form onSubmit={handleSubmit} className="p-8 md:p-10 flex flex-col justify-center gap-6">
            <div className="flex flex-col gap-2">
              <h1 className="text-3xl font-bold tracking-tight">
                {title}
              </h1>
              <p className="text-sm">
                {subtitle}
              </p>
            </div>

            <FieldGroup className="gap-5">
              <Field>
                <FieldLabel htmlFor="username">Username</FieldLabel>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="username"
                  required
                  className="border-white/10 focus:border-pink-500/50 transition-colors h-11"
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="name@example.com"
                  required
                  className="border-white/10 focus:border-pink-500/50 transition-colors h-11"
                />
              </Field>

              <div className="grid gap-5 md:grid-cols-2">
                <Field>
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      required
                      className="border-white/10 focus:border-pink-500/50 transition-colors h-11 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </Field>
                <Field>
                  <FieldLabel htmlFor="confirm_password">Confirm</FieldLabel>
                  <div className="relative">
                    <Input
                      id="confirm_password"
                      name="confirm_password"
                      type={showConfirmPassword ? "text" : "password"}
                      required
                      className="border-white/10 focus:border-pink-500/50 transition-colors h-11 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </Field>
              </div>

              <Button
                type="submit"
                size="lg"
                disabled={loading}
                className="w-full mt-2 bg-primary hover:bg-primary/80 text-white font-bold shadow-lg shadow-pink-500/20 border-0"
              >
                {loading ? "Creating..." : "Create Account"}
              </Button>
            </FieldGroup>

            <div className="text-center text-sm text-white">
              Already have an account?{" "}
              <a href={signInUrl} className="font-semibold text-primary hover:text-primary/80 transition-colors">
                Sign in
              </a>
            </div>
          </form>

          <div className="relative hidden md:block w-full h-full bg-muted">
            <div className="absolute inset-0 bg-linear-to-t from-bg-primary via-transparent to-transparent z-10" />
            <img
              src={assets.ImgLogin}
              alt="Login Visual"
              className="h-full w-full object-cover transition-transform hover:scale-105 duration-700"
            />
          </div>
        </CardContent>
      </Card>

      <p className="text-center text-xs text-muted-foreground px-8">
        By clicking continue, you agree to our{" "}
        <a href="#" className="hover:text-primary underline underline-offset-4">
          Terms of Service
        </a>{" "}
        and{" "}
        <a href="#" className="hover:text-primary underline underline-offset-4">
          Privacy Policy
        </a>
        .
      </p>
    </div>
  );
}
