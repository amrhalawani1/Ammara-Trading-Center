import { AccountFrame } from "@/components/account/account-frame";
import { ProfileForm } from "@/components/account/profile-form";

export default function AccountProfilePage() {
  return (
    <AccountFrame
      section="profile"
      title="Profile"
      lede="Your company and role appear on every enquiry you send."
    >
      {({ profile, saving, saveProfile }) => <ProfileForm profile={profile} saving={saving} onSave={saveProfile} />}
    </AccountFrame>
  );
}
