import path from 'path';

export function NamespaceToPath(namespace: string, fileType: string) {
  return `${path.join(...namespace.split('.'))}.${fileType}`;
}

export function RequestedLinkPrefix(key: string) {
  return path.join('link-to', key);
}
