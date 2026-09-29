import { AccountFrame } from "@/components/account/account-frame";
import { InquiryDesk } from "@/components/account/inquiry-desk";

export default function AccountInquiriesPage() {
  return (
    <AccountFrame
      section="inquiries"
      title="Enquiries"
      lede="Enquiries sent while signed in or from this email address. A consultant updates the status as they work on it."
    >
      {({ inquiries }) => <InquiryDesk inquiries={inquiries} />}
    </AccountFrame>
  );
}
