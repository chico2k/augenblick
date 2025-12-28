import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import LoginForm from "../components/LoginForm";
import { auth } from "../lib/auth";

/**
 * Login page for admin authentication.
 *
 * Features:
 * - Minimal layout (no site navigation/footer via _app.tsx override)
 * - Centered login form with LoginForm component
 * - German language labels
 * - Redirects to /office on successful login
 * - Server-side session check for authenticated user redirect
 *
 * Note: No registration or forgot password links per spec.
 */
const LoginPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Anmelden - Augenblick Chiemgau</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <div>
            <h1 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
              Anmelden
            </h1>
            <p className="mt-2 text-center text-sm text-gray-600">
              Augenblick Chiemgau - Verwaltung
            </p>
          </div>
          <LoginForm />
        </div>
      </div>
    </>
  );
};

export default LoginPage;

/**
 * Server-side session check.
 * Redirects authenticated users to /office.
 * This ensures the page is server-rendered and middleware runs correctly.
 */
export const getServerSideProps: GetServerSideProps = async (context) => {
  // Convert Node.js headers to Web API Headers for Better Auth
  const headers = new Headers();
  Object.entries(context.req.headers).forEach(([key, value]) => {
    if (value) {
      headers.set(key, Array.isArray(value) ? value.join(", ") : value);
    }
  });

  // Check if user is already authenticated
  const session = await auth.api.getSession({ headers });

  if (session) {
    // Redirect authenticated users to /office
    return {
      redirect: {
        destination: "/office",
        permanent: false,
      },
    };
  }

  return { props: {} };
};
