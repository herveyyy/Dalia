export default function Page() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-3xl flex-col justify-center gap-4 px-6 py-16">
      <p className="font-display text-xs font-bold tracking-[0.5px] text-primary uppercase">
        Multi-Zone
      </p>
      <h1 className="font-display text-3xl font-bold text-primary">
        Hris
      </h1>
      <p className="max-w-md text-base leading-7 text-muted-foreground">
        Served at <code className="text-foreground">/hris</code> through{" "}
        <code className="text-foreground">web</code>. Use{" "}
        <code className="text-foreground">&lt;a&gt;</code> for cross-zone links,
        not <code className="text-foreground">next/link</code>.
      </p>
      <a
        href="/"
        className="font-display w-fit text-sm font-bold text-primary hover:underline"
      >
        ← Back to main app
      </a>
    </main>
  );
}
