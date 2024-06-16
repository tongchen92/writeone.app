import ApplicationDraft from "@/components/ApplicationDraft";

interface ApplicationDraftParams {
  params: {
    draftId?: string[];
  };
}

export default function Page({ params }: ApplicationDraftParams) {
  const draftId = params.draftId?.join("/");
  if (!draftId) {
    return null;
  }
  return <ApplicationDraft draftId={draftId} />;
}
