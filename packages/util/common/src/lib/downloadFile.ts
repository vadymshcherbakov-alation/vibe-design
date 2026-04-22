export const downloadFile = (
  downloadContent: string,
  fileName: string,
  contentType = 'application/text;charset=utf-8',
) => {
  const anchor = document.createElement('a');
  anchor.target = '_blank';
  anchor.href = URL.createObjectURL(new Blob([downloadContent], {type: contentType}));
  anchor.download = fileName;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
};
