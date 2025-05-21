import { DocumentChat } from "@/components/document/document-chat"

export default function DocumentPage({ params }: { params: { id: string } }) {
  return <DocumentChat documentId={params.id} />
}
