import { IconType } from "react-icons";

export interface AppCardItem {
  id: string;
  name: string;
  description: string;
  icon: IconType;
  href: string;
  status: "active" | "restricted" | "coming_soon";
  statusLabel: string;
}

export interface AppsPageData {
  companyName: string | null;
  apps: AppCardItem[];
}
