export async function copyToClipboard(copyText: string) {
  return await navigator.clipboard.writeText(copyText);
}
