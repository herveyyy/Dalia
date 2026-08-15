import * as React from "react";
import { ArrowLeft, Pencil } from "lucide-react";

export interface ProfileField {
  label: string;
  value: React.ReactNode;
  isBold?: boolean;
}

export interface ProfileSection {
  title: string;
  icon?: React.ReactNode;
  fields?: ProfileField[];
  customContent?: React.ReactNode;
}

export interface ProfileViewerProps {
  title: string;
  subtitle?: React.ReactNode;
  initials: string;
  statusBadge?: React.ReactNode;
  onBack?: () => void;
  onEdit?: () => void;
  editLabel?: string;
  sections: ProfileSection[];
  asideContent?: React.ReactNode;
}

export function ProfileViewer({
  title,
  subtitle,
  initials,
  statusBadge,
  onBack,
  onEdit,
  editLabel = "Edit Details",
  sections,
  asideContent,
}: ProfileViewerProps) {
  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Hero Card */}
      <div className="bg-card border border-border/60 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex size-16 items-center justify-center rounded-full bg-primary/10 text-primary text-xl font-bold font-display shrink-0">
            {initials}
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-foreground truncate">
                {title}
              </h1>
              {statusBadge}
            </div>
            {subtitle && (
              <div className="mt-1 text-sm text-muted-foreground font-medium">
                {subtitle}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {onBack && (
            <button
              onClick={onBack}
              className="inline-flex items-center justify-center rounded-lg border border-border bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4 text-xs font-semibold shadow-xs gap-2 cursor-pointer transition-colors"
            >
              <ArrowLeft className="size-4" /> Back
            </button>
          )}
          {onEdit && (
            <button
              onClick={onEdit}
              className="inline-flex items-center justify-center rounded-lg bg-primary text-primary-foreground hover:bg-primary/95 h-9 px-4 text-xs font-semibold shadow-xs gap-2 cursor-pointer transition-colors"
            >
              <Pencil className="size-4" /> {editLabel}
            </button>
          )}
        </div>
      </div>

      {/* Main Details Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {sections.map((section, idx) => (
          <div
            key={idx}
            className={`bg-card border border-border/60 rounded-2xl p-6 space-y-4 ${
              sections.length === 1 || (idx === sections.length - 1 && idx % 2 === 0)
                ? "md:col-span-2"
                : ""
            }`}
          >
            <div className="flex items-center gap-2 border-b border-border/60 pb-3">
              {section.icon}
              <h3 className="font-display font-bold text-foreground">{section.title}</h3>
            </div>
            {section.customContent ? (
              section.customContent
            ) : (
              <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-xs">
                {section.fields?.map((f, fIdx) => (
                  <div
                    key={fIdx}
                    className={
                      section.fields && fIdx === section.fields.length - 1 && fIdx % 2 === 0
                        ? "col-span-2"
                        : ""
                    }
                  >
                    <span className="text-muted-foreground block mb-0.5">{f.label}</span>
                    <span
                      className={`block text-foreground ${
                        f.isBold ? "font-bold" : "font-semibold"
                      }`}
                    >
                      {f.value || "—"}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}

        {asideContent && (
          <div className="md:col-span-2">{asideContent}</div>
        )}
      </div>
    </div>
  );
}
