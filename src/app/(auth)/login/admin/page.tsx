"use client";

import { LogIn, Shield } from "lucide-react";
import { useRouter } from "next/navigation";
import * as React from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

type FormData = {
  email: string;
  password: string;
};

export default function AdminLoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const form = useForm<FormData>({
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(values: FormData) {
    setIsLoading(true);
    setError(null);
    const { adminLogin } = await import("@/app/actions/admin/user");
    const res = await adminLogin(values.email, values.password);
    if (!res.success) {
      setError(res.message);
    } else {
      router.push("/admin");
    }

    setIsLoading(false);
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <Card className="w-full max-w-md sm:min-w-sm shadow-lg">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto w-12 h-12 rounded-2xl grid place-items-center bg-muted">
            <Shield className="w-6 h-6" />
          </div>
          <CardTitle>ورود ادمین</CardTitle>
          <CardDescription>برای دسترسی به پنل مدیریت وارد شوید</CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-5"
              dir="rtl"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ایمیل</FormLabel>
                    <FormControl>
                      <Input placeholder="admin@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>رمز عبور</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {error && <p className="text-destructive text-sm">{error}</p>}

              <Button type="submit" className="w-full" disabled={isLoading}>
                <LogIn className="mr-2 h-4 w-4" />
                {isLoading ? "در حال ورود…" : "ورود"}
              </Button>
            </form>
          </Form>
        </CardContent>

        <CardFooter className="justify-center text-xs text-muted-foreground">
          فقط برای ادمین‌های مجاز
        </CardFooter>
      </Card>
    </div>
  );
}
