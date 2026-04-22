import fs from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';

const CONTENT_ROOT = path.join(process.cwd(), 'content');

export async function readProjectMdx(slug: string) {
  const filePath = path.join(CONTENT_ROOT, 'projects', `${slug}.mdx`);
  try {
    const raw = await fs.readFile(filePath, 'utf8');
    const { data, content } = matter(raw);
    return { data, content };
  } catch {
    return null;
  }
}

export async function listProjectSlugs(): Promise<string[]> {
  const dir = path.join(CONTENT_ROOT, 'projects');
  try {
    const files = await fs.readdir(dir);
    return files.filter((f) => f.endsWith('.mdx')).map((f) => f.replace(/\.mdx$/, ''));
  } catch {
    return [];
  }
}
