import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Shield } from 'lucide-react-native';
import { Colors } from '@/constants/colors';

const EN_SECTIONS = [
  {
    title: '1) Introduction and contact details of the controller',
    body: `1.1 We are delighted that you are visiting our website and thank you for your interest. Below, we provide information about how we handle your personal data when you use our website. Personal data refers to all data that can be used to identify you personally.\n\n1.2 The controller responsible for data processing on this website within the meaning of the General Data Protection Regulation (GDPR) is Bruno Nataniel Cuino Fernandes, Boberstrasse 4, 22547 Hamburg, Germany, email: support@hybridload.com. The controller responsible for processing personal data is the natural or legal person who, alone or jointly with others, decides on the purposes and means of processing personal data.`,
  },
  {
    title: '2) Data collection when visiting our website',
    body: `2.1 When you use our website for informational purposes only, i.e., if you do not register or otherwise provide us with information, we only collect data that your browser transmits to the page server (so-called "server log files"). When you visit our website, we collect the following data, which is technically necessary for us to display the website to you:\n\n\u2022 Our visited website\n\u2022 Date and time of access\n\u2022 Amount of data sent in bytes\n\u2022 Source/reference from which you accessed the site\n\u2022 Browser used\n\u2022 Operating system used\n\u2022 IP address used (if applicable: in anonymized form)\n\nThe processing is carried out in accordance with Art. 6 (1) lit. f GDPR on the basis of our legitimate interest in improving the stability and functionality of our website. The data will not be passed on or used for any other purpose. However, we reserve the right to check the server log files retrospectively if there are concrete indications of illegal use.\n\n2.2 For security reasons and to protect the transmission of personal data and other confidential content (e.g., orders or inquiries to the controller), this website uses SSL or TLS encryption. You can recognize an encrypted connection by the string "https://" and the lock symbol in your browser line.`,
  },
  {
    title: '3) Hosting & Content Delivery Network',
    body: `3.1 For the hosting of our website and the presentation of the page content, we use a provider who provides its services itself or through selected subcontractors exclusively on servers within the European Union.\nAll data collected on our website is processed on these servers.\nWe have concluded a data processing agreement with the provider that ensures the protection of our website visitors' data and prohibits unauthorized disclosure to third parties.\n\n3.2 Cloudflare\nWe use a content delivery network from the following provider: Cloudflare Inc., 101 Townsend St. San Francisco, CA 94107, USA\nThis service enables us to deliver large media files such as graphics, page content, or scripts more quickly via a network of regionally distributed servers. The processing is carried out to safeguard our legitimate interest in improving the stability and functionality of our website in accordance with Art. 6 (1) lit. f GDPR. We have concluded a data processing agreement with the provider that ensures the protection of our website visitors' data and prohibits unauthorized disclosure to third parties.\nFor data transfers to the USA, the provider has joined the EU-US Data Privacy Framework, which ensures compliance with European data protection standards on the basis of an adequacy decision by the European Commission.\n\n3.3 Fastly\nWe use a content delivery network from the following provider: Fastly Inc., 475 Brannan St. #300, San Francisco, CA 94107, USA\nThis service enables us to deliver large media files such as graphics, page content, or scripts more quickly via a network of regionally distributed servers. The processing is carried out to protect our legitimate interest in improving the stability and functionality of our website in accordance with Art. 6 (1) lit. f GDPR. We have concluded a data processing agreement with the provider that ensures the protection of our website visitors' data and prohibits unauthorized disclosure to third parties.\nFor data transfers to the USA, the provider has joined the EU-US Data Privacy Framework, which ensures compliance with European data protection standards on the basis of an adequacy decision by the European Commission.`,
  },
  {
    title: '4) Cookies',
    body: `In order to make visiting our website attractive and to enable the use of certain functions, we use cookies, i.e., small text files that are stored on your device. Some of these cookies are automatically deleted after closing the browser (so-called "session cookies"), while others remain on your device for a longer period of time and enable the storage of page settings (so-called "persistent cookies"). In the latter case, you can find the storage period in the overview of your web browser's cookie settings.\n\nIf personal data is also processed by individual cookies used by us, the processing is carried out in accordance with Art. 6 (1) lit. b GDPR either for the performance of the contract, pursuant to Art. 6 (1) (a) GDPR in the case of consent, or pursuant to Art. 6 (1) (f) GDPR to safeguard our legitimate interests in the best possible functionality of the website and a customer-friendly and effective design of the site visit.\n\nYou can set your browser so that you are informed about the setting of cookies and can decide individually whether to accept them or to exclude the acceptance of cookies in certain cases or in general.\n\nPlease note that if you do not accept cookies, the functionality of our website may be limited.`,
  },
  {
    title: '5) Contact',
    body: `When you contact us (e.g., via contact form or email), personal data is processed exclusively for the purpose of processing and responding to your request and only to the extent necessary for this purpose.\n\nThe legal basis for the processing of this data is our legitimate interest in responding to your request in accordance with Art. 6 (1) lit. f GDPR. If your contact is aimed at concluding a contract, the additional legal basis for processing is Art. 6 (1) lit. b GDPR. Your data will be deleted if it can be inferred from the circumstances that the matter in question has been conclusively clarified and provided that there are no legal retention obligations to the contrary.`,
  },
  {
    title: '6) Data processing for order processing',
    body: `Insofar as necessary for the execution of the contract for delivery and payment purposes, the personal data collected by us will be passed on to the commissioned transport company and the commissioned credit institution in accordance with Art. 6 (1) lit. b GDPR.\n\nIf we owe you updates for goods with digital elements or for digital products on the basis of a corresponding contract, we will process the contact data you provided when placing your order in order to inform you personally within the scope of our legal information obligations in accordance with Art. 6 (1) lit. c GDPR. Your contact details will be used strictly for the purpose of communicating updates owed by us and will only be processed by us to the extent necessary for the respective information.\n\nTo process your order, we also work with the following service provider(s), who support us in whole or in part in the execution of concluded contracts. Certain personal data is transferred to these service providers in accordance with the following information.`,
  },
  {
    title: '7) Rights of the data subject',
    body: `7.1 The applicable data protection law grants you the following rights as a data subject (rights of access and intervention) vis-a-vis the controller with regard to the processing of your personal data, whereby reference is made to the legal basis cited for the respective conditions for exercising these rights:\n\n\u2022 Right of access pursuant to Art. 15 GDPR\n\u2022 Right to rectification pursuant to Art. 16 GDPR\n\u2022 Right to erasure pursuant to Art. 17 GDPR\n\u2022 Right to restriction of processing pursuant to Art. 18 GDPR\n\u2022 Right to notification pursuant to Art. 19 GDPR\n\u2022 Right to data portability pursuant to Art. 20 GDPR\n\u2022 Right to withdraw consent pursuant to Art. 7 (3) GDPR\n\u2022 Right to lodge a complaint pursuant to Art. 77 GDPR\n\n7.2 RIGHT TO OBJECT\n\nIF WE PROCESS YOUR PERSONAL DATA ON THE BASIS OF OUR OVERRIDING LEGITIMATE INTEREST IN THE CONTEXT OF A BALANCING OF INTERESTS, YOU HAVE THE RIGHT TO OBJECT TO THIS PROCESSING AT ANY TIME FOR REASONS ARISING FROM YOUR PARTICULAR SITUATION, WITH EFFECT FOR THE FUTURE.\n\nIF YOU EXERCISE YOUR RIGHT TO OBJECT, WE WILL STOP PROCESSING THE DATA CONCERNED. HOWEVER, FURTHER PROCESSING REMAINS RESERVED IF WE CAN PROVE COMPELLING LEGITIMATE GROUNDS FOR THE PROCESSING THAT OUTWEIGH YOUR INTERESTS, FUNDAMENTAL RIGHTS AND FREEDOMS, OR IF THE PROCESSING SERVES TO ASSERT, EXERCISE, OR DEFEND LEGAL CLAIMS.\n\nIF WE PROCESS YOUR PERSONAL DATA FOR DIRECT MARKETING PURPOSES, YOU HAVE THE RIGHT TO OBJECT AT ANY TIME TO THE PROCESSING OF PERSONAL DATA CONCERNING YOU FOR THE PURPOSE OF SUCH ADVERTISING. YOU CAN EXERCISE YOUR RIGHT TO OBJECT AS DESCRIBED ABOVE.\n\nIF YOU EXERCISE YOUR RIGHT TO OBJECT, WE WILL STOP PROCESSING THE DATA CONCERNING YOU FOR DIRECT MARKETING PURPOSES.`,
  },
  {
    title: '8) Duration of storage of personal data',
    body: `The duration of the storage of personal data is determined by the respective legal basis, the purpose of processing and, if relevant, additionally by the respective statutory retention period (e.g., commercial and tax law retention periods).\n\nWhen processing personal data on the basis of express consent in accordance with Art. 6 (1) (a) GDPR, the data concerned will be stored until you revoke your consent.\n\nIf there are statutory retention periods for data that is processed within the framework of legal or quasi-legal obligations on the basis of Art. 6 (1) (b) GDPR, this data will be routinely deleted after the retention periods have expired, provided that it is no longer necessary for the fulfillment or initiation of a contract and/or we no longer have a legitimate interest in continuing to store it.\n\nWhen processing personal data on the basis of Art. 6 (1) lit. f GDPR, this data will be stored until you exercise your right to object under Art. 21 (1) GDPR, unless we can demonstrate compelling legitimate grounds for the processing which override your interests, rights, and freedoms, or the processing serves to assert, exercise, or defend legal claims.\n\nWhen processing personal data for the purpose of direct marketing on the basis of Art. 6 (1) lit. f GDPR, this data will be stored until you exercise your right to object under Art. 21 (2) GDPR.\n\nUnless otherwise specified in the other information in this statement regarding specific processing situations, stored personal data will otherwise be deleted when it is no longer necessary for the purposes for which it was collected or otherwise processed.`,
  },
];

