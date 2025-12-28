import type { GetServerSideProps, NextPage } from "next";
import { auth, type User } from "../../lib/auth";
import OfficeLayout from "../../components/OfficeLayout";

interface OfficePageProps {
  user: User;
}

/**
 * Protected office page for admin management.
 *
 * Features:
 * - Server-side session validation via getServerSideProps
 * - Redirects to /login if not authenticated
 * - Displays authenticated user information
 * - Uses OfficeLayout with header and sign-out button
 *
 * This page serves as the landing page for the authenticated admin area.
 * Additional office features will be linked from here.
 */
const OfficePage: NextPage<OfficePageProps> = ({ user }) => {
  return (
    <OfficeLayout user={user}>
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-lg bg-white p-6 shadow">
          <h1 className="text-2xl font-bold text-gray-900">Verwaltung</h1>
          <p className="mt-2 text-gray-600">
            Willkommen, {user.name ?? user.email}!
          </p>
          <div className="mt-6">
            <p className="text-sm text-gray-500">
              Verwaltungsbereich für Augenblick Chiemgau
            </p>
          </div>
        </div>
      </div>
    </OfficeLayout>
  );
};

/**
 * Server-side session validation.
 *
 * This provides defense-in-depth beyond middleware:
 * - Middleware uses optimistic cookie-based checking
 * - This performs full session validation against the database
 *
 * If no valid session exists, redirects to /login.
 */
export const getServerSideProps: GetServerSideProps<OfficePageProps> = async (
  context
) => {
  // Convert Node.js IncomingHttpHeaders to Headers object for Better Auth
  const headersList = new Headers();
  for (const [key, value] of Object.entries(context.req.headers)) {
    if (value) {
      headersList.set(key, Array.isArray(value) ? value.join(", ") : value);
    }
  }

  const session = await auth.api.getSession({
    headers: headersList,
  });

  if (!session) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  return {
    props: {
      user: {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        emailVerified: session.user.emailVerified,
        image: session.user.image,
        createdAt: session.user.createdAt.toISOString(),
        updatedAt: session.user.updatedAt.toISOString(),
      } as unknown as User,
    },
  };
};

export default OfficePage;
