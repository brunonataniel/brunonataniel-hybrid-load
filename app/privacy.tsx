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
          <Text style={styles.title}>DATENSCHUTZ</Text>
        </View>

        {DE_SECTIONS.map((section, index) => (
          <View key={`de-${index}`} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <Text style={styles.sectionBody}>{section.body}</Text>
          </View>
        ))}

        <View style={styles.copyrightSection}>
          <Text style={styles.copyrightText}>
            Copyright-Hinweis: Diese Datenschutzerkl\u00e4rung wurde von den Fachanw\u00e4lten der IT-Recht Kanzlei erstellt und ist urheberrechtlich gesch\u00fctzt (https://www.it-recht-kanzlei.de)
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
});
