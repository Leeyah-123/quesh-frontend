import { DocumentChat } from '@/components/document/document-chat';

export default async function DocumentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return <DocumentChat documentId={(await params).id} />;
}
