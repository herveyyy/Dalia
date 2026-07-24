import * as React from "react";
import Link from "next/link";
import {
  HiOutlineBriefcase,
  HiOutlineMapPin,
  HiOutlineClock,
  HiOutlineBuildingOffice2,
  HiOutlineCurrencyDollar,
  HiOutlineArrowRight,
  HiOutlineMagnifyingGlass,
} from "react-icons/hi2";
import { getPublishedJobs, getCompanyByName } from "./queries";
import type { Metadata } from "next";

type Props = {
  searchParams: Promise<{ company?: string }>;
};

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const params = await searchParams;
  const companyName = params.company;

  return {
    title: companyName
      ? `Careers at ${companyName}`
      : "Job Board — Dalia",
    description: companyName
      ? `Browse open positions at ${companyName}. Powered by Dalia HRIS.`
      : "Discover career opportunities from companies powered by Dalia HRIS.",
  };
}

export default async function JobsPage({ searchParams }: Props) {
  const params = await searchParams;
  const companyFilter = params.company;

  const jobs = await getPublishedJobs(companyFilter);
  const companyRecord = companyFilter
    ? await getCompanyByName(companyFilter)
    : null;

  return (
    <div className="min-h-screen bg-background">
      {/* Subtle top accent bar */}
      <div className="h-1 bg-linear-to-r from-primary/60 via-primary to-primary/60" />

      {/* Navigation */}
      <header className="border-b border-border/50 bg-card/80 backdrop-blur-md sticky top-0 z-50">
        <div className="mx-auto max-w-6xl flex items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2.5 group">
            <span className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
              <HiOutlineBriefcase className="size-5" />
            </span>
            <span className="text-lg font-bold font-display text-foreground tracking-tight">
              {companyRecord?.name || "Dalia Jobs"}
            </span>
          </Link>
          <Link
            href="/"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Back to Dalia
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 hero-dots opacity-40" />
        <div className="relative mx-auto max-w-6xl px-6 py-16 md:py-24">
          <div className="max-w-2xl">
            {companyRecord ? (
              <>
                <div className="flex items-center gap-3 mb-4 animate-rise">
                  {companyRecord.logoUrl ? (
                    <img
                      src={companyRecord.logoUrl}
                      alt={companyRecord.name}
                      className="size-12 rounded-xl object-cover border border-border/60"
                    />
                  ) : (
                    <span className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <HiOutlineBuildingOffice2 className="size-6" />
                    </span>
                  )}
                  <div>
                    <p className="text-sm font-semibold text-primary uppercase tracking-wider">
                      Careers at
                    </p>
                    <h1 className="text-3xl md:text-4xl font-bold font-display text-foreground tracking-tight">
                      {companyRecord.name}
                    </h1>
                  </div>
                </div>
                {companyRecord.description && (
                  <p className="text-base text-muted-foreground leading-relaxed mt-4 animate-rise-delay">
                    {companyRecord.description}
                  </p>
                )}
              </>
            ) : (
              <>
                <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-3 animate-rise">
                  Open Positions
                </p>
                <h1 className="text-3xl md:text-5xl font-bold font-display text-foreground tracking-tight animate-rise-delay">
                  Find Your Next{" "}
                  <span className="text-primary">Opportunity</span>
                </h1>
                <p className="text-base md:text-lg text-muted-foreground leading-relaxed mt-4 animate-rise-delay-2">
                  Browse career openings from companies powered by Dalia HRIS.
                </p>
              </>
            )}

            {/* Stats bar */}
            <div className="flex items-center gap-6 mt-8 animate-rise-delay-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <HiOutlineBriefcase className="size-4 text-primary" />
                <span className="font-bold text-foreground">{jobs.length}</span>{" "}
                open role{jobs.length !== 1 && "s"}
              </div>
              {!companyFilter && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <HiOutlineBuildingOffice2 className="size-4 text-primary" />
                  <span className="font-bold text-foreground">
                    {new Set(jobs.map((j) => j.companyId)).size}
                  </span>{" "}
                  companies hiring
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Job Listings */}
      <section className="mx-auto max-w-6xl px-6 pb-20">
        {jobs.length === 0 ? (
          /* Empty state */
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <span className="flex size-16 items-center justify-center rounded-2xl bg-muted/60 text-muted-foreground mb-6">
              <HiOutlineMagnifyingGlass className="size-8" />
            </span>
            <h2 className="text-xl font-bold text-foreground font-display">
              No open positions right now
            </h2>
            <p className="text-sm text-muted-foreground mt-2 max-w-md">
              {companyFilter
                ? `"${companyFilter}" doesn't have any published job postings at the moment. Check back soon!`
                : "There are no published job postings at the moment. Check back soon!"}
            </p>
            <Link
              href="/"
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Back to Home
              <HiOutlineArrowRight className="size-3.5" />
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {jobs.map((job, idx) => (
              <article
                key={job.id}
                className="group rounded-xl border border-border/60 bg-card p-6 shadow-sm hover:shadow-md hover:border-primary/30 transition-all duration-200"
                style={{ animationDelay: `${idx * 60}ms` }}
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  {/* Left: Job info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="inline-flex items-center gap-1.5 rounded-md bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary uppercase tracking-wide">
                        {job.employmentType}
                      </span>
                      <span
                        className={`rounded-md px-2.5 py-1 text-xs font-bold uppercase tracking-wide ${
                          job.status === "Published"
                            ? "bg-green-500/10 text-green-600"
                            : "bg-amber-500/10 text-amber-600"
                        }`}
                      >
                        {job.status}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors font-display">
                      {job.title}
                    </h3>

                    {/* Meta row */}
                    <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-muted-foreground">
                      {!companyFilter && job.company && (
                        <span className="flex items-center gap-1.5">
                          <HiOutlineBuildingOffice2 className="size-3.5" />
                          {job.company.name}
                        </span>
                      )}
                      {job.department && (
                        <span className="flex items-center gap-1.5">
                          <HiOutlineBriefcase className="size-3.5" />
                          {job.department.name}
                        </span>
                      )}
                      {job.location && (
                        <span className="flex items-center gap-1.5">
                          <HiOutlineMapPin className="size-3.5" />
                          {job.location}
                        </span>
                      )}
                      {job.salaryRange && (
                        <span className="flex items-center gap-1.5">
                          <HiOutlineCurrencyDollar className="size-3.5" />
                          {job.salaryRange}
                        </span>
                      )}
                      <span className="flex items-center gap-1.5">
                        <HiOutlineClock className="size-3.5" />
                        {new Date(job.createdAt).toLocaleDateString("en-PH", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>

                    {/* Description preview */}
                    <p className="text-sm text-muted-foreground mt-3 line-clamp-2 leading-relaxed">
                      {job.description}
                    </p>

                    {/* Requirements preview */}
                    {job.requirements && (
                      <p className="text-xs text-muted-foreground/70 mt-2 line-clamp-1">
                        <span className="font-semibold text-muted-foreground">Requirements:</span>{" "}
                        {job.requirements}
                      </p>
                    )}
                  </div>

                  {/* Right: CTA */}
                  <div className="shrink-0 sm:self-center">
                    <button className="inline-flex items-center gap-2 rounded-lg bg-primary/10 px-5 py-2.5 text-sm font-bold text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-200 group-hover:bg-primary group-hover:text-primary-foreground">
                      View Details
                      <HiOutlineArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-card/40">
        <div className="mx-auto max-w-6xl px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            Powered by{" "}
            <Link href="/" className="font-bold text-primary hover:underline">
              Dalia HRIS
            </Link>
          </p>
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Dalia. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