const DE_SECTIONS = [
  {
    title: '1) Einleitung und Kontaktdaten des Verantwortlichen',
    body: `1.1 Wir freuen uns, dass Sie unsere Website besuchen, und bedanken uns fur Ihr Interesse. Im Folgenden informieren wir Sie uber den Umgang mit Ihren personenbezogenen Daten bei der Nutzung unserer Website. Personenbezogene Daten sind hierbei alle Daten, mit denen Sie personlich identifiziert werden konnen.\n\n1.2 Verantwortlicher fur die Datenverarbeitung auf dieser Website im Sinne der Datenschutz-Grundverordnung (DSGVO) ist Bruno Nataniel Cuino Fernandes, Boberstra\u00dfe 4, 22547 Hamburg, Deutschland, E-Mail: support@hybridload.com. Der fur die Verarbeitung von personenbezogenen Daten Verantwortliche ist diejenige naturliche oder juristische Person, die allein oder gemeinsam mit anderen uber die Zwecke und Mittel der Verarbeitung von personenbezogenen Daten entscheidet.`,
  },
  {
    title: '2) Datenerfassung beim Besuch unserer Website',
    body: `2.1 Bei der blo\u00df informatorischen Nutzung unserer Website, also wenn Sie sich nicht registrieren oder uns anderweitig Informationen ubermitteln, erheben wir nur solche Daten, die Ihr Browser an den Seitenserver ubermittelt (sog. \u201eServer-Logfiles\u201c). Wenn Sie unsere Website aufrufen, erheben wir die folgenden Daten, die fur uns technisch erforderlich sind, um Ihnen die Website anzuzeigen:\n\n\u2022 Unsere besuchte Website\n\u2022 Datum und Uhrzeit zum Zeitpunkt des Zugriffes\n\u2022 Menge der gesendeten Daten in Byte\n\u2022 Quelle/Verweis, von welchem Sie auf die Seite gelangten\n\u2022 Verwendeter Browser\n\u2022 Verwendetes Betriebssystem\n\u2022 Verwendete IP-Adresse (ggf.: in anonymisierter Form)\n\nDie Verarbeitung erfolgt gema\u00df Art. 6 Abs. 1 lit. f DSGVO auf Basis unseres berechtigten Interesses an der Verbesserung der Stabilitat und Funktionalitat unserer Website. Eine Weitergabe oder anderweitige Verwendung der Daten findet nicht statt. Wir behalten uns allerdings vor, die Server-Logfiles nachtraglich zu uberprufen, sollten konkrete Anhaltspunkte auf eine rechtswidrige Nutzung hinweisen.\n\n2.2 Diese Website nutzt aus Sicherheitsgrunden und zum Schutz der Ubertragung personenbezogener Daten und anderer vertraulicher Inhalte (z.B. Bestellungen oder Anfragen an den Verantwortlichen) eine SSL-bzw. TLS-Verschlusselung. Sie konnen eine verschlusselte Verbindung an der Zeichenfolge \u201ehttps://\u201c und dem Schloss-Symbol in Ihrer Browserzeile erkennen.`,
  },
  {
    title: '3) Hosting & Content-Delivery-Network',
    body: `3.1 Fur das Hosting unserer Website und die Darstellung der Seiteninhalte nutzen wir einen Anbieter, der seine Leistungen selbst oder durch ausgewahlte Sub-Unternehmer ausschlie\u00dflich auf Servern innerhalb der Europaischen Union erbringt.\nSamtliche auf unserer Website erhobenen Daten werden auf diesen Servern verarbeitet.\nWir haben mit dem Anbieter einen Auftragsverarbeitungsvertrag geschlossen, der den Schutz der Daten unserer Seitenbesucher sicherstellt und eine unberechtigte Weitergabe an Dritte untersagt.\n\n3.2 Cloudflare\nWir nutzen ein Content Delivery Network des folgenden Anbieters: Cloudflare Inc., 101 Townsend St. San Francisco, CA 94107, USA\nDieser Dienst ermoglicht uns, gro\u00dfe Mediendateien wie Grafiken, Seiteninhalte oder Skripte uber ein Netz regional verteilter Server schneller auszuliefern. Die Verarbeitung erfolgt zur Wahrung unseres berechtigten Interesses an der Verbesserung der Stabilitat und Funktionalitat unserer Website gem. Art. 6 Abs. 1 lit. f DSGVO. Wir haben mit dem Anbieter einen Auftragsverarbeitungsvertrag geschlossen, der den Schutz der Daten unserer Seitenbesucher sicherstellt und eine unberechtigte Weitergabe an Dritte untersagt.\nFur Datenubermittlungen in die USA hat sich der Anbieter dem EU-US-Datenschutzrahmen (EU-US Data Privacy Framework) angeschlossen, das auf Basis eines Angemessenheitsbeschlusses der Europaischen Kommission die Einhaltung des europaischen Datenschutzniveaus sicherstellt.\n\n3.3 Fastly\nWir nutzen ein Content Delivery Network des folgenden Anbieters: Fastly Inc., 475 Brannan St. #300, San Francisco, CA 94107, USA\nDieser Dienst ermoglicht uns, gro\u00dfe Mediendateien wie Grafiken, Seiteninhalte oder Skripte uber ein Netz regional verteilter Server schneller auszuliefern. Die Verarbeitung erfolgt zur Wahrung unseres berechtigten Interesses an der Verbesserung der Stabilitat und Funktionalitat unserer Website gem. Art. 6 Abs. 1 lit. f DSGVO. Wir haben mit dem Anbieter einen Auftragsverarbeitungsvertrag geschlossen, der den Schutz der Daten unserer Seitenbesucher sicherstellt und eine unberechtigte Weitergabe an Dritte untersagt.\nFur Datenubermittlungen in die USA hat sich der Anbieter dem EU-US-Datenschutzrahmen (EU-US Data Privacy Framework) angeschlossen, das auf Basis eines Angemessenheitsbeschlusses der Europaischen Kommission die Einhaltung des europaischen Datenschutzniveaus sicherstellt.`,
  },
  {
    title: '4) Cookies',
    body: `Um den Besuch unserer Website attraktiv zu gestalten und die Nutzung bestimmter Funktionen zu ermoglichen, verwenden wir Cookies, also kleine Textdateien, die auf Ihrem Endgerat abgelegt werden. Teilweise werden diese Cookies nach Schlie\u00dfen des Browsers automatisch wieder geloscht (sog. \u201eSession-Cookies\u201c), teilweise verbleiben diese Cookies langer auf Ihrem Endgerat und ermoglichen das Speichern von Seiteneinstellungen (sog. \u201epersistente Cookies\u201c). Im letzteren Fall konnen Sie die Speicherdauer der Ubersicht zu den Cookie-Einstellungen Ihres Webbrowsers entnehmen.\n\nSofern durch einzelne von uns eingesetzte Cookies auch personenbezogene Daten verarbeitet werden, erfolgt die Verarbeitung gema\u00df Art. 6 Abs. 1 lit. b DSGVO entweder zur Durchfuhrung des Vertrages, gema\u00df Art. 6 Abs. 1 lit. a DSGVO im Falle einer erteilten Einwilligung oder gema\u00df Art. 6 Abs. 1 lit. f DSGVO zur Wahrung unserer berechtigten Interessen an der bestmoglichen Funktionalitat der Website sowie einer kundenfreundlichen und effektiven Ausgestaltung des Seitenbesuchs.\n\nSie konnen Ihren Browser so einstellen, dass Sie uber das Setzen von Cookies informiert werden und einzeln uber deren Annahme entscheiden oder die Annahme von Cookies fur bestimmte Falle oder generell ausschlie\u00dfen konnen.\n\nBitte beachten Sie, dass bei Nichtannahme von Cookies die Funktionalitat unserer Website eingeschrankt sein kann.`,
  },
  {
    title: '5) Kontaktaufnahme',
    body: `Im Rahmen der Kontaktaufnahme mit uns (z.B. per Kontaktformular oder E-Mail) werden \u2013 ausschlie\u00dflich zum Zweck der Bearbeitung und Beantwortung Ihres Anliegens und nur im dafur erforderlichen Umfang \u2013 personenbezogene Daten verarbeitet.\n\nRechtsgrundlage fur die Verarbeitung dieser Daten ist unser berechtigtes Interesse an der Beantwortung Ihres Anliegens gema\u00df Art. 6 Abs. 1 lit. f DSGVO. Zielt Ihre Kontaktierung auf einen Vertrag ab, so ist zusatzliche Rechtsgrundlage fur die Verarbeitung Art. 6 Abs. 1 lit. b DSGVO. Ihre Daten werden geloscht, wenn sich aus den Umstanden entnehmen lasst, dass der betroffene Sachverhalt abschlie\u00dfend geklart ist und sofern keine gesetzlichen Aufbewahrungspflichten entgegenstehen.`,
  },
  {
    title: '6) Datenverarbeitung zur Bestellabwicklung',
    body: `Soweit fur die Vertragsabwicklung zu Liefer- und Zahlungszwecken erforderlich, werden die von uns erhobenen personenbezogenen Daten gema\u00df Art. 6 Abs. 1 lit. b DSGVO an das beauftragte Transportunternehmen und das beauftragte Kreditinstitut weitergegeben.\n\nSofern wir Ihnen auf Grundlage eines entsprechenden Vertrages Aktualisierungen fur Waren mit digitalen Elementen oder fur digitale Produkte schulden, verarbeiten wir die von Ihnen bei der Bestellung ubermittelten Kontaktdaten, um Sie im Rahmen unserer gesetzlichen Informationspflichten gema\u00df Art. 6 Abs. 1 lit. c DSGVO personlich zu informieren. Ihre Kontaktdaten werden hierbei streng zweckgebunden fur Mitteilungen uber von uns geschuldete Aktualisierungen verwendet und zu diesem Zweck durch uns nur insoweit verarbeitet, wie dies fur die jeweilige Information erforderlich ist.\n\nZur Abwicklung Ihrer Bestellung arbeiten wir ferner mit dem / den nachstehenden Dienstleister(n) zusammen, die uns ganz oder teilweise bei der Durchfuhrung geschlossener Vertrage unterstutzen. An diese Dienstleister werden nach Ma\u00dfgabe der folgenden Informationen gewisse personenbezogene Daten ubermittelt.`,
  },
  {
    title: '7) Rechte des Betroffenen',
    body: `7.1 Das geltende Datenschutzrecht gewahrt Ihnen gegenuber dem Verantwortlichen hinsichtlich der Verarbeitung Ihrer personenbezogenen Daten die nachstehenden Betroffenenrechte (Auskunfts- und Interventionsrechte), wobei fur die jeweiligen Ausubungsvoraussetzungen auf die angefuhrte Rechtsgrundlage verwiesen wird:\n\n\u2022 Auskunftsrecht gema\u00df Art. 15 DSGVO\n\u2022 Recht auf Berichtigung gema\u00df Art. 16 DSGVO\n\u2022 Recht auf Loschung gema\u00df Art. 17 DSGVO\n\u2022 Recht auf Einschrankung der Verarbeitung gema\u00df Art. 18 DSGVO\n\u2022 Recht auf Unterrichtung gema\u00df Art. 19 DSGVO\n\u2022 Recht auf Datenubertragbarkeit gema\u00df Art. 20 DSGVO\n\u2022 Recht auf Widerruf erteilter Einwilligungen gema\u00df Art. 7 Abs. 3 DSGVO\n\u2022 Recht auf Beschwerde gema\u00df Art. 77 DSGVO\n\n7.2 WIDERSPRUCHSRECHT\n\nWENN WIR IM RAHMEN EINER INTERESSENABWAGUNG IHRE PERSONENBEZOGENEN DATEN AUFGRUND UNSERES UBERWIEGENDEN BERECHTIGTEN INTERESSES VERARBEITEN, HABEN SIE DAS JEDERZEITIGE RECHT, AUS GRUNDEN, DIE SICH AUS IHRER BESONDEREN SITUATION ERGEBEN, GEGEN DIESE VERARBEITUNG WIDERSPRUCH MIT WIRKUNG FUR DIE ZUKUNFT EINZULEGEN.\n\nMACHEN SIE VON IHREM WIDERSPRUCHSRECHT GEBRAUCH, BEENDEN WIR DIE VERARBEITUNG DER BETROFFENEN DATEN. EINE WEITERVERARBEITUNG BLEIBT ABER VORBEHALTEN, WENN WIR ZWINGENDE SCHUTZWURDIGE GRUNDE FUR DIE VERARBEITUNG NACHWEISEN KONNEN, DIE IHRE INTERESSEN, GRUNDRECHTE UND GRUNDFREIHEITEN UBERWIEGEN, ODER WENN DIE VERARBEITUNG DER GELTENDMACHUNG, AUSUBUNG ODER VERTEIDIGUNG VON RECHTSANSPRUCHEN DIENT.\n\nWERDEN IHRE PERSONENBEZOGENEN DATEN VON UNS VERARBEITET, UM DIREKTWERBUNG ZU BETREIBEN, HABEN SIE DAS RECHT, JEDERZEIT WIDERSPRUCH GEGEN DIE VERARBEITUNG SIE BETREFFENDER PERSONENBEZOGENER DATEN ZUM ZWECKE DERARTIGER WERBUNG EINZULEGEN. SIE KONNEN DEN WIDERSPRUCH WIE OBEN BESCHRIEBEN AUSUBEN.\n\nMACHEN SIE VON IHREM WIDERSPRUCHSRECHT GEBRAUCH, BEENDEN WIR DIE VERARBEITUNG DER BETROFFENEN DATEN ZU DIREKTWERBEZWECKEN.`,
  },
  {
    title: '8) Dauer der Speicherung personenbezogener Daten',
    body: `Die Dauer der Speicherung von personenbezogenen Daten bemisst sich anhand der jeweiligen Rechtsgrundlage, am Verarbeitungszweck und \u2013 sofern einschlagig \u2013 zusatzlich anhand der jeweiligen gesetzlichen Aufbewahrungsfrist (z.B. handels- und steuerrechtliche Aufbewahrungsfristen).\n\nBei der Verarbeitung von personenbezogenen Daten auf Grundlage einer ausdrucklichen Einwilligung gema\u00df Art. 6 Abs. 1 lit. a DSGVO werden die betroffenen Daten so lange gespeichert, bis Sie Ihre Einwilligung widerrufen.\n\nExistieren gesetzliche Aufbewahrungsfristen fur Daten, die im Rahmen rechtsgeschaftlicher bzw. rechtsgeschaftsahnlicher Verpflichtungen auf der Grundlage von Art. 6 Abs. 1 lit. b DSGVO verarbeitet werden, werden diese Daten nach Ablauf der Aufbewahrungsfristen routinema\u00dfig geloscht, sofern sie nicht mehr zur Vertragserfullung oder Vertragsanbahnung erforderlich sind und/oder unsererseits kein berechtigtes Interesse an der Weiterspeicherung fortbesteht.\n\nBei der Verarbeitung von personenbezogenen Daten auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO werden diese Daten so lange gespeichert, bis Sie Ihr Widerspruchsrecht nach Art. 21 Abs. 1 DSGVO ausuben, es sei denn, wir konnen zwingende schutzwurdige Grunde fur die Verarbeitung nachweisen, die Ihre Interessen, Rechte und Freiheiten uberwiegen, oder die Verarbeitung dient der Geltendmachung, Ausubung oder Verteidigung von Rechtsanspruchen.\n\nBei der Verarbeitung von personenbezogenen Daten zum Zwecke der Direktwerbung auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO werden diese Daten so lange gespeichert, bis Sie Ihr Widerspruchsrecht nach Art. 21 Abs. 2 DSGVO ausuben.\n\nSofern sich aus den sonstigen Informationen dieser Erklarung uber spezifische Verarbeitungssituationen nichts anderes ergibt, werden gespeicherte personenbezogene Daten im Ubrigen dann geloscht, wenn sie fur die Zwecke, fur die sie erhoben oder auf sonstige Weise verarbeitet wurden, nicht mehr notwendig sind.`,
  },
];

