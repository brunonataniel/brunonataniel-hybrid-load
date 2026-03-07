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

const SECTIONS = [
  {
    title: '1) Einleitung und Kontaktdaten des Verantwortlichen',
    body: `1.1 Wir freuen uns, dass Sie unsere Website besuchen, und bedanken uns für Ihr Interesse. Im Folgenden informieren wir Sie über den Umgang mit Ihren personenbezogenen Daten bei der Nutzung unserer Website. Personenbezogene Daten sind hierbei alle Daten, mit denen Sie persönlich identifiziert werden können.\n\n1.2 Verantwortlicher für die Datenverarbeitung auf dieser Website im Sinne der Datenschutz-Grundverordnung (DSGVO) ist Bruno Nataniel Cuíno Fernandes, Boberstraße 4, 22547 Hamburg, Deutschland, E-Mail: support@hybridload.com. Der für die Verarbeitung von personenbezogenen Daten Verantwortliche ist diejenige natürliche oder juristische Person, die allein oder gemeinsam mit anderen über die Zwecke und Mittel der Verarbeitung von personenbezogenen Daten entscheidet.`,
  },
  {
    title: '2) Datenerfassung beim Besuch unserer Website',
    body: `2.1 Bei der bloß informatorischen Nutzung unserer Website, also wenn Sie sich nicht registrieren oder uns anderweitig Informationen übermitteln, erheben wir nur solche Daten, die Ihr Browser an den Seitenserver übermittelt (sog. „Server-Logfiles"). Wenn Sie unsere Website aufrufen, erheben wir die folgenden Daten, die für uns technisch erforderlich sind, um Ihnen die Website anzuzeigen:\n\n• Unsere besuchte Website\n• Datum und Uhrzeit zum Zeitpunkt des Zugriffes\n• Menge der gesendeten Daten in Byte\n• Quelle/Verweis, von welchem Sie auf die Seite gelangten\n• Verwendeter Browser\n• Verwendetes Betriebssystem\n• Verwendete IP-Adresse (ggf.: in anonymisierter Form)\n\nDie Verarbeitung erfolgt gemäß Art. 6 Abs. 1 lit. f DSGVO auf Basis unseres berechtigten Interesses an der Verbesserung der Stabilität und Funktionalität unserer Website. Eine Weitergabe oder anderweitige Verwendung der Daten findet nicht statt. Wir behalten uns allerdings vor, die Server-Logfiles nachträglich zu überprüfen, sollten konkrete Anhaltspunkte auf eine rechtswidrige Nutzung hinweisen.\n\n2.2 Diese Website nutzt aus Sicherheitsgründen und zum Schutz der Übertragung personenbezogener Daten und anderer vertraulicher Inhalte (z.B. Bestellungen oder Anfragen an den Verantwortlichen) eine SSL-bzw. TLS-Verschlüsselung. Sie können eine verschlüsselte Verbindung an der Zeichenfolge „https://" und dem Schloss-Symbol in Ihrer Browserzeile erkennen.`,
  },
  {
    title: '3) Hosting & Content-Delivery-Network',
    body: `3.1 Für das Hosting unserer Website und die Darstellung der Seiteninhalte nutzen wir einen Anbieter, der seine Leistungen selbst oder durch ausgewählte Sub-Unternehmer ausschließlich auf Servern innerhalb der Europäischen Union erbringt.\nSämtliche auf unserer Website erhobenen Daten werden auf diesen Servern verarbeitet.\nWir haben mit dem Anbieter einen Auftragsverarbeitungsvertrag geschlossen, der den Schutz der Daten unserer Seitenbesucher sicherstellt und eine unberechtigte Weitergabe an Dritte untersagt.\n\n3.2 Cloudflare\nWir nutzen ein Content Delivery Network des folgenden Anbieters: Cloudflare Inc., 101 Townsend St. San Francisco, CA 94107, USA\nDieser Dienst ermöglicht uns, große Mediendateien wie Grafiken, Seiteninhalte oder Skripte über ein Netz regional verteilter Server schneller auszuliefern. Die Verarbeitung erfolgt zur Wahrung unseres berechtigten Interesses an der Verbesserung der Stabilität und Funktionalität unserer Website gem. Art. 6 Abs. 1 lit. f DSGVO. Wir haben mit dem Anbieter einen Auftragsverarbeitungsvertrag geschlossen, der den Schutz der Daten unserer Seitenbesucher sicherstellt und eine unberechtigte Weitergabe an Dritte untersagt.\nFür Datenübermittlungen in die USA hat sich der Anbieter dem EU-US-Datenschutzrahmen (EU-US Data Privacy Framework) angeschlossen, das auf Basis eines Angemessenheitsbeschlusses der Europäischen Kommission die Einhaltung des europäischen Datenschutzniveaus sicherstellt.\n\n3.3 Fastly\nWir nutzen ein Content Delivery Network des folgenden Anbieters: Fastly Inc., 475 Brannan St. #300, San Francisco, CA 94107, USA\nDieser Dienst ermöglicht uns, große Mediendateien wie Grafiken, Seiteninhalte oder Skripte über ein Netz regional verteilter Server schneller auszuliefern. Die Verarbeitung erfolgt zur Wahrung unseres berechtigten Interesses an der Verbesserung der Stabilität und Funktionalität unserer Website gem. Art. 6 Abs. 1 lit. f DSGVO. Wir haben mit dem Anbieter einen Auftragsverarbeitungsvertrag geschlossen, der den Schutz der Daten unserer Seitenbesucher sicherstellt und eine unberechtigte Weitergabe an Dritte untersagt.\nFür Datenübermittlungen in die USA hat sich der Anbieter dem EU-US-Datenschutzrahmen (EU-US Data Privacy Framework) angeschlossen, das auf Basis eines Angemessenheitsbeschlusses der Europäischen Kommission die Einhaltung des europäischen Datenschutzniveaus sicherstellt.`,
  },
  {
    title: '4) Cookies',
    body: `Um den Besuch unserer Website attraktiv zu gestalten und die Nutzung bestimmter Funktionen zu ermöglichen, verwenden wir Cookies, also kleine Textdateien, die auf Ihrem Endgerät abgelegt werden. Teilweise werden diese Cookies nach Schließen des Browsers automatisch wieder gelöscht (sog. „Session-Cookies"), teilweise verbleiben diese Cookies länger auf Ihrem Endgerät und ermöglichen das Speichern von Seiteneinstellungen (sog. „persistente Cookies"). Im letzteren Fall können Sie die Speicherdauer der Übersicht zu den Cookie-Einstellungen Ihres Webbrowsers entnehmen.\n\nSofern durch einzelne von uns eingesetzte Cookies auch personenbezogene Daten verarbeitet werden, erfolgt die Verarbeitung gemäß Art. 6 Abs. 1 lit. b DSGVO entweder zur Durchführung des Vertrages, gemäß Art. 6 Abs. 1 lit. a DSGVO im Falle einer erteilten Einwilligung oder gemäß Art. 6 Abs. 1 lit. f DSGVO zur Wahrung unserer berechtigten Interessen an der bestmöglichen Funktionalität der Website sowie einer kundenfreundlichen und effektiven Ausgestaltung des Seitenbesuchs.\n\nSie können Ihren Browser so einstellen, dass Sie über das Setzen von Cookies informiert werden und einzeln über deren Annahme entscheiden oder die Annahme von Cookies für bestimmte Fälle oder generell ausschließen können.\n\nBitte beachten Sie, dass bei Nichtannahme von Cookies die Funktionalität unserer Website eingeschränkt sein kann.`,
  },
  {
    title: '5) Kontaktaufnahme',
    body: `Im Rahmen der Kontaktaufnahme mit uns (z.B. per Kontaktformular oder E-Mail) werden – ausschließlich zum Zweck der Bearbeitung und Beantwortung Ihres Anliegens und nur im dafür erforderlichen Umfang – personenbezogene Daten verarbeitet.\n\nRechtsgrundlage für die Verarbeitung dieser Daten ist unser berechtigtes Interesse an der Beantwortung Ihres Anliegens gemäß Art. 6 Abs. 1 lit. f DSGVO. Zielt Ihre Kontaktierung auf einen Vertrag ab, so ist zusätzliche Rechtsgrundlage für die Verarbeitung Art. 6 Abs. 1 lit. b DSGVO. Ihre Daten werden gelöscht, wenn sich aus den Umständen entnehmen lässt, dass der betroffene Sachverhalt abschließend geklärt ist und sofern keine gesetzlichen Aufbewahrungspflichten entgegenstehen.`,
  },
  {
    title: '6) Datenverarbeitung zur Bestellabwicklung',
    body: `Soweit für die Vertragsabwicklung zu Liefer- und Zahlungszwecken erforderlich, werden die von uns erhobenen personenbezogenen Daten gemäß Art. 6 Abs. 1 lit. b DSGVO an das beauftragte Transportunternehmen und das beauftragte Kreditinstitut weitergegeben.\n\nSofern wir Ihnen auf Grundlage eines entsprechenden Vertrages Aktualisierungen für Waren mit digitalen Elementen oder für digitale Produkte schulden, verarbeiten wir die von Ihnen bei der Bestellung übermittelten Kontaktdaten, um Sie im Rahmen unserer gesetzlichen Informationspflichten gemäß Art. 6 Abs. 1 lit. c DSGVO persönlich zu informieren. Ihre Kontaktdaten werden hierbei streng zweckgebunden für Mitteilungen über von uns geschuldete Aktualisierungen verwendet und zu diesem Zweck durch uns nur insoweit verarbeitet, wie dies für die jeweilige Information erforderlich ist.\n\nZur Abwicklung Ihrer Bestellung arbeiten wir ferner mit dem / den nachstehenden Dienstleister(n) zusammen, die uns ganz oder teilweise bei der Durchführung geschlossener Verträge unterstützen. An diese Dienstleister werden nach Maßgabe der folgenden Informationen gewisse personenbezogene Daten übermittelt.`,
  },
  {
    title: '7) Rechte des Betroffenen',
    body: `7.1 Das geltende Datenschutzrecht gewährt Ihnen gegenüber dem Verantwortlichen hinsichtlich der Verarbeitung Ihrer personenbezogenen Daten die nachstehenden Betroffenenrechte (Auskunfts- und Interventionsrechte), wobei für die jeweiligen Ausübungsvoraussetzungen auf die angeführte Rechtsgrundlage verwiesen wird:\n\n• Auskunftsrecht gemäß Art. 15 DSGVO\n• Recht auf Berichtigung gemäß Art. 16 DSGVO\n• Recht auf Löschung gemäß Art. 17 DSGVO\n• Recht auf Einschränkung der Verarbeitung gemäß Art. 18 DSGVO\n• Recht auf Unterrichtung gemäß Art. 19 DSGVO\n• Recht auf Datenübertragbarkeit gemäß Art. 20 DSGVO\n• Recht auf Widerruf erteilter Einwilligungen gemäß Art. 7 Abs. 3 DSGVO\n• Recht auf Beschwerde gemäß Art. 77 DSGVO\n\n7.2 WIDERSPRUCHSRECHT\n\nWENN WIR IM RAHMEN EINER INTERESSENABWÄGUNG IHRE PERSONENBEZOGENEN DATEN AUFGRUND UNSERES ÜBERWIEGENDEN BERECHTIGTEN INTERESSES VERARBEITEN, HABEN SIE DAS JEDERZEITIGE RECHT, AUS GRÜNDEN, DIE SICH AUS IHRER BESONDEREN SITUATION ERGEBEN, GEGEN DIESE VERARBEITUNG WIDERSPRUCH MIT WIRKUNG FÜR DIE ZUKUNFT EINZULEGEN.\n\nMACHEN SIE VON IHREM WIDERSPRUCHSRECHT GEBRAUCH, BEENDEN WIR DIE VERARBEITUNG DER BETROFFENEN DATEN. EINE WEITERVERARBEITUNG BLEIBT ABER VORBEHALTEN, WENN WIR ZWINGENDE SCHUTZWÜRDIGE GRÜNDE FÜR DIE VERARBEITUNG NACHWEISEN KÖNNEN, DIE IHRE INTERESSEN, GRUNDRECHTE UND GRUNDFREIHEITEN ÜBERWIEGEN, ODER WENN DIE VERARBEITUNG DER GELTENDMACHUNG, AUSÜBUNG ODER VERTEIDIGUNG VON RECHTSANSPRÜCHEN DIENT.\n\nWERDEN IHRE PERSONENBEZOGENEN DATEN VON UNS VERARBEITET, UM DIREKTWERBUNG ZU BETREIBEN, HABEN SIE DAS RECHT, JEDERZEIT WIDERSPRUCH GEGEN DIE VERARBEITUNG SIE BETREFFENDER PERSONENBEZOGENER DATEN ZUM ZWECKE DERARTIGER WERBUNG EINZULEGEN. SIE KÖNNEN DEN WIDERSPRUCH WIE OBEN BESCHRIEBEN AUSÜBEN.\n\nMACHEN SIE VON IHREM WIDERSPRUCHSRECHT GEBRAUCH, BEENDEN WIR DIE VERARBEITUNG DER BETROFFENEN DATEN ZU DIREKTWERBEZWECKEN.`,
  },
  {
    title: '8) Dauer der Speicherung personenbezogener Daten',
    body: `Die Dauer der Speicherung von personenbezogenen Daten bemisst sich anhand der jeweiligen Rechtsgrundlage, am Verarbeitungszweck und – sofern einschlägig – zusätzlich anhand der jeweiligen gesetzlichen Aufbewahrungsfrist (z.B. handels- und steuerrechtliche Aufbewahrungsfristen).\n\nBei der Verarbeitung von personenbezogenen Daten auf Grundlage einer ausdrücklichen Einwilligung gemäß Art. 6 Abs. 1 lit. a DSGVO werden die betroffenen Daten so lange gespeichert, bis Sie Ihre Einwilligung widerrufen.\n\nExistieren gesetzliche Aufbewahrungsfristen für Daten, die im Rahmen rechtsgeschäftlicher bzw. rechtsgeschäftsähnlicher Verpflichtungen auf der Grundlage von Art. 6 Abs. 1 lit. b DSGVO verarbeitet werden, werden diese Daten nach Ablauf der Aufbewahrungsfristen routinemäßig gelöscht, sofern sie nicht mehr zur Vertragserfüllung oder Vertragsanbahnung erforderlich sind und/oder unsererseits kein berechtigtes Interesse an der Weiterspeicherung fortbesteht.\n\nBei der Verarbeitung von personenbezogenen Daten auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO werden diese Daten so lange gespeichert, bis Sie Ihr Widerspruchsrecht nach Art. 21 Abs. 1 DSGVO ausüben, es sei denn, wir können zwingende schutzwürdige Gründe für die Verarbeitung nachweisen, die Ihre Interessen, Rechte und Freiheiten überwiegen, oder die Verarbeitung dient der Geltendmachung, Ausübung oder Verteidigung von Rechtsansprüchen.\n\nBei der Verarbeitung von personenbezogenen Daten zum Zwecke der Direktwerbung auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO werden diese Daten so lange gespeichert, bis Sie Ihr Widerspruchsrecht nach Art. 21 Abs. 2 DSGVO ausüben.\n\nSofern sich aus den sonstigen Informationen dieser Erklärung über spezifische Verarbeitungssituationen nichts anderes ergibt, werden gespeicherte personenbezogene Daten im Übrigen dann gelöscht, wenn sie für die Zwecke, für die sie erhoben oder auf sonstige Weise verarbeitet wurden, nicht mehr notwendig sind.`,
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
          <Text style={styles.title}>DATENSCHUTZERKLÄRUNG</Text>
        </View>

        {SECTIONS.map((section, index) => (
          <View key={index} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <Text style={styles.sectionBody}>{section.body}</Text>
          </View>
        ))}

        <View style={styles.copyrightSection}>
          <Text style={styles.copyrightText}>
            Diese Datenschutzerklärung wurde von den Fachanwälten der IT-Recht Kanzlei erstellt und ist urheberrechtlich geschützt.
          </Text>
          <Text style={styles.copyrightDate}>Stand: 07.03.2026</Text>
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
    fontSize: 24,
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
  copyrightDate: {
    fontSize: 12,
    color: Colors.textTertiary,
    fontWeight: '600' as const,
  },
});
