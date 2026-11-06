# Builds index_it.html, index_fr.html, index_ro.html, index_ar.html from index_landing.html.
# Usage: python -I build_lang_pages.py <path to website folder>
import re
import sys

root = sys.argv[1]
src = open(root + '/index_landing.html', 'rb').read().decode('utf-8')
crlf = '\r\n' in src
src = src.replace('\r\n', '\n')

LANGS = ['it', 'fr', 'ro', 'ar']

# (english, it, fr, ro, ar)
# WRAP: english text sits alone inside a tag -> matched as >text<, replaced everywhere.
WRAP = [
    ("Home", "Home", "Accueil", "Acasă", "الرئيسية"),
    ("Women's Health", "Salute della donna", "Santé des femmes", "Sănătatea femeii", "صحة المرأة"),
    ("Lessons", "Lezioni", "Leçons", "Lecții", "الدروس"),
    ("Interactive Tools", "Strumenti interattivi", "Outils interactifs", "Instrumente interactive", "أدوات تفاعلية"),
    ("Other Services", "Altri servizi", "Autres services", "Alte servicii", "خدمات أخرى"),
    ("Research", "Ricerca", "Recherche", "Cercetare", "البحث"),
    ("Mixed Method Study", "Studio a metodi misti", "Étude à méthodes mixtes", "Studiu cu metode mixte", "دراسة بالمنهج المختلط"),
    ("Register Based Study", "Studio basato sui registri", "Étude basée sur les registres", "Studiu bazat pe registre", "دراسة قائمة على السجلات"),
    ("Interventional Study", "Studio di intervento", "Étude interventionnelle", "Studiu de intervenție", "دراسة تدخلية"),
    ("Publications", "Pubblicazioni", "Publications", "Publicații", "المنشورات"),
    ("Resources", "Risorse", "Ressources", "Resurse", "الموارد"),
    ("Team", "Team", "Équipe", "Echipa", "الفريق"),
    ("Contact", "Contatti", "Contact", "Contact", "اتصل بنا"),
    ("Partners", "Partner", "Partenaires", "Parteneri", "الشركاء"),
    ("Clinical Centres", "Centri clinici", "Centres cliniques", "Centre clinice", "مراكز سريرية"),
    ("Questionnaire Participants", "Partecipanti al questionario", "Participants au questionnaire", "Participanți la chestionar", "المشاركون في الاستبيان"),
    ("Qualitative Interviews", "Interviste qualitative", "Entretiens qualitatifs", "Interviuri calitative", "مقابلات نوعية"),
    ("National Registry Data Covered", "Dati del registro nazionale coperti", "Données du registre national couvertes", "Date din registrul național acoperite", "بيانات السجل الوطني المشمولة"),
    ("Navigation Guide", "Guida alla navigazione", "Guide de navigation", "Ghid de navigare", "دليل التنقل"),
    ("For women", "Per le donne", "Pour les femmes", "Pentru femei", "للنساء"),
    ("For Researchers", "Per i ricercatori", "Pour les chercheurs", "Pentru cercetători", "للباحثين"),
    ("The Challenge", "La sfida", "Le défi", "Provocarea", "التحدي"),
    ("Expected Impact", "Impatto atteso", "Impact attendu", "Impact așteptat", "الأثر المتوقع"),
    ("Research Objectives", "Obiettivi della ricerca", "Objectifs de la recherche", "Obiectivele cercetării", "أهداف البحث"),
    ("Understand Experiences", "Comprendere le esperienze", "Comprendre les expériences", "Înțelegerea experiențelor", "فهم التجارب"),
    ("Analyze Population Data", "Analizzare i dati di popolazione", "Analyser les données de population", "Analiza datelor populaționale", "تحليل بيانات السكان"),
    ("Test Interventions", "Testare gli interventi", "Tester les interventions", "Testarea intervențiilor", "اختبار التدخلات"),
    ("First step", "Primo passo", "Première étape", "Primul pas", "الخطوة الأولى"),
    ("Second step", "Secondo passo", "Deuxième étape", "Al doilea pas", "الخطوة الثانية"),
    ("Final step", "Passo finale", "Étape finale", "Pasul final", "الخطوة الأخيرة"),
    ("Collaborate with the research team", "Collabora con il gruppo di ricerca", "Collaborer avec l'équipe de recherche", "Colaborează cu echipa de cercetare", "تعاون مع فريق البحث"),
    ("Explore", "Esplora", "Explorer", "Explorează", "استكشف"),
    ("Project", "Progetto", "Projet", "Proiect", "المشروع"),
    ("Connect", "Connettiti", "Rester en contact", "Conectează-te", "تواصل"),
    ("Useful Resources", "Risorse utili", "Ressources utiles", "Resurse utile", "موارد مفيدة"),
    ("Privacy Policy", "Informativa sulla privacy", "Politique de confidentialité", "Politica de confidențialitate", "سياسة الخصوصية"),
    ("Terms of Service", "Termini di servizio", "Conditions d'utilisation", "Termeni și condiții", "شروط الخدمة"),
    ("Cookie Policy", "Cookie Policy", "Politique relative aux cookies", "Politica privind cookie-urile", "سياسة ملفات تعريف الارتباط"),
]

