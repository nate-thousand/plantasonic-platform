/**
 * Asset intelligence — classify, tag, deduplicate, map dependencies.
 */
import type { AssetKind } from '../platform/types.ts';
import { assetRegistry, defineAsset } from '../platform/assets.ts';
import type { AssetAnalysis } from './types.ts';

const EXT_KIND: Record<string, AssetKind> = {
  png: 'image',
  jpg: 'image',
  jpeg: 'image',
  webp: 'image',
  gif: 'image',
  svg: 'image',
  mp4: 'video',
  webm: 'video',
  mov: 'video',
  wav: 'audio',
  mp3: 'audio',
  ogg: 'audio',
  glb: 'model',
  gltf: 'model',
  obj: 'model',
  fbx: 'model',
  ttf: 'font',
  woff: 'font',
  woff2: 'font',
  lut: 'lut',
};

function extension(uri: string): string {
  const base = uri.split(/[?#]/)[0] ?? uri;
  const parts = base.split('.');
  return (parts[parts.length - 1] ?? '').toLowerCase();
}

/** Infer asset kind from URI extension. */
export function classifyAsset(uri: string): AssetKind {
  return EXT_KIND[extension(uri)] ?? 'texture';
}

/** Generate tags from filename and kind. */
export function generateAssetTags(uri: string, kind: AssetKind): string[] {
  const tags = [kind];
  const name = uri.split('/').pop()?.split('.')[0] ?? '';
  if (/noise|tile|seamless/i.test(name)) tags.push('procedural', 'tileable');
  if (/ambient|loop|drone/i.test(name)) tags.push('ambient', 'loop');
  if (/ui|icon|glyph/i.test(name)) tags.push('ui');
  return [...new Set(tags)];
}

/** Extract metadata from asset URI (extension-based; extensible for AI analysis). */
export function extractAssetMetadata(uri: string, kind: AssetKind): Record<string, unknown> {
  return {
    kind,
    extension: extension(uri),
    analyzedAt: new Date().toISOString(),
    source: uri.startsWith('assets://') ? 'registry' : 'import',
  };
}

/** Analyze a single asset — classify, tag, detect duplicates. */
export function analyzeAsset(uri: string, name?: string): AssetAnalysis {
  const kind = classifyAsset(uri);
  const tags = generateAssetTags(uri, kind);
  const metadata = extractAssetMetadata(uri, kind);
  const id = `asset.${uri.replace(/[^a-zA-Z0-9]+/g, '-').slice(0, 48)}`;

  const existing = assetRegistry.all().filter((a) => a.uri === uri);
  const duplicates = existing.map((a) => a.id);

  return {
    id,
    kind,
    uri,
    tags,
    metadata,
    duplicates: duplicates.length ? duplicates : undefined,
    dependencies: kind === 'preset' ? ['engine.sound', 'engine.visual'] : undefined,
  };
}

/** Register analyzed asset in shared registry. */
export function registerAnalyzedAsset(analysis: AssetAnalysis, displayName?: string): AssetAnalysis {
  defineAsset(analysis.kind, displayName ?? analysis.id, analysis.uri, {
    tags: analysis.tags,
  });
  return analysis;
}

/** Batch analyze and organize assets for a project. */
export function organizeAssets(uris: string[]): AssetAnalysis[] {
  return uris.map((uri) => {
    const analysis = analyzeAsset(uri);
    if (!analysis.duplicates?.length) registerAnalyzedAsset(analysis);
    return analysis;
  });
}

/** Find duplicate assets across registry. */
export function findDuplicateAssets(): Map<string, string[]> {
  const byUri = new Map<string, string[]>();
  for (const asset of assetRegistry.all()) {
    const list = byUri.get(asset.uri) ?? [];
    list.push(asset.id);
    byUri.set(asset.uri, list);
  }
  const dupes = new Map<string, string[]>();
  for (const [uri, ids] of byUri) {
    if (ids.length > 1) dupes.set(uri, ids);
  }
  return dupes;
}
