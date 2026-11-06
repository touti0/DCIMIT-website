Python 3, without installing any packages (the scripts use only the standard library). No internet connection and no APIs.



**Generation Script**



build\_lang\_pages.py



What it does: Generates the translated home pages: index\_it.html, index\_fr.html, index\_ro.html, and index\_ar.html.

Starting point: index\_landing.html.

Where the translations are: within the script, in the WRAP lists (text that stands alone within a tag, such as menu items and titles) and RAW lists (sentences and paragraphs). Each line is formatted as: English, Italian, French, Romanian, Arabic.

What it adds: sets the `lang` attribute (and `dir=“rtl”` for Arabic), links the logo and “Home” button to the home page in the same language, and rewrites the language selector. For Arabic, it adds `rtl.css` and the Cairo font.

How to run it: `python -I build\_lang\_pages.py <website folder>`.





i18n\_build.py



What it does: Generates the translated versions of the other 15 pages (contact, data, interventional-study, links, mix-study, partner, publications, register-study, research, resources, resources-new, screening-eligibility-checker, symptom-triage, team, womens-health) in four languages: <page>\_it.html, \_fr, \_ro, \_ar.

How to run it: python -I i18n\_build.py <site folder>. It must be run after build\_lang\_pages.py.





**Translation Dictionaries**



Each line follows the format (“English text”, “Italian”, “French”, ‘Romanian’, “Arabic”).



i18n\_a.py: general entries, contact page, glossary, three studies, and search page.

i18n\_b.py: module placeholders, partners page, publications, resources, links, events, and team. It also contains SCRIPT\_RES, the strings within the Publications and Resources scripts.

i18n\_c.py: For Women page and the two interactive tools. It also contains SCRIPT\_TOOLS, the result messages.



The English text in a line must match exactly what appears on the page: if even one word changes, the line will no longer be recognized. (OTHERWISE, WE NEED AN API)





**How to Work**

Edit only the English pages and dictionaries; never edit the \_it, \_fr, \_ro, or \_ar files—they are overwritten with every build.

If you’ve added new text, add a line with the four translations to one of the i18n\_\*.py files (for the home page, use build\_lang\_pages.py).

Run build\_lang\_pages.py first, then i18n\_build.py.

Check the final list of untranslated texts.

If you add a new page, include it in the PAGES list in i18n\_build.py and make sure it has a language selector like the others.