# RAW: exact text replaced as it is (all occurrences).
RAW = [
    ("Homepage - DCIMIT Project", "Home - Progetto DCIMIT", "Accueil - Projet DCIMIT", "Pagina principală - Proiectul DCIMIT", "الصفحة الرئيسية - مشروع DCIMIT"),
    ("The Homepage of the website developed for the DCIMIT Project",
     "La home page del sito web sviluppato per il progetto DCIMIT",
     "La page d'accueil du site web développé pour le projet DCIMIT",
     "Pagina principală a site-ului web dezvoltat pentru proiectul DCIMIT",
     "الصفحة الرئيسية للموقع الإلكتروني المطوَّر لمشروع DCIMIT"),
    ("DCIMIT, cervical cancer, clinical research",
     "DCIMIT, cancro della cervice uterina, ricerca clinica",
     "DCIMIT, cancer du col de l'utérus, recherche clinique",
     "DCIMIT, cancer de col uterin, cercetare clinică",
     "DCIMIT، سرطان عنق الرحم، البحث السريري"),
    ('Cervical Cancer Prevention and Early Detection Among <span class="title_color">Immigrants in Italy</span>',
     'Prevenzione e diagnosi precoce del cancro della cervice uterina tra gli <span class="title_color">immigrati in Italia</span>',
     'Prévention et dépistage précoce du cancer du col de l\'utérus chez les <span class="title_color">immigrés en Italie</span>',
     'Prevenirea și depistarea precoce a cancerului de col uterin în rândul <span class="title_color">imigranților din Italia</span>',
     'الوقاية من سرطان عنق الرحم والكشف المبكر عنه لدى <span class="title_color">المهاجرين في إيطاليا</span>'),
    ("Understanding and addressing health inequalities between immigrant communities and Italian natives to improve cervical cancer prevention and screening outcomes.",
     "Comprendere e affrontare le disuguaglianze di salute tra le comunità immigrate e i nativi italiani per migliorare la prevenzione del cancro della cervice uterina e gli esiti dello screening.",
     "Comprendre et réduire les inégalités de santé entre les communautés immigrées et les Italiens de naissance afin d'améliorer la prévention du cancer du col de l'utérus et les résultats du dépistage.",
     "Înțelegerea și abordarea inegalităților de sănătate dintre comunitățile de imigranți și populația nativă italiană pentru a îmbunătăți prevenirea cancerului de col uterin și rezultatele screeningului.",
     "فهم أوجه عدم المساواة في الصحة بين مجتمعات المهاجرين والإيطاليين الأصليين ومعالجتها لتحسين الوقاية من سرطان عنق الرحم ونتائج الفحص."),
    ("Explore Research ", "Esplora la ricerca ", "Découvrir la recherche ", "Explorează cercetarea ", "استكشف البحث "),
    ("Please select the option that best describes your reason for visiting",
     "Seleziona l'opzione che descrive meglio il motivo della tua visita",
     "Veuillez sélectionner l'option qui décrit le mieux la raison de votre visite",
     "Te rugăm să selectezi opțiunea care descrie cel mai bine motivul vizitei tale",
     "يرجى اختيار الخيار الذي يصف سبب زيارتك على أفضل وجه"),
    ("Choose the best suited option to reach the section of the website most useful for you.",
     "Scegli l'opzione più adatta per raggiungere la sezione del sito più utile per te.",
     "Choisissez l'option la plus adaptée pour accéder à la section du site qui vous est la plus utile.",
     "Alege opțiunea potrivită pentru a ajunge la secțiunea site-ului cea mai utilă pentru tine.",
     "اختر الخيار الأنسب للوصول إلى القسم الأكثر فائدة لك في الموقع."),
    ("DCIMIT provides accessible, information to help you understand cervical cancer prevention, screening options and when to seek medical advice",
     "DCIMIT offre informazioni accessibili per aiutarti a comprendere la prevenzione del cancro della cervice uterina, le opzioni di screening e quando rivolgersi a un medico",
     "DCIMIT propose des informations accessibles pour vous aider à comprendre la prévention du cancer du col de l'utérus, les options de dépistage et le moment de consulter un médecin",
     "DCIMIT oferă informații accesibile care te ajută să înțelegi prevenirea cancerului de col uterin, opțiunile de screening și când să ceri sfatul medicului",
     "يوفر DCIMIT معلومات متاحة تساعدك على فهم الوقاية من سرطان عنق الرحم وخيارات الفحص ومتى تطلبين المشورة الطبية"),
    ("Find reliable information on cervical cancer prevention",
     "Trova informazioni affidabili sulla prevenzione del cancro della cervice uterina",
     "Trouvez des informations fiables sur la prévention du cancer du col de l'utérus",
     "Găsește informații de încredere despre prevenirea cancerului de col uterin",
     "اعثري على معلومات موثوقة حول الوقاية من سرطان عنق الرحم"),
    ("If you are a woman seeking access to appropriate information and care",
     "Se sei una donna e cerchi accesso a informazioni e cure appropriate",
     "Si vous êtes une femme et recherchez des informations et des soins adaptés",
     "Dacă ești o femeie care caută acces la informații și îngrijire adecvate",
     "إذا كنتِ امرأة تبحثين عن معلومات ورعاية مناسبة"),
    ("DCIMIT project's aim is generating evidence to inform more equitable and culturally responsive screening strategies",
     "L'obiettivo del progetto DCIMIT è generare evidenze per orientare strategie di screening più eque e culturalmente sensibili",
     "L'objectif du projet DCIMIT est de produire des données probantes pour éclairer des stratégies de dépistage plus équitables et adaptées aux cultures",
     "Scopul proiectului DCIMIT este să genereze dovezi care să orienteze strategii de screening mai echitabile și adaptate cultural",
     "يهدف مشروع DCIMIT إلى توليد أدلة تسهم في وضع استراتيجيات فحص أكثر إنصافًا وأكثر مراعاة للخصوصية الثقافية"),
    ("Discover how you can contribute to the research",
     "Scopri come puoi contribuire alla ricerca",
     "Découvrez comment contribuer à la recherche",
     "Descoperă cum poți contribui la cercetare",
     "اكتشف كيف يمكنك المساهمة في البحث"),
    ("We welcome researchers interested in advancing evidence and knowledge in this field",
     "Accogliamo con piacere i ricercatori interessati a far progredire le evidenze e le conoscenze in questo campo",
     "Nous accueillons les chercheurs souhaitant faire progresser les connaissances et les données probantes dans ce domaine",
     "Îi primim cu plăcere pe cercetătorii interesați să avanseze dovezile și cunoștințele din acest domeniu",
     "نرحب بالباحثين المهتمين بتطوير الأدلة والمعرفة في هذا المجال"),
    ("Cervical cancer is highly preventable through regular screening, yet significant disparities exist in screening uptake and health outcomes between immigrant and native Italian populations.",
     "Il cancro della cervice uterina è altamente prevenibile attraverso lo screening regolare, eppure esistono disparità significative nell'adesione allo screening e negli esiti di salute tra le popolazioni immigrate e quelle native italiane.",
     "Le cancer du col de l'utérus est hautement évitable grâce à un dépistage régulier, mais d'importantes disparités existent dans le recours au dépistage et dans les résultats de santé entre les populations immigrées et les populations italiennes d'origine.",
     "Cancerul de col uterin poate fi prevenit în mare măsură prin screening regulat, însă există disparități semnificative în participarea la screening și în rezultatele de sănătate între populațiile de imigranți și cele native italiene.",
     "يمكن الوقاية من سرطان عنق الرحم إلى حد كبير عبر الفحص المنتظم، ومع ذلك توجد فوارق كبيرة في الإقبال على الفحص وفي النتائج الصحية بين المهاجرين والسكان الإيطاليين الأصليين."),
    ("Systematic data on these disparities across immigrant groups and regions remain limited. The DCIMIT project aims to contribute evidence that can inform the design of culturally sensitive interventions..",
     "I dati sistematici su queste disparità tra gruppi di immigrati e regioni sono ancora limitati. Il progetto DCIMIT mira a fornire evidenze utili a orientare la progettazione di interventi culturalmente sensibili.",
     "Les données systématiques sur ces disparités entre groupes d'immigrés et entre régions restent limitées. Le projet DCIMIT vise à apporter des données probantes pouvant éclairer la conception d'interventions adaptées aux cultures.",
     "Datele sistematice despre aceste disparități între grupurile de imigranți și regiuni rămân limitate. Proiectul DCIMIT urmărește să furnizeze dovezi care să orienteze proiectarea unor intervenții sensibile cultural.",
     "لا تزال البيانات المنهجية حول هذه الفوارق بين مجموعات المهاجرين والمناطق محدودة. ويهدف مشروع DCIMIT إلى تقديم أدلة يمكن أن تسترشد بها عملية تصميم تدخلات مراعية للخصوصية الثقافية."),
    ("Health inequalities in cervical cancer prevention can be influenced by differences in access to healthcare, health information, language, and socioeconomic circumstances. These factors may affect participation in screening and access to appropriate information and care.",
     "Le disuguaglianze di salute nella prevenzione del cancro della cervice uterina possono dipendere da differenze nell'accesso all'assistenza sanitaria, nell'informazione sanitaria, nella lingua e nelle condizioni socioeconomiche. Questi fattori possono influire sulla partecipazione allo screening e sull'accesso a informazioni e cure appropriate.",
     "Les inégalités de santé dans la prévention du cancer du col de l'utérus peuvent être influencées par des différences d'accès aux soins, d'information en santé, de langue et de situation socio-économique. Ces facteurs peuvent affecter la participation au dépistage ainsi que l'accès à des informations et à des soins appropriés.",
     "Inegalitățile de sănătate în prevenirea cancerului de col uterin pot fi influențate de diferențe în accesul la servicii de sănătate, informarea medicală, limbă și situația socioeconomică. Acești factori pot afecta participarea la screening și accesul la informații și îngrijire adecvate.",
     "قد تتأثر أوجه عدم المساواة الصحية في الوقاية من سرطان عنق الرحم بالاختلافات في الوصول إلى الرعاية الصحية والمعلومات الصحية واللغة والظروف الاجتماعية والاقتصادية. وقد تؤثر هذه العوامل في المشاركة في الفحص وفي الحصول على المعلومات والرعاية المناسبة."),
    ("DCIMIT investigates these inequalities among migrant populations in Italy, with the aim of improving understanding of the barriers that may contribute to differences in cervical cancer prevention and early detection.",
     "DCIMIT indaga queste disuguaglianze tra le popolazioni migranti in Italia, con l'obiettivo di comprendere meglio le barriere che possono contribuire alle differenze nella prevenzione e nella diagnosi precoce del cancro della cervice uterina.",
     "DCIMIT étudie ces inégalités parmi les populations migrantes en Italie, dans le but de mieux comprendre les obstacles qui peuvent contribuer aux différences en matière de prévention et de dépistage précoce du cancer du col de l'utérus.",
     "DCIMIT investighează aceste inegalități în rândul populațiilor de migranți din Italia, cu scopul de a înțelege mai bine barierele care pot contribui la diferențele în prevenirea și depistarea precoce a cancerului de col uterin.",
     "يدرس مشروع DCIMIT أوجه عدم المساواة هذه بين المهاجرين في إيطاليا، بهدف تحسين فهم العقبات التي قد تسهم في الفروق في الوقاية من سرطان عنق الرحم والكشف المبكر عنه."),
    ("By generating evidence on these barriers and identifying opportunities to improve access to screening and relevant health information, the project seeks to contribute to the development of more equitable approaches to cervical cancer prevention and early detection.",
     "Generando evidenze su queste barriere e individuando opportunità per migliorare l'accesso allo screening e alle informazioni sanitarie pertinenti, il progetto intende contribuire allo sviluppo di approcci più equi alla prevenzione e alla diagnosi precoce del cancro della cervice uterina.",
     "En produisant des données probantes sur ces obstacles et en identifiant des pistes pour améliorer l'accès au dépistage et aux informations de santé pertinentes, le projet cherche à contribuer à l'élaboration d'approches plus équitables de la prévention et du dépistage précoce du cancer du col de l'utérus.",
     "Prin generarea de dovezi despre aceste bariere și identificarea oportunităților de a îmbunătăți accesul la screening și la informații medicale relevante, proiectul urmărește să contribuie la dezvoltarea unor abordări mai echitabile ale prevenirii și depistării precoce a cancerului de col uterin.",
     "ومن خلال توليد أدلة حول هذه العقبات وتحديد فرص تحسين الوصول إلى الفحص والمعلومات الصحية ذات الصلة، يسعى المشروع إلى الإسهام في تطوير نهج أكثر إنصافًا للوقاية من سرطان عنق الرحم والكشف المبكر عنه."),
    ("A systematic approach to understanding and addressing cervical cancer disparities",
     "Un approccio sistematico per comprendere e affrontare le disparità nel cancro della cervice uterina",
     "Une approche systématique pour comprendre et réduire les disparités liées au cancer du col de l'utérus",
     "O abordare sistematică pentru înțelegerea și abordarea disparităților în cancerul de col uterin",
     "نهج منهجي لفهم الفوارق في سرطان عنق الرحم ومعالجتها"),
    ("Identify determinants influencing early detection and access to care among immigrant women through questionnaires (300 participants) and in-depth interviews (60 women) across 10 clinical centers.",
     "Identificare i determinanti che influenzano la diagnosi precoce e l'accesso alle cure tra le donne immigrate attraverso questionari (300 partecipanti) e interviste approfondite (60 donne) in 10 centri clinici.",
     "Identifier les déterminants qui influencent le dépistage précoce et l'accès aux soins chez les femmes immigrées au moyen de questionnaires (300 participantes) et d'entretiens approfondis (60 femmes) dans 10 centres cliniques.",
     "Identificarea factorilor care influențează depistarea precoce și accesul la îngrijire în rândul femeilor imigrante, prin chestionare (300 de participante) și interviuri aprofundate (60 de femei) în 10 centre clinice.",
     "تحديد العوامل المؤثرة في الكشف المبكر والوصول إلى الرعاية لدى النساء المهاجرات من خلال استبيانات (300 مشاركة) ومقابلات معمّقة (60 امرأة) في 10 مراكز سريرية."),
    ("Compare cervical cancer incidence, mortality, and survival rates between immigrant and Italian-born women using national cancer registry data (2010-2022) in collaboration with AIRTUM.",
     "Confrontare incidenza, mortalità e sopravvivenza del cancro della cervice uterina tra donne immigrate e donne nate in Italia utilizzando i dati dei registri tumori nazionali (2010-2022), in collaborazione con AIRTUM.",
     "Comparer l'incidence, la mortalité et la survie du cancer du col de l'utérus entre les femmes immigrées et les femmes nées en Italie à partir des données des registres nationaux des cancers (2010-2022), en collaboration avec l'AIRTUM.",
     "Compararea incidenței, mortalității și supraviețuirii în cancerul de col uterin între femeile imigrante și cele născute în Italia, folosind datele registrelor naționale de cancer (2010-2022), în colaborare cu AIRTUM.",
     "مقارنة معدلات الإصابة بسرطان عنق الرحم والوفيات والبقاء على قيد الحياة بين النساء المهاجرات والنساء المولودات في إيطاليا باستخدام بيانات سجلات السرطان الوطنية (2010-2022) بالتعاون مع AIRTUM."),
    ("Evaluate the effectiveness of culturally tailored educational programs in increasing cervical screening participation among 205 immigrant women in Rome compared to a control group in Milan.",
     "Valutare l'efficacia di programmi educativi culturalmente adattati nell'aumentare la partecipazione allo screening cervicale tra 205 donne immigrate a Roma rispetto a un gruppo di controllo a Milano.",
     "Évaluer l'efficacité de programmes éducatifs adaptés aux cultures pour accroître la participation au dépistage du col de l'utérus chez 205 femmes immigrées à Rome, par rapport à un groupe témoin à Milan.",
     "Evaluarea eficacității programelor educaționale adaptate cultural în creșterea participării la screeningul cervical în rândul a 205 femei imigrante din Roma, comparativ cu un grup de control din Milano.",
     "تقييم فعالية البرامج التثقيفية المصمَّمة وفق الخصوصية الثقافية في زيادة المشاركة في فحص عنق الرحم بين 205 نساء مهاجرات في روما مقارنةً بمجموعة ضابطة في ميلانو."),
    ("We welcome contacts from researchers, clinicians and institutions interested in the topic.",
     "Accogliamo i contatti di ricercatori, clinici e istituzioni interessati al tema.",
     "Nous accueillons les contacts de chercheurs, de cliniciens et d'institutions intéressés par ce sujet.",
     "Primim cu plăcere contactele cercetătorilor, clinicienilor și instituțiilor interesate de acest subiect.",
     "نرحب بتواصل الباحثين والأطباء والمؤسسات المهتمة بهذا الموضوع."),
    ("Contact Research Team",
     "Contatta il gruppo di ricerca", "Contacter l'équipe de recherche", "Contactează echipa de cercetare", "تواصل مع فريق البحث"),
    ("This research was funded by AIRC as part of the MFAG - 30481 project.",
     "Questa ricerca è stata finanziata da AIRC nell'ambito del progetto MFAG - 30481.",
     "Cette recherche a été financée par l'AIRC dans le cadre du projet MFAG - 30481.",
     "Această cercetare a fost finanțată de AIRC în cadrul proiectului MFAG - 30481.",
     "تم تمويل هذا البحث من AIRC ضمن مشروع MFAG - 30481."),
    ("Principal Investigator: Valentina Biagioli",
     "Responsabile scientifico: Valentina Biagioli",
     "Responsable scientifique : Valentina Biagioli",
     "Investigator principal: Valentina Biagioli",
     "الباحث الرئيسي: Valentina Biagioli"),
    ("All rights reserved.", "Tutti i diritti riservati.", "Tous droits réservés.", "Toate drepturile rezervate.", "جميع الحقوق محفوظة."),
]

