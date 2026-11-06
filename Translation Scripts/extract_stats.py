import re, sys, glob, os
from html.parser import HTMLParser

root = sys.argv[1]
pages = ['contact', 'data', 'interventional-study', 'links', 'mix-study', 'partner', 'publications',
         'register-study', 'research', 'resources', 'Resources-new', 'screening-eligibility-checker',
         'symptom-triage', 'team', 'womens-health', 'index']


class P(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.skip = 0
        self.texts = []
        self.attrs = []

    def handle_starttag(self, tag, attrs):
        if tag in ('script', 'style'):
            self.skip += 1
        d = dict(attrs)
        for k in ('alt', 'title', 'placeholder', 'aria-label', 'content'):
            if k in d and d[k] and re.search(r'[A-Za-z]{3,}', d[k]):
                self.attrs.append((k, d[k]))

    def handle_endtag(self, tag):
        if tag in ('script', 'style') and self.skip:
            self.skip -= 1

    def handle_data(self, data):
        if self.skip:
            return
        t = ' '.join(data.split())
        if t and re.search(r'[A-Za-z]{2,}', t):
            self.texts.append(t)


allu = {}
for p in pages:
    s = open(f'{root}/{p}.html', encoding='utf-8').read()
    # drop html comments
    s2 = re.sub(r'<!--.*?-->', '', s, flags=re.S)
    parser = P()
    parser.feed(s2)
    uniq = set(parser.texts)
    chars = sum(len(t) for t in uniq)
    scripts = re.findall(r'<script(?![^>]*src)[^>]*>(.*?)</script>', s2, flags=re.S)
    sc = sum(len(x) for x in scripts)
    print(f'{p:35} lines={s.count(chr(10)):5} text_nodes={len(parser.texts):4} uniq={len(uniq):4} chars={chars:6} attrs={len(parser.attrs):3} inline_script_chars={sc}')
    for t in uniq:
        allu[t] = allu.get(t, 0) + 1
print('total unique strings', len(allu), 'chars', sum(len(t) for t in allu))
print('shared across >=3 pages:', sum(1 for t, c in allu.items() if c >= 3))
