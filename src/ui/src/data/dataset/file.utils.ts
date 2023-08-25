import qs from 'querystring';

/**
 * Programmatically downloads a file
 */
export const downloadUri = ({ download, href }: {download: string, href: string}) => {
  const anchor = document.createElement('a');
  anchor.href = href;
  anchor.download = download;
  anchor.click();
}

export const generateDownloadUri = (uri: string): { download: string, href: string } => {
  const [url, querystring] = uri.split('?');

  const parsedQuerystring  = qs.parse(querystring) as { [key: string]: string | boolean };
  parsedQuerystring.download = true;
  const filePathParts = (parsedQuerystring.path as string)?.split('/') || [];

  return {
    download: filePathParts.pop() as string,
    href: [url, qs.stringify(parsedQuerystring)].join('?'),

  }
}
