export default function getFileUrl(fileUrl: string) {
  return fileUrl.includes('https://') ? fileUrl : `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${fileUrl}`;
}
