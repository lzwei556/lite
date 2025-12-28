import { downloadFile } from './download';

export function base64toBlob(base64: string, contentType = 'image/png') {
  return fetch(base64)
    .then((response) => response.blob())
    .then((blob) => new Blob([blob], { type: contentType }));
}

export function saveAsImage(base64: string, filename: string) {
  base64toBlob(base64).then((blob) => {
    downloadFile(window.URL.createObjectURL(new Blob([blob])), filename);
  });
}
