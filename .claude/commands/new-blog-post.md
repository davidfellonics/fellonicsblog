You are helping craft and publish a new blog post for the FFellonics geometry blog (ffell.com).
Project root: /Users/davidfell/Sites/fellonicsblog

**Topic:** $ARGUMENTS

---

## Step 1 — Draft the post

Write a complete, high-quality blog post on the topic above.

**Voice & style:** Authoritative yet warm — like a knowledgeable friend who's genuinely excited about geometry. Real math, no jargon overload. The blog covers topology, tessellation, polyhedra, non-Euclidean geometry, sacred geometry, and mathematical art.

Produce every field below:

| Field | Rules |
|---|---|
| `title` | Specific and compelling. Not clickbait. E.g. "Why the Möbius Strip Is Weirder Than You Think" |
| `slug` | lowercase-hyphens, no special chars. E.g. `mobius-strip-topology` |
| `excerpt` | 1–2 punchy sentences, max 160 chars. No quotes around it. |
| `tags` | 2–4 slugs chosen from: `topology` · `tessellation` · `polyhedra` · `non-euclidean` · `sacred-geometry` · `fractals` · `symmetry` · `dimensions` · `mathematical-art` |
| `content` | Full HTML body, 800–1500 words. Use only: `<h2>` `<h3>` `<p>` `<ul>` `<li>` `<ol>` `<blockquote>` `<strong>` `<em>`. No wrappers (`<html>`/`<body>`/`<head>`). No inline styles. |
| `reading_time_minutes` | word count ÷ 200, rounded up |
| `cover_image` | Pick the best match from this list, or leave blank if none fits: `dodecahedron.jpg` · `hyperbolic.jpg` · `icosahedron.jpg` · `kepler.png` · `mandelbrot.jpg` · `mobius.jpg` · `penrose.jpg` · `sphere_pack.svg` · `symmetry.svg` · `tessellation.svg` · `tetrahedron.jpg` |

Show the full draft (title, excerpt, content) and ask:
**"Publish as-is, make edits, or cancel?"**

Wait for confirmation before continuing.

---

## Step 2 — Publish to Supabase

On approval, use the Bash tool to run this Python publish script. Write the actual post data into the script before running — use Python triple-quoted strings so HTML content never breaks shell escaping.

```python
#!/usr/bin/env python3
import json, urllib.request, urllib.error
from datetime import datetime, timezone

# --- Read credentials from .env.local ---
env = {}
with open('/Users/davidfell/Sites/fellonicsblog/.env.local') as f:
    for line in f:
        line = line.strip()
        if '=' in line and not line.startswith('#') and not line.startswith('//'):
            k, v = line.split('=', 1)
            env[k.strip()] = v.strip()

URL  = env['NEXT_PUBLIC_SUPABASE_URL'].rstrip('/')
KEY  = env['SUPABASE_SERVICE_ROLE_KEY']
SITE = env.get('NEXT_PUBLIC_SITE_URL', 'https://www.ffell.com').rstrip('/')

HEADERS = {
    'apikey': KEY,
    'Authorization': f'Bearer {KEY}',
    'Content-Type': 'application/json',
    'Prefer': 'return=representation',
}

def api(method, path, body=None):
    req = urllib.request.Request(f'{URL}/rest/v1{path}', method=method,
                                  headers=HEADERS,
                                  data=json.dumps(body).encode() if body else None)
    try:
        with urllib.request.urlopen(req) as r:
            return json.loads(r.read())
    except urllib.error.HTTPError as e:
        raise RuntimeError(f'{method} {path} → {e.code}: {e.read().decode()}')

# --- Post data (fill in from draft) ---
TITLE    = """REPLACE_WITH_TITLE"""
SLUG     = "REPLACE_WITH_SLUG"
EXCERPT  = """REPLACE_WITH_EXCERPT"""
CONTENT  = """REPLACE_WITH_HTML_CONTENT"""
TAGS     = ["tag-one", "tag-two"]   # slugs
COVER    = "/geometry/REPLACE_OR_LEAVE_EMPTY"   # e.g. "/geometry/mobius.jpg" or ""
READING  = 5   # minutes

# --- Get author ID ---
profiles = api('GET', '/profiles?select=id&limit=1')
author_id = profiles[0]['id']

# --- Insert post ---
post_body = {
    'title':                TITLE,
    'slug':                 SLUG,
    'excerpt':              EXCERPT,
    'content':              CONTENT,
    'cover_image_url':      COVER if COVER and not COVER.endswith('/') else None,
    'og_image_url':         COVER if COVER and not COVER.endswith('/') else None,
    'author_id':            author_id,
    'status':               'published',
    'published_at':         datetime.now(timezone.utc).isoformat(),
    'updated_at':           datetime.now(timezone.utc).isoformat(),
    'reading_time_minutes': READING,
}
post = api('POST', '/posts', post_body)
post_id = post[0]['id']
print(f'✓ Post created: {post_id}')

# --- Upsert tags and link them ---
for tag_slug in TAGS:
    tag_name = tag_slug.replace('-', ' ').title()
    # upsert tag
    existing = api('GET', f'/tags?slug=eq.{tag_slug}&select=id')
    if existing:
        tag_id = existing[0]['id']
    else:
        tag_req = urllib.request.Request(
            f'{URL}/rest/v1/tags',
            method='POST',
            headers={**HEADERS, 'Prefer': 'return=representation'},
            data=json.dumps({'name': tag_name, 'slug': tag_slug}).encode()
        )
        with urllib.request.urlopen(tag_req) as r:
            tag_id = json.loads(r.read())[0]['id']
    # link post ↔ tag
    api('POST', '/post_tags', {'post_id': post_id, 'tag_id': tag_id})
    print(f'  ✓ Tag: {tag_name}')

# --- Revalidate ISR cache ---
revalidate_req = urllib.request.Request(
    f'{SITE}/api/revalidate',
    method='POST',
    headers={'Content-Type': 'application/json', 'Authorization': f'Bearer {KEY}'},
    data=json.dumps({'slug': SLUG}).encode()
)
try:
    with urllib.request.urlopen(revalidate_req) as r:
        print(f'✓ Cache revalidated: {r.read().decode()}')
except Exception as e:
    print(f'  ⚠ Revalidation skipped (deploy may not be live yet): {e}')

print(f'\n🎉 Live at: {SITE}/{SLUG}')
```

Replace every `REPLACE_WITH_*` placeholder with the actual draft content before running. Use triple-quoted Python strings so HTML with quotes/apostrophes is handled safely.

After the script runs successfully, report the live URL to the user.
