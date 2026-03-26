import { redirect } from "next/navigation";

interface Props {
  params: Promise<{ storeSlug: string }>;
}

export default async function NegocioHomePage({ params }: Props) {
  const { storeSlug } = await params;
  redirect(`/negocio/${storeSlug}/site`);
}
