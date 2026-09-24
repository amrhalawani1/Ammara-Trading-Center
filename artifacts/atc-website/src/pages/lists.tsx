import { useState, type FormEvent } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { ShortlistCard } from "@/components/lists/shortlist-card";
import { btn, eyebrow, field } from "@/components/lists/ui";
import { useShortlists } from "@/hooks/use-shortlists";
import { LIST_NAME_MAX, type ListNameError } from "@/lib/shortlists";
import { cn } from "@/lib/utils";

const ERRORS: Record<ListNameError, string> = {
  blank: "Give the shortlist a name.",
  duplicate: "A shortlist with that name already exists.",
};

const page = "mx-auto max-w-[1560px] px-[clamp(20px,6vw,96px)]";

/**
 * Project shortlists: the references a visitor is considering, grouped by job, kept on this
 * device, and sent to ATC as one enquiry.
 */
export default function Lists() {
  const { lists, createList } = useShortlists();

  return (
    <MainLayout>
      <section className={cn(page, "pb-12 pt-12 md:pb-16 md:pt-20")}>
        <p className={eyebrow}>Saved specification</p>
        <div className="mt-5 grid gap-6 md:grid-cols-12">
          <h1 className="font-display text-3xl font-medium tracking-[-0.03em] md:col-span-7 md:text-5xl">Project shortlists.</h1>
          <div className="md:col-span-4 md:col-start-9">
            <p className="text-lg leading-relaxed text-foreground/70">
              Gather the exact references for a room, workshop or client presentation. When the selection is ready, send it to ATC for availability and project terms.
            </p>
          </div>
        </div>
      </section>

      <section className={cn(page, "pb-24 md:pb-32")}>
        <div className="grid gap-8 border-y border-border py-8 md:grid-cols-12 md:items-end">
          <div className="md:col-span-5">
            <p className={eyebrow}>Start another selection</p>
            <h2 className="mt-3 font-display text-2xl font-medium tracking-[-0.02em]">Name the project, room or client.</h2>
          </div>
          <NewListForm onCreate={createList} className="md:col-span-6 md:col-start-7" />
        </div>

        <div className="grid gap-14 pt-10" data-testid="shortlist-grid">
          {lists.map((list, index) => (
            <ShortlistCard key={list.id} list={list} index={index} />
          ))}
        </div>
      </section>
    </MainLayout>
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
          className={cn(field, "min-w-0 flex-1 aria-[invalid=true]:border-primary")}
          data-testid="input-new-list"
        />
        <button type="submit" className={btn("primary")} data-testid="button-create-list">
          Create shortlist
        </button>
      </div>
      {error && (
        <p id="new-list-error" className="mt-2 text-xs text-primary" role="alert" data-testid="text-list-error">
          {ERRORS[error]}
        </p>
      )}
    </form>
  );
}