export default function PrivacyScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 12, paddingBottom: insets.bottom + 40 }]}
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          testID="privacy-back"
        >
          <ArrowLeft size={20} color={Colors.textSecondary} />
        </TouchableOpacity>

        <View style={styles.header}>
          <View style={styles.iconWrap}>
            <Shield size={24} color={Colors.accent} />
          </View>
          <Text style={styles.title}>PRIVACY POLICY / DATENSCHUTZ</Text>
        </View>

        <View style={styles.langLabel}>
          <Text style={styles.langLabelText}>ENGLISH</Text>
        </View>

        {EN_SECTIONS.map((section, index) => (
          <View key={`en-${index}`} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <Text style={styles.sectionBody}>{section.body}</Text>
          </View>
        ))}

        <View style={styles.copyrightSection}>
          <Text style={styles.copyrightText}>
            Copyright notice: This privacy policy was created by the specialist lawyers at IT-Recht Kanzlei and is protected by copyright (https://www.it-recht-kanzlei.de).
          </Text>
        </View>

        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>
            English version for convenience; the German version below is legally binding.
          </Text>
          <View style={styles.dividerLine} />
        </View>

        <View style={styles.langLabel}>
          <Text style={styles.langLabelText}>DEUTSCH</Text>
        </View>

        {DE_SECTIONS.map((section, index) => (
          <View key={`de-${index}`} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <Text style={styles.sectionBody}>{section.body}</Text>
          </View>
        ))}

        <View style={styles.copyrightSection}>
          <Text style={styles.copyrightText}>
            Diese Datenschutzerkl\u00e4rung wurde von den Fachanw\u00e4lten der IT-Recht Kanzlei erstellt und ist urheberrechtlich gesch\u00fctzt.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  header: {
    marginBottom: 32,
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: Colors.accentDim,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '900' as const,
    color: '#FFFFFF',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  langLabel: {
    marginBottom: 16,
  },
  langLabelText: {
    fontSize: 11,
    fontWeight: '700' as const,
    color: Colors.accent,
    letterSpacing: 2,
  },
  section: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: '#FFFFFF',
    marginBottom: 10,
  },
  sectionBody: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 22,
  },
  copyrightSection: {
    marginTop: 12,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  copyrightText: {
    fontSize: 12,
    color: Colors.textTertiary,
    lineHeight: 18,
    marginBottom: 4,
  },
  divider: {
    marginVertical: 32,
    alignItems: 'center',
    gap: 12,
  },
  dividerLine: {
    height: 1,
    width: '100%',
    backgroundColor: Colors.border,
  },
  dividerText: {
    fontSize: 12,
    color: Colors.textTertiary,
    textAlign: 'center' as const,
    lineHeight: 18,
    fontStyle: 'italic' as const,
    paddingHorizontal: 8,
  },
});
