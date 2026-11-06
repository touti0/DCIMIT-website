# Builds <page>_<lang>.html for every site page and updates the language switchers.
# Usage: python -I i18n_build.py <path to website folder>
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')
root = sys.argv[1]
base ='' # ---- PUT FILE PATH HERE

LANGS = ['it', 'fr', 'ro', 'ar']
PAGES = ['contact', 'data', 'interventional-study', 'links', 'mix-study', 'partner', 'publications',
         'register-study', 'research', 'resources', 'resources-new', 'screening-eligibility-checker',
         'symptom-triage', 'team', 'womens-health']

# ---- translation data -------------------------------------------------------
ns = {}
for f in ('i18n_a.py', 'i18n_b.py', 'i18n_c.py'):
    exec(open(base + f, encoding='utf-8').read(), ns)
old = {}
sys.argv = ['x', root]
exec(open(base + 'build_lang_pages.py', encoding='utf-8').read().split('LANG_NAME =')[0], old)


def norm(s):
    return ' '.join(s.split())


ROWS = ns['A'] + ns['B'] + ns['C'] + list(old['WRAP']) + list(old['RAW'])
DICT = {i: {} for i in range(len(LANGS))}
RAW_LONG = []
for row in ROWS:
    en = norm(row[0])
    for i in range(len(LANGS)):
        DICT[i].setdefault(en, row[i + 1].strip())
    if len(en) >= 25:
        RAW_LONG.append(row)

PAGE_OVERRIDE = {
    'team': {'DCIMIT - Data page': ('DCIMIT - Team', 'DCIMIT - Équipe', 'DCIMIT - Echipa', 'DCIMIT - الفريق')},
}

LANG_NAME = {'en': 'English', 'it': 'Italiano', 'fr': 'Français', 'ro': 'Română', 'ar': 'العربية'}
ARIA_LABEL = {'it': 'Lingua: Italiano', 'fr': 'Langue : Français', 'ro': 'Limba: Română', 'ar': 'اللغة: العربية', 'en': 'Language: English'}
ORDER = ['en', 'it', 'ar', 'fr', 'ro']

MASK = re.compile(r'<!--.*?-->|<script\b.*?</script>|<style\b.*?</style>', re.S | re.I)


def page_file(page, lang):
    if lang == 'en':
        return 'index_landing.html' if page == 'index' else page + '.html'
    return '%s_%s.html' % (page, lang)


def switcher(page, lang):
    items = []
    for code in ORDER:
        if code == lang:
            continue
        items.append(
            '<button type="button" role="menuitem" data-lang="%s" lang="%s" onclick="window.location.href=\'%s\';"><span>%s</span> %s</button>'
            % (code, code, page_file(page, code), code.upper(), LANG_NAME[code])
        )
    return (
        '<button type="button" class="lang-current active" data-lang="%s" aria-haspopup="true" aria-expanded="false" aria-label="%s">%s <i class="bi bi-chevron-down"></i></button>'
        '<div class="lang-menu" role="menu">%s</div>' % (lang, ARIA_LABEL[lang], lang.upper(), ''.join(items))
    )


SWITCH_RE = re.compile(r'<button type="button" class="lang-current.*?</div>', re.S)
LINK_RE = re.compile(r'href="([^"#?]+\.html)(#[^"]*)?"')
LOCAL_TARGETS = set(p + '.html' for p in PAGES) | {'index.html', 'index_landing.html'}


def localize_links(html, lang):
    def repl(m):
        target, frag = m.group(1), m.group(2) or ''
        if target not in LOCAL_TARGETS:
            return m.group(0)
        if target in ('index.html', 'index_landing.html'):
            new = 'index_%s.html' % lang
        else:
            new = target[:-5] + '_%s.html' % lang
        return 'href="%s%s"' % (new, frag)
    return LINK_RE.sub(repl, html)


def translate_text(html, li, page):
    masked = MASK.sub(lambda m: '\x00' * len(m.group(0)), html)
    d = DICT[li]
    over = {norm(k): v[li] for k, v in PAGE_OVERRIDE.get(page, {}).items()}
    edits = []
    missing = []
    for m in re.finditer(r'>([^<>\x00]+)(?=<)', masked):
        raw = m.group(1)
        key = norm(raw)
        if not key or not re.search(r'[A-Za-z]{2,}', key):
            continue
        if key in over:
            tr = over[key]
        elif key in d:
            tr = d[key]
        else:
            tr = None
            for row in RAW_LONG:
                if norm(row[0]) in key:
                    key2 = key.replace(norm(row[0]), row[li + 1].strip())
                    tr = key2
                    key = key2
            if tr is None:
                missing.append(key)
                continue
        lead = raw[:len(raw) - len(raw.lstrip())]
        trail = raw[len(raw.rstrip()):]
        edits.append((m.start(1), m.end(1), lead + tr + trail))
    for s, e, t in sorted(edits, reverse=True):
        html = html[:s] + t + html[e:]
    return html, missing


