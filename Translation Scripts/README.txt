Python 3, without installing any packages (the scripts use only the standard library). No internet connection and no APIs.

Generation Script

build_lang_pages.py

What it does: Generates the translated home pages: index_it.html, index_fr.html, index_ro.html, and index_ar.html.
Starting point: index_landing.html.
Where the translations are: within the script, in the WRAP lists (text that stands alone within a tag, such as menu items and titles) and RAW lists (sentences and paragraphs). Each line is formatted as: English, Italian, French, Romanian, Arabic.
What it adds: sets the `lang` attribute (and `dir=“rtl”` for Arabic), links the logo and “Home” button to the home page in the same language, and rewrites the language selector. For Arabic, it adds `rtl.css` and the Cairo font.
How to run it: `python -I build_lang_pages.py <website folder>`.


i18n_build.py

What it does: Generates the translated versions of the other 15 pages (contact, data, interventional-study, links, mix-study, partner, publications, register-study, research, resources, resources-new, screening-eligibility-checker, symptom-triage, team, womens-health) in four languages: <page>_it.html, _fr, _ro, _ar.
How to run it: python -I i18n_build.py <site folder>. It must be run after build_lang_pages.py.


Translation Dictionaries

Each line follows the format (“English text”, “Italian”, “French”, ‘Romanian’, “Arabic”).

i18n_a.py: general entries, contact page, glossary, three studies, and search page.
i18n_b.py: module placeholders, partners page, publications, resources, links, events, and team. It also contains SCRIPT_RES, the strings within the Publications and Resources scripts.
i18n_c.py: For Women page and the two interactive tools. It also contains SCRIPT_TOOLS, the result messages.

The English text in a line must match exactly what appears on the page: if even one word changes, the line will no longer be recognized. (OTHERWISE, WE NEED AN API)


How to Work
Edit only the English pages and dictionaries; never edit the _it, _fr, _ro, or _ar files—they are overwritten with every build.
If you’ve added new text, add a line with the four translations to one of the i18n_*.py files (for the home page, use build_lang_pages.py).
Run build_lang_pages.py first, then i18n_build.py.
Check the final list of untranslated texts.
If you add a new page, include it in the PAGES list in i18n_build.py and make sure it has a language selector like the others.

