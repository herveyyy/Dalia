import { redirect } from "next/navigation";

type Props = {
  searchParams: Promise<Record<string, string | undefined>>;
};

export default async function JobsPage({ searchParams }: Props) {
  const params = await searchParams;
  const urlParams = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value) {
      urlParams.set(key, value);
    }
  }

  const queryString = urlParams.toString();
  redirect(`/user/jobs${queryString ? `?${queryString}` : ""}`);
}

