"use client";

import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { registerCustomer } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function SignupForm({ onToggle }: { onToggle: () => void }) {
  const router = useRouter();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!firstName || !lastName || !email || !phone || !address || !password) {
      setError("Todos los campos son obligatorios.");
      return;
    }

    setLoading(true);
    try {
      const customer = await registerCustomer({
        firstName,
        lastName,
        email,
        phone,
        address,
        password,
      });

      // Store customer in localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("customer", JSON.stringify(customer));
      }

      setSuccess("Cuenta creada correctamente. Redirigiendo…");

      setTimeout(() => {
        router.push("/");
      }, 800);
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error ? err.message : "Ocurrió un error al registrarse."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="shadow-input mx-auto w-full max-w-md rounded-none bg-white p-4 md:rounded-2xl md:p-8 dark:bg-zinc-900/95 dark:backdrop-blur-sm dark:border dark:border-zinc-800/50">
      <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-200">
        Bienvenido a Farma
      </h2>
      <p className="mt-2 max-w-sm text-sm text-neutral-600 dark:text-neutral-300">
        Regístrate para empezar a usar Farma.
      </p>

      <form className="my-8 space-y-4" onSubmit={handleSubmit}>
        <div className="flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-2">
          <LabelInputContainer>
            <Label htmlFor="name">Nombre</Label>
            <Input
              id="name"
              placeholder="Carlos"
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </LabelInputContainer>
          <LabelInputContainer>
            <Label htmlFor="lastname">Apellido</Label>
            <Input
              id="lastname"
              placeholder="Graterol"
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </LabelInputContainer>
        </div>

        <LabelInputContainer>
          <Label htmlFor="email">Correo electrónico</Label>
          <Input
            id="email"
            placeholder="carlos@farmatodo.com"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </LabelInputContainer>

        <LabelInputContainer>
          <Label htmlFor="phone">Teléfono</Label>
          <Input
            id="phone"
            placeholder="04241234567"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </LabelInputContainer>

        <LabelInputContainer>
          <Label htmlFor="address">Dirección</Label>
          <Input
            id="address"
            placeholder="Calle 123, Caracas, Venezuela"
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </LabelInputContainer>

        <LabelInputContainer>
          <Label htmlFor="password">Contraseña</Label>
          <Input
            id="password"
            placeholder="••••••••"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </LabelInputContainer>

        {error && (
          <p className="text-sm font-medium text-red-500 dark:text-red-400">
            {error}
          </p>
        )}
        {success && (
          <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
            {success}
          </p>
        )}

        <button
          className="group/btn relative mt-2 flex h-10 w-full items-center justify-center rounded-md bg-gradient-to-br from-black to-neutral-600 text-sm font-medium text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] disabled:cursor-not-allowed disabled:opacity-60 dark:bg-zinc-800 dark:from-zinc-900 dark:to-zinc-900 dark:shadow-[0px_1px_0px_0px_#27272a_inset,0px_-1px_0px_0px_#27272a_inset]"
          type="submit"
          disabled={loading}
        >
          {loading ? "Creando cuenta..." : "Crear cuenta →"}
          <BottomGradient />
        </button>

        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={onToggle}
            className="text-sm text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-200"
          >
            ¿Ya tienes cuenta?{" "}
            <span className="font-semibold text-black dark:text-white">
              Inicia sesión aquí
            </span>
          </button>
        </div>
      </form>
    </div>
  );
}

const BottomGradient = () => {
  return (
    <>
      <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
      <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
    </>
  );
};

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex w-full flex-col space-y-2", className)}>
      {children}
    </div>
  );
};
