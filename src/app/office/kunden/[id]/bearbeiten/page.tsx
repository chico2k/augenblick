/**
 * Edit Customer Page
 * Server component that fetches customer data and renders the CustomerForm in edit mode.
 */

import { notFound } from "next/navigation";
import { CustomerForm } from "@/components/customers/customer-form";
import { customerService } from "@/lib/services/customer.service";
import { isErrResult } from "@/lib/services/types";

export const metadata = {
  title: "Kunde bearbeiten",
  description: "Bearbeiten Sie die Kundendaten",
};

interface EditCustomerPageProps {
  params: Promise<{ id: string }>;
}

/**
 * Page for editing an existing customer.
 * Fetches customer data and renders the CustomerForm in edit mode with pre-filled values.
 */
export default async function EditCustomerPage({
  params,
}: EditCustomerPageProps) {
  const { id } = await params;

  // Fetch customer data
  const result = await customerService.getById(id);

  if (isErrResult(result)) {
    notFound();
  }

  const customer = result.value;

  // Map customer data to form values
  const defaultValues = {
    firstName: customer.firstName,
    lastName: customer.lastName,
    email: customer.email ?? "",
    phone: customer.phone ?? "",
    notes: customer.notes ?? "",
  };

  return (
    <div className="container max-w-2xl py-6">
      <CustomerForm
        mode="edit"
        customerId={customer.id}
        defaultValues={defaultValues}
      />
    </div>
  );
}