LANG_NAME = {'en': 'English', 'it': 'Italiano', 'fr': 'Français', 'ro': 'Română', 'ar': 'العربية'}
LANG_HREF = {'en': 'index_landing.html', 'it': 'index_it.html', 'fr': 'index_fr.html', 'ro': 'index_ro.html', 'ar': 'index_ar.html'}
ARIA_LABEL = {'it': 'Lingua: Italiano', 'fr': 'Langue : Français', 'ro': 'Limba: Română', 'ar': 'اللغة: العربية'}


def switcher(lang):
    items = []
    for code in ['en', 'it', 'ar', 'fr', 'ro']:
        if code == lang:
            continue
        label = code.upper()
        items.append(
            '<button type="button" role="menuitem" data-lang="%s" lang="%s" onclick="window.location.href=\'%s\';"><span>%s</span> %s</button>'
            % (code, code, LANG_HREF[code], label, LANG_NAME[code])
        )
    return (
        '<button type="button" class="lang-current active" data-lang="%s" aria-haspopup="true" aria-expanded="false" aria-label="%s">%s <i class="bi bi-chevron-down"></i></button>'
        '<div class="lang-menu" role="menu">%s</div>' % (lang, ARIA_LABEL[lang], lang.upper(), ''.join(items))
    )


for idx, lang in enumerate(LANGS, start=1):
    out = src

    # Localized home links (logo, Home, hero button) before the text replacements.
    home = LANG_HREF[lang]
    for old, new in [
        ('<a href="index.html" class="logo d-flex align-items-center">', '<a href="%s" class="logo d-flex align-items-center">' % home),
        ('<a href="index.html" class="active">', '<a href="%s" class="active">' % home),
        ('href="index_landing.html#service-details-2"', 'href="%s#service-details-2"' % home),
    ]:
        assert out.count(old) == 1, old
        out = out.replace(old, new)

    # Long and single texts first.
    for row in RAW:
        en, tr = row[0], row[idx]
        assert en in out, 'missing RAW: ' + en
        out = out.replace(en, tr)

    for row in WRAP:
        en, tr = row[0], row[idx]
        needle = '>%s<' % en
        assert needle in out, 'missing WRAP: ' + en
        out = out.replace(needle, '>%s<' % tr)

    # Language switcher: current language + the others.
    pat = re.compile(r'<button type="button" class="lang-current.*?</div>', re.S)
    assert len(pat.findall(out)) == 1
    out = pat.sub(lambda m: switcher(lang), out, count=1)

    # Document language / direction.
    if lang == 'ar':
        out = out.replace('<html lang="en">', '<html lang="ar" dir="rtl">', 1)
        out = out.replace(
            '&family=Lato:ital,wght@0,100;0,300;0,400;0,700;0,900;1,100;1,300;1,400;1,700;1,900&display=swap',
            '&family=Lato:ital,wght@0,100;0,300;0,400;0,700;0,900;1,100;1,300;1,400;1,700;1,900&family=Cairo:wght@300;400;500;600;700;800&display=swap',
            1,
        )
        out = out.replace(
            '<link href="assets/css/main.css" rel="stylesheet">',
            '<link href="assets/css/main.css" rel="stylesheet">\n  <link href="assets/css/rtl.css" rel="stylesheet">',
            1,
        )
    else:
        out = out.replace('<html lang="en">', '<html lang="%s">' % lang, 1)

    if crlf:
        out = out.replace('\n', '\r\n')
    open('%s/index_%s.html' % (root, lang), 'wb').write(out.encode('utf-8'))
    print('written index_%s.html' % lang)
