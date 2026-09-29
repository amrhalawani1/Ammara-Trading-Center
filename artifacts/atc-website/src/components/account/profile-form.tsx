import { useToast } from "@/hooks/use-toast";
import { TRADE_ROLES, type TradeProfile } from "@/lib/trade-session";
import { AuthField, AuthSelect } from "./auth-shell";

export function ProfileForm({
  profile,
  saving,
  onSave,
}: {
  profile: TradeProfile;
  saving?: boolean;
  onSave: (profile: TradeProfile) => void;
}) {
  const { toast } = useToast();

  return (
    <form
      className="max-w-md space-y-6"
      onSubmit={(event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const role = String(data.get("role") || "");
        onSave({
          email: String(data.get("email") || profile.email),
          name: String(data.get("name") || ""),
          company: String(data.get("company") || ""),
          role: TRADE_ROLES.some((item) => item.value === role) ? (role as TradeProfile["role"]) : "",
        });
        toast({ title: "Profile saved", description: "These details will appear on your next enquiry." });
      }}
      data-testid="form-account-profile"
    >
      <AuthField label="Name" name="name" defaultValue={profile.name} autoComplete="name" />
      <AuthField label="Email" name="email" type="email" defaultValue={profile.email} autoComplete="email" />
      <AuthField label="Company" name="company" defaultValue={profile.company} autoComplete="organization" />
      <AuthSelect label="Role" name="role" defaultValue={profile.role} options={TRADE_ROLES} />
      <button
        type="submit"
        disabled={saving}
        className="inline-flex h-11 items-center bg-foreground px-5 text-[11px] font-semibold uppercase tracking-[0.16em] text-background disabled:opacity-50"
        data-testid="button-account-save-profile"
      >
        {saving ? "Saving…" : "Save profile"}
      </button>
    </form>
  );
}
