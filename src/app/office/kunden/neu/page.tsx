/**
 * New Customer Page
 * Server component that renders the CustomerForm in create mode.
 */

import { CustomerForm } from "@/components/customers/customer-form";

export const metadata = {
  title: "Neuer Kunde",
  description: "Erstellen Sie einen neuen Kunden",
};

/**
 * Page for creating a new customer.
 * Renders the CustomerForm component in create mode.
 */
export default function NewCustomerPage() {
  return (
    <div className="container max-w-2xl py-6">
      <CustomerForm mode="create" />
    </div>
  );
}
