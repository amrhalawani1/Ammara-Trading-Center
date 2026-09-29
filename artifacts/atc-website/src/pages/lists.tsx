import { useState, type FormEvent } from "react";
import { useAuth } from "@clerk/react";
import { AuthOpen } from "@/components/account/auth-open";
import { MainLayout } from "@/components/layout/main-layout";
import { ShortlistCard } from "@/components/lists/shortlist-card";
import { btn, field } from "@/components/lists/ui";
import { useShortlists } from "@/hooks/use-shortlists";
import { useTradeSession } from "@/hooks/use-trade-session";
import { publicEnv } from "@/lib/env";
import { LIST_NAME_ERRORS } from "@/lib/form-messages";
import { LIST_NAME_MAX, type ListNameError } from "@/lib/shortlists";
import { cn } from "@/lib/utils";

const page = "mx-auto max-w-[1560px] px-[clamp(20px,6vw,96px)]";

/**
 * Shortlists: the products a visitor is considering, grouped by job, kept on this
 * device, and sent to ATC as one enquiry.
 */
export default function Lists() {
  const { lists, createList } = useShortlists();
  const savedCount = lists.reduce((sum, list) => sum + list.items.length, 0);

  return (
    <MainLayout>
      <section className="dark border-b border-white/10 bg-black text-foreground" data-testid="section-lists-hero">
        <div className={cn(page, "flex flex-wrap items-end justify-between gap-6 pb-6 pt-8 md:pt-10")}>
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">Quote</p>
            <h1 className="mt-1 font-display text-3xl font-medium leading-none tracking-[-0.04em] md:text-4xl">Your quote lists</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              <span className="font-mono tabular-nums text-foreground">{lists.length}</span> {lists.length === 1 ? "shortlist" : "shortlists"}
              <span aria-hidden> · </span>
              <span className="font-mono tabular-nums text-foreground">{savedCount}</span> {savedCount === 1 ? "product" : "products"}
            </p>
            <AccountSyncNote />
          </div>
          <NewListForm onCreate={createList} className="w-full max-w-xl" />
        </div>
      </section>

      <section className={cn(page, "pb-24 md:pb-32")}>
        <div className="grid gap-14 pt-8" data-testid="shortlist-grid">
          {lists.map((list, index) => (
            <ShortlistCard key={list.id} list={list} index={index} />
          ))}
        </div>
      </section>
    </MainLayout>
  );
}

function AccountSyncNote() {
  return publicEnv.clerkIsConfigured ? <ClerkSyncNote /> : <LocalSyncNote />;
}

function ClerkSyncNote() {
  const { isSignedIn } = useAuth();
  return <SyncedBadge visible={Boolean(isSignedIn)} />;
}

function LocalSyncNote() {
  const { isSignedIn } = useTradeSession();
  return <SyncedBadge visible={isSignedIn} />;
}

function SyncedBadge({ visible }: { visible: boolean }) {
  if (visible) {
    return (
      <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-primary" data-testid="text-lists-synced">
        Saved to your account
      </p>
    );
  }
  return (
    <p className="mt-4 text-sm leading-6 text-muted-foreground">
      Shortlists are saved on this device.{" "}
      <AuthOpen view="sign-up" next="/lists" className="text-foreground underline-offset-4 hover:underline" testId="link-lists-signup">
        Open a trade account
      </AuthOpen>{" "}
      to use them on any device.
    </p>
  );
}

function NewListForm({ onCreate, className }: { onCreate: (name: string) => { error?: ListNameError }; className?: string }) {
  const [name, setName] = useState("");
  const [error, setError] = useState<ListNameError | null>(null);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const result = onCreate(name);
    if (result.error) {
      setError(result.error);
      return;
    }
    setName("");
    setError(null);
  };

  return (
    <form onSubmit={submit} className={className} data-testid="form-new-list">
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          value={name}
          onChange={(event) => {
            setName(event.target.value);
            if (error) setError(null);
          }}
          maxLength={LIST_NAME_MAX}
          placeholder="For example, Jabal Amman kitchen"
          aria-label="Shortlist name"
          autoComplete="off"
          aria-invalid={Boolean(error)}
          aria-describedby={error ? "new-list-error" : undefined}
          className={cn(field, "min-w-0 flex-1 border-white/20 bg-white/10 text-white placeholder:text-white/45 hover:border-white/35 focus:border-primary focus:bg-white/15 aria-[invalid=true]:border-primary")}
          data-testid="input-new-list"
        />
        <button type="submit" className={btn("primary")} data-testid="button-create-list">
          Create shortlist
        </button>
      </div>
      {error && (
        <p id="new-list-error" className="mt-2 text-xs text-primary" role="alert" data-testid="text-list-error">
          {LIST_NAME_ERRORS[error]}
        </p>
      )}
    </form>
  );
}
