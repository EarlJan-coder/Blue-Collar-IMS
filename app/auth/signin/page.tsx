'use client';
import { signIn } from 'next-auth/react';

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background text-foreground p-4">
      <div className="w-full max-w-md space-y-8 rounded-2xl bg-card border border-border p-6 shadow-sm">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Sign In</h1>
          <p className="text-muted-foreground">Sign in with your Google account</p>
        </div>
        <button
          onClick={() => signIn('google', { callbackUrl: '/' })}
          className="w-full rounded-2xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring"
        >
          Sign in with Google
        </button>
      </div>
    </div>
  );
}