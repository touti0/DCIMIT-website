import re, sys, json

root = sys.argv[1]
base = ''# ---- PUT FILE PATH HERE

PAGES = ['contact', 'data', 'interventional-study', 'links', 'mix-study', 'partner', 'publications',
         'register-study', 'research', 'resources', 'Resources-new', 'screening-eligibility-checker',
         'symptom-triage', 'team', 'womens-health', 'index']

# existing translations (index page)
code = open(base + 'build_lang_pages.py', encoding='utf-8').read().split('LANG_NAME =')[0]
ns = {}
sys.argv = ['x', root]
exec(code, ns)
known = set(r[0] for r in ns['WRAP']) | set(r[0] for r in ns['RAW'])
known = set(' '.join(k.split()) for k in known)

MASK = re.compile(r'<!--.*?-->|<script\b.*?</script>|<style\b.*?</style>', re.S | re.I)


def nodes(html):
    masked = MASK.sub(lambda m: '\x00' * len(m.group(0)), html)
    for m in re.finditer(r'>([^<>\x00]+)(?=<)', masked):
        t = ' '.join(m.group(1).split())
        if t and re.search(r'[A-Za-z]{2,}', t):
            yield t


out = {}
for p in PAGES:
    html = open(f'{root}/{p}.html', encoding='utf-8').read()
    seen = []
    for t in nodes(html):
        if t in known or t in seen:
            continue
        seen.append(t)
    out[p] = seen
allseen = {}
for p, lst in out.items():
    for t in lst:
        allseen.setdefault(t, []).append(p)
print('unique new strings:', len(allseen), 'chars', sum(len(t) for t in allseen))
with open(base + 'strings_dump.txt', 'w', encoding='utf-8') as f:
    for i, (t, ps) in enumerate(allseen.items()):
        f.write(f'{i}\t{",".join(ps) if len(ps) < 4 else "MANY(" + str(len(ps)) + ")"}\t{t}\n')
json.dump(list(allseen.keys()), open(base + 'strings_list.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=0)
