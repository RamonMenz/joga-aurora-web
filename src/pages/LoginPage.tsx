import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/context/auth/useAuth";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Container } from "@/components/common/container";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { VALIDATION, TOAST_MESSAGES, ROUTES } from "@/util/constants";

const loginSchema = z.object({
  username: z
    .string()
    .min(
      VALIDATION.USERNAME.MIN_LENGTH,
      `O nome de usuário deve ter pelo menos ${VALIDATION.USERNAME.MIN_LENGTH} caracteres.`
    )
    .max(
      VALIDATION.USERNAME.MAX_LENGTH,
      "O nome de usuário é muito longo."
    ),
  password: z
    .string()
    .min(
      VALIDATION.PASSWORD.MIN_LENGTH,
      `A senha deve ter pelo menos ${VALIDATION.PASSWORD.MIN_LENGTH} caracteres.`
    )
    .max(
      VALIDATION.PASSWORD.MAX_LENGTH,
      "A senha é muito longa."
    ),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const LoginPage: React.FC = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);

    toast.promise(
      async () => {
        const result = await login(data.username, data.password);
        if (result && "error" in result) {
          throw new Error(
            result.error?.status === 401
              ? TOAST_MESSAGES.ERROR.UNAUTHORIZED
              : result.error.message || TOAST_MESSAGES.ERROR.LOGIN
          );
        }
        return { username: data.username };
      },
      {
        loading: TOAST_MESSAGES.LOADING.LOGIN,
        success: (data) => {
          navigate(ROUTES.HOME);
          return `Bem-vindo, ${data.username}!`;
        },
        error: (err) => err.message || TOAST_MESSAGES.ERROR.LOGIN,
      }
    );

    setLoading(false);
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate(ROUTES.HOME);
    }
  }, [isAuthenticated, navigate]);

  return (
    <Container className="px-2">
      <Card className="w-full max-w-md shadow-lg rounded-2xl border bg-card border-gray-200">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-semibold">
            Acesso ao Sistema
          </CardTitle>
        </CardHeader>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <CardContent className="space-y-4 mb-4">
            <div className="space-y-1">
              <Label htmlFor="username">Usuário</Label>
              <Input
                id="username"
                placeholder="Digite seu usuário"
                autoComplete="username"
                aria-invalid={!!errors.username}
                aria-describedby={errors.username ? "username-error" : undefined}
                {...register("username")}
                disabled={loading}
              />
              {errors.username && (
                <p id="username-error" className="text-sm text-red-500" role="alert">
                  {errors.username.message}
                </p>
              )}
            </div>
            <div className="space-y-1 relative">
              <Label htmlFor="password">Senha</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Digite sua senha"
                  autoComplete="current-password"
                  aria-invalid={!!errors.password}
                  aria-describedby={errors.password ? "password-error" : undefined}
                  {...register("password")}
                  disabled={loading}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p id="password-error" className="text-sm text-red-500" role="alert">
                  {errors.password.message}
                </p>
              )}
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-3">
            <Button
              type="submit"
              className={cn("w-full", loading && "opacity-70")}
              disabled={loading}
              aria-busy={loading}
            >
              {loading ? "Entrando..." : "Entrar"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </Container>
  );
};
