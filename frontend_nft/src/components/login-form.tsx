import { assets } from "../assets/assets";
import { cn } from "../lib/utils";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "./ui/field";
import { Input } from "./ui/input";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0 bg-white/10 backdrop-blur-md border border-pink-700 shadow-lg">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8">
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold text-pink-400 drop-shadow">
                  Welcome back
                </h1>
                <p className="text-gray-200">Login to your Antaboga account</p>
              </div>
              <Field>
                <FieldLabel htmlFor="email" className="text-gray-100">
                  Email
                </FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  className="bg-white/10 border border-pink-400 text-white placeholder-gray-300 focus:border-pink-500 focus:bg-white/20"
                />
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password" className="text-gray-100">
                    Password
                  </FieldLabel>
                  <a
                    href="#"
                    className="ml-auto text-sm text-pink-300 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  className="bg-white/10 border border-pink-400 text-white placeholder-gray-300 focus:border-pink-500 focus:bg-white/20"
                />
              </Field>
              <Field>
                <Button
                  type="submit"
                  className="bg-pink-500 hover:bg-pink-600 text-white font-semibold shadow"
                >
                  Login
                </Button>
              </Field>
              <FieldDescription className="text-center text-gray-200">
                Don't have an account?{" "}
                <a href="#" className="text-pink-400 hover:underline">
                  Sign up
                </a>
              </FieldDescription>
            </FieldGroup>
          </form>
          <div className="bg-muted relative hidden md:block">
            <img
              src={assets.ImgLogin}
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.3] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center text-gray-300">
        By clicking continue, you agree to our{" "}
        <a href="#" className="text-pink-400 hover:underline">
          Terms of Service
        </a>{" "}
        and{" "}
        <a href="#" className="text-pink-400 hover:underline">
          Privacy Policy
        </a>
        .
      </FieldDescription>
    </div>
  );
}