ATTR_RE = re.compile(r'\b(placeholder|title|content|aria-label)="([^"]*)"')


def translate_attrs(html, li, page):
    masked = MASK.sub(lambda m: '\x00' * len(m.group(0)), html)
    d = DICT[li]
    out = []
    last = 0
    for m in ATTR_RE.finditer(html):
        if masked[m.start()] == '\x00':
            continue
        key = norm(m.group(2))
        if key in d:
            out.append(html[last:m.start(2)])
            out.append(d[key])
            last = m.end(2)
    out.append(html[last:])
    return ''.join(out)


def translate_scripts(html, li, page):
    rows = []
    if page in ('publications', 'resources', 'links'):
        rows = ns['SCRIPT_RES']
    elif page in ('screening-eligibility-checker', 'symptom-triage'):
        rows = ns['SCRIPT_TOOLS']
    if not rows:
        return html
    lang = LANGS[li]

    def fix(m):
        body = m.group(2)
        for row in rows:
            body = body.replace(row[0], row[li + 1])
        if page == 'publications':
            loc = 'ar-u-nu-latn' if lang == 'ar' else lang
            helper = ("function fmtDate(s){const d=new Date(s);return isNaN(d)?s:d.toLocaleDateString('%s',"
                      "{day:'numeric',month:'long',year:'numeric'});}\n      const papers = [") % loc
            body = body.replace('const papers = [', helper, 1)
        return m.group(1) + body + m.group(3)
    return re.sub(r'(<script(?![^>]*\bsrc=)[^>]*>)(.*?)(</script>)', fix, html, flags=re.S)


def doc_attrs(html, lang):
    html = html.replace('<html lang="en">', '<html lang="%s"%s>' % (lang, ' dir="rtl"' if lang == 'ar' else ''), 1)
    if lang == 'ar':
        extra = ('<link href="https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">\n'
                 '  <link href="assets/css/rtl.css" rel="stylesheet">\n</head>')
        html = html.replace('</head>', extra, 1)
    return html


def with_switcher(html, page, lang):
    assert len(SWITCH_RE.findall(html)) == 1, page
    return SWITCH_RE.sub(lambda m: switcher(page, lang), html, count=1)


def read(path):
    raw = open(path, 'rb').read().decode('utf-8')
    return raw.replace('\r\n', '\n'), '\r\n' in raw


def write(path, html, crlf):
    if crlf:
        html = html.replace('\n', '\r\n')
    open(path, 'wb').write(html.encode('utf-8'))


report = {}
for page in PAGES:
    src, crlf = read('%s/%s.html' % (root, page))
    # English page: switcher points to this page's translations
    en = SWITCH_RE.sub(lambda m: switcher(page, 'en'), src, count=1)
    write('%s/%s.html' % (root, page), en, crlf)
    for li, lang in enumerate(LANGS):
        html = src
        html, missing = translate_text(html, li, page)
        html = translate_attrs(html, li, page)
        html = translate_scripts(html, li, page)
        html = localize_links(html, lang)
        html = with_switcher(html, page, lang)
        html = doc_attrs(html, lang)
        write('%s/%s_%s.html' % (root, page, lang), html, crlf)
        report.setdefault(page, {})[lang] = missing

# index pages (already translated by build_lang_pages.py): links + switcher only
for lang in LANGS:
    path = '%s/index_%s.html' % (root, lang)
    html, crlf = read(path)
    html, _ = translate_text(html, LANGS.index(lang), 'index')
    html = localize_links(html, lang)
    html = with_switcher(html, 'index', lang)
    write(path, html, crlf)
for p in ('index', 'index_landing'):
    path = '%s/%s.html' % (root, p)
    html, crlf = read(path)
    html = SWITCH_RE.sub(lambda m: switcher('index', 'en'), html, count=1)
    write(path, html, crlf)

# gaps still in English (texts, per page, Italian run is representative)
for page in PAGES:
    skip = {'EN', 'IT', 'AR', 'FR', 'RO', 'Italiano', 'Français', 'Română', 'العربية'}
    miss = [t for t in report[page]['it'] if t not in skip and t.replace('�', 'ç') not in skip and not t.startswith('Fran')]
    print('==', page, len(miss))
    for t in miss:
        print('   ', t[:110])
