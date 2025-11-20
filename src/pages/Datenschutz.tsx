import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Footer from "@/components/Footer";

const Datenschutz = () => {
  const { t, i18n } = useTranslation();
  const isGerman = i18n.language === 'de';
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary to-background animate-fade-in" style={{ animationDuration: '0.4s' }}>
      <div className="container max-w-4xl py-8 px-4">
        <Button variant="ghost" className="mb-6 opacity-0 animate-fade-in" style={{ animationDelay: '0.1s' }} onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Zurück
        </Button>

        <Card className="opacity-0 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <CardHeader>
            <CardTitle className="text-3xl font-bold">{t('datenschutz')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            {isGerman ? (
              <>
                {/* German Version */}
                {/* Einleitung */}
                <section>
                  <h2 className="text-xl font-semibold mb-4 text-primary">1. Datenschutz auf einen Blick</h2>
                  <h3 className="text-lg font-medium mb-2">Allgemeine Hinweise</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen Daten passiert, wenn Sie diese Website besuchen. Personenbezogene Daten sind alle Daten, mit denen Sie persönlich identifiziert werden können.
                  </p>
                </section>

                <Separator />

                {/* Datenerfassung */}
                <section>
                  <h2 className="text-xl font-semibold mb-4 text-primary">2. Datenerfassung auf dieser Website</h2>
                  
                  <h3 className="text-lg font-medium mb-2">Wer ist verantwortlich für die Datenerfassung?</h3>
                  <div className="space-y-2 bg-muted/50 p-4 rounded-lg mb-4">
                    <p>Samuel Komorek</p>
                    <p>Schlierbachweg 12</p>
                    <p>83246 Unterwössen</p>
                    <p>E-Mail: cheapfuel@web.de</p>
                    <p className="text-sm text-muted-foreground mt-2">(Siehe auch Impressum)</p>
                  </div>

                  <h3 className="text-lg font-medium mb-2">Wie erfassen wir Ihre Daten?</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-2">
                    Ihre Daten werden zum einen dadurch erhoben, dass Sie uns diese mitteilen. Hierbei kann es sich z.B. um Daten handeln, die Sie in ein Kontaktformular eingeben.
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Andere Daten werden automatisch oder nach Ihrer Einwilligung beim Besuch der Website durch unsere IT-Systeme erfasst. Das sind vor allem technische Daten (z.B. Internetbrowser, Betriebssystem oder Uhrzeit des Seitenaufrufs).
                  </p>

                  <h3 className="text-lg font-medium mb-2 mt-4">Wofür nutzen wir Ihre Daten?</h3>
                  <div className="space-y-2 bg-muted/50 p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      <strong>Standortdaten (GPS):</strong> Diese App nutzt Ihren Standort, um Tankstellen in Ihrer Nähe zu finden. Die Standortdaten werden nur während Ihrer aktiven Nutzung verwendet und nicht dauerhaft gespeichert.
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      <strong>Analytics:</strong> Wir nutzen Google Analytics zur Analyse der Nutzung unserer Website. Dies hilft uns, die Benutzerfreundlichkeit zu verbessern und die Inhalte zu optimieren. Die Daten werden anonymisiert erfasst.
                    </p>
                  </div>

                  <h3 className="text-lg font-medium mb-2 mt-4">Welche Rechte haben Sie bezüglich Ihrer Daten?</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Sie haben jederzeit das Recht, unentgeltlich Auskunft über Herkunft, Empfänger und Zweck Ihrer gespeicherten personenbezogenen Daten zu erhalten. Sie haben außerdem ein Recht, die Berichtigung oder Löschung dieser Daten zu verlangen. Wenn Sie eine Einwilligung zur Datenverarbeitung erteilt haben, können Sie diese Einwilligung jederzeit für die Zukunft widerrufen.
                  </p>
                </section>

                <Separator />

                {/* Hosting */}
                <section>
                  <h2 className="text-xl font-semibold mb-4 text-primary">3. Hosting</h2>
                  <div className="space-y-2 bg-muted/50 p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      Diese Website wird gehostet bei Lovable. Beim Besuch dieser Website erfasst der Hosting-Provider automatisch Informationen in sogenannten Server-Log-Dateien. Dies sind:
                    </p>
                    <ul className="list-disc list-inside text-sm text-muted-foreground ml-4 mt-2 space-y-1">
                      <li>Browsertyp und Browserversion</li>
                      <li>Verwendetes Betriebssystem</li>
                      <li>Referrer URL</li>
                      <li>Hostname des zugreifenden Rechners</li>
                      <li>Uhrzeit der Serveranfrage</li>
                      <li>IP-Adresse</li>
                    </ul>
                    <p className="text-sm text-muted-foreground mt-2">
                      Die Datenverarbeitung erfolgt auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an der technisch fehlerfreien Darstellung und Optimierung der Website).
                    </p>
                  </div>
                </section>

                <Separator />

                {/* Standortdaten - WICHTIG für diese App */}
                <section>
                  <h2 className="text-xl font-semibold mb-4 text-primary">4. Standortdaten (GPS)</h2>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-2">
                    Diese App nutzt die Standortdaten (GPS) Ihres Geräts, um Tankstellen in Ihrer Nähe zu finden.
                  </p>
                  <div className="space-y-3 bg-primary/10 p-4 rounded-lg border-l-4 border-primary">
                    <div>
                      <p className="font-medium text-sm">Rechtsgrundlage:</p>
                      <p className="text-sm text-muted-foreground">
                        Art. 6 Abs. 1 lit. a DSGVO (Einwilligung) - Sie müssen der Standortfreigabe aktiv zustimmen.
                      </p>
                    </div>
                    <div>
                      <p className="font-medium text-sm">Zweck:</p>
                      <p className="text-sm text-muted-foreground">
                        Anzeige von Tankstellen in Ihrer Umgebung mit aktuellen Kraftstoffpreisen.
                      </p>
                    </div>
                    <div>
                      <p className="font-medium text-sm">Speicherung:</p>
                      <p className="text-sm text-muted-foreground">
                        Ihr Standort wird NICHT dauerhaft gespeichert. Die Daten werden nur während Ihrer aktiven Sitzung verwendet und nach Verlassen der App automatisch gelöscht.
                      </p>
                    </div>
                    <div>
                      <p className="font-medium text-sm">Widerruf:</p>
                      <p className="text-sm text-muted-foreground">
                        Sie können die Standortfreigabe jederzeit in den Einstellungen Ihres Browsers oder Geräts widerrufen.
                      </p>
                    </div>
                  </div>
                </section>

                <Separator />

                {/* Externe APIs */}
                <section>
                  <h2 className="text-xl font-semibold mb-4 text-primary">5. Externe Dienste und APIs</h2>
                  
                  <h3 className="text-lg font-medium mb-2">Tankerkoenig API</h3>
                  <div className="space-y-2 bg-muted/50 p-4 rounded-lg mb-4">
                    <p className="text-sm text-muted-foreground">
                      Diese App nutzt die Tankerkoenig API (Bundeskartellamt / MTS-K), um aktuelle Kraftstoffpreise deutscher Tankstellen abzurufen.
                    </p>
                    <div className="space-y-2 mt-3">
                      <div>
                        <p className="font-medium text-sm">Datenübertragung:</p>
                        <p className="text-sm text-muted-foreground">
                          Bei der Suche nach Tankstellen werden Ihr Standort (GPS-Koordinaten) sowie technische Daten an die Tankerkoenig API übertragen. Die Daten werden ausschließlich zur Anzeige der Tankstellen und Preise verwendet.
                        </p>
                      </div>
                      <div>
                        <p className="font-medium text-sm">Rechtsgrundlage:</p>
                        <p className="text-sm text-muted-foreground">
                          Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung) und Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an der Bereitstellung aktueller Preisdaten).
                        </p>
                      </div>
                    </div>
                  </div>

                  <h3 className="text-lg font-medium mb-2">OpenStreetMap / MapLibre</h3>
                  <div className="space-y-2 bg-muted/50 p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      Für die Kartendarstellung verwenden wir OpenStreetMap-Daten über die MapLibre-Bibliothek.
                    </p>
                    <div className="space-y-2 mt-3">
                      <div>
                        <p className="font-medium text-sm">Datenübertragung:</p>
                        <p className="text-sm text-muted-foreground">
                          Beim Laden der Karte werden Kartenkacheln von OpenStreetMap-Servern abgerufen. Dabei wird Ihre IP-Adresse sowie der angezeigte Kartenbereich übertragen.
                        </p>
                      </div>
                      <div>
                        <p className="font-medium text-sm">Rechtsgrundlage:</p>
                        <p className="text-sm text-muted-foreground">
                          Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an der Darstellung von Standorten auf einer Karte).
                        </p>
                      </div>
                      <div>
                        <p className="font-medium text-sm">Weitere Informationen:</p>
                        <p className="text-sm text-muted-foreground">
                          Datenschutzerklärung von OpenStreetMap:{" "}
                          <a
                            href="https://wiki.osmfoundation.org/wiki/Privacy_Policy"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                          >
                            https://wiki.osmfoundation.org/wiki/Privacy_Policy
                          </a>
                        </p>
                      </div>
                    </div>
                  </div>
                </section>

                <Separator />

                {/* Cookies */}
                <section>
                  <h2 className="text-xl font-semibold mb-4 text-primary">6. Cookies</h2>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                    Diese Website verwendet Cookies, um die Funktionalität zu gewährleisten und die Nutzung zu analysieren. Cookies sind kleine Textdateien, die auf Ihrem Gerät gespeichert werden.
                  </p>
                  
                  <div className="space-y-4">
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <h3 className="text-lg font-medium mb-2">Technisch notwendige Cookies</h3>
                      <p className="text-sm text-muted-foreground">
                        Diese Cookies sind für den Betrieb der Website erforderlich und ermöglichen grundlegende Funktionen wie:
                      </p>
                      <ul className="list-disc list-inside text-sm text-muted-foreground ml-4 mt-2 space-y-1">
                        <li>Speicherung der Spracheinstellung (i18next)</li>
                        <li>Funktionalität der Kartenansicht</li>
                        <li>Session-Management</li>
                      </ul>
                      <p className="text-sm text-muted-foreground mt-2">
                        <strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an der technischen Funktionsfähigkeit der Website).
                      </p>
                    </div>

                    <div className="bg-muted/50 p-4 rounded-lg">
                      <h3 className="text-lg font-medium mb-2">Analytics-Cookies (Google Analytics)</h3>
                      <p className="text-sm text-muted-foreground">
                        Wir verwenden Google Analytics zur Analyse der Website-Nutzung. Diese Cookies helfen uns, die Benutzerfreundlichkeit zu verbessern.
                      </p>
                      <p className="text-sm text-muted-foreground mt-2">
                        <strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an der Optimierung der Website).
                      </p>
                      <p className="text-sm text-muted-foreground mt-2">
                        Weitere Informationen zu Google Analytics finden Sie in Abschnitt 7.
                      </p>
                    </div>

                    <div className="bg-primary/10 p-4 rounded-lg border-l-4 border-primary">
                      <p className="font-medium text-sm mb-1">Cookie-Verwaltung</p>
                      <p className="text-sm text-muted-foreground">
                        Sie können Ihre Cookie-Einstellungen jederzeit über Ihre Browser-Einstellungen verwalten und Cookies löschen oder blockieren. Bitte beachten Sie, dass die Deaktivierung von Cookies die Funktionalität der Website einschränken kann.
                      </p>
                    </div>
                  </div>
                </section>

                <Separator />

                {/* Analytics (falls verwendet) */}
                <section>
                  <h2 className="text-xl font-semibold mb-4 text-primary">7. Analyse-Tools und Werbung</h2>
                  
                  <h3 className="text-lg font-medium mb-2">Google Analytics</h3>
                  <div className="space-y-2 bg-muted/50 p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      Diese Website nutzt Google Analytics, einen Webanalysedienst der Google Ireland Limited („Google"). Google Analytics verwendet Cookies, die eine Analyse der Benutzung der Website ermöglichen.
                    </p>
                    <div className="space-y-2 mt-3">
                      <div>
                        <p className="font-medium text-sm">Umfang der Verarbeitung:</p>
                        <p className="text-sm text-muted-foreground">
                          Google Analytics erfasst Informationen über die Nutzung der Website (z.B. aufgerufene Seiten, Verweildauer, verwendete Geräte und Browser). Die IP-Adresse wird anonymisiert, sodass keine Rückschlüsse auf einzelne Nutzer möglich sind.
                        </p>
                      </div>
                      <div>
                        <p className="font-medium text-sm">Zweck:</p>
                        <p className="text-sm text-muted-foreground">
                          Analyse des Nutzerverhaltens zur Optimierung der Website und Verbesserung der Benutzerfreundlichkeit.
                        </p>
                      </div>
                      <div>
                        <p className="font-medium text-sm">Rechtsgrundlage:</p>
                        <p className="text-sm text-muted-foreground">
                          Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an der Analyse und Optimierung der Website).
                        </p>
                      </div>
                      <div>
                        <p className="font-medium text-sm">Datenübermittlung:</p>
                        <p className="text-sm text-muted-foreground">
                          Die durch das Cookie erzeugten Informationen werden an Server von Google übertragen und dort gespeichert. Dabei kann eine Übermittlung in Drittländer (z.B. USA) erfolgen.
                        </p>
                      </div>
                      <div>
                        <p className="font-medium text-sm">Widerspruch:</p>
                        <p className="text-sm text-muted-foreground">
                          Sie können die Speicherung von Cookies durch eine entsprechende Einstellung Ihrer Browser-Software verhindern oder das Browser-Add-on zur Deaktivierung von Google Analytics installieren.
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-3">
                      Mehr Informationen zu Google Analytics finden Sie unter:{" "}
                      <a
                        href="https://policies.google.com/privacy"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        https://policies.google.com/privacy
                      </a>
                    </p>
                  </div>
                </section>

                <Separator />

                {/* Betroffenenrechte */}
                <section>
                  <h2 className="text-xl font-semibold mb-4 text-primary">8. Ihre Rechte als betroffene Person</h2>
                  <div className="space-y-3">
                    <div>
                      <p className="font-medium text-sm">Recht auf Auskunft (Art. 15 DSGVO)</p>
                      <p className="text-sm text-muted-foreground">
                        Sie haben das Recht, Auskunft über Ihre von uns verarbeiteten personenbezogenen Daten zu verlangen.
                      </p>
                    </div>
                    <div>
                      <p className="font-medium text-sm">Recht auf Berichtigung (Art. 16 DSGVO)</p>
                      <p className="text-sm text-muted-foreground">
                        Sie haben das Recht, die Berichtigung unrichtiger Daten zu verlangen.
                      </p>
                    </div>
                    <div>
                      <p className="font-medium text-sm">Recht auf Löschung (Art. 17 DSGVO)</p>
                      <p className="text-sm text-muted-foreground">
                        Sie haben das Recht, die Löschung Ihrer Daten zu verlangen.
                      </p>
                    </div>
                    <div>
                      <p className="font-medium text-sm">Recht auf Einschränkung (Art. 18 DSGVO)</p>
                      <p className="text-sm text-muted-foreground">
                        Sie haben das Recht, die Einschränkung der Verarbeitung zu verlangen.
                      </p>
                    </div>
                    <div>
                      <p className="font-medium text-sm">Recht auf Datenübertragbarkeit (Art. 20 DSGVO)</p>
                      <p className="text-sm text-muted-foreground">
                        Sie haben das Recht, Ihre Daten in einem strukturierten Format zu erhalten.
                      </p>
                    </div>
                    <div>
                      <p className="font-medium text-sm">Widerspruchsrecht (Art. 21 DSGVO)</p>
                      <p className="text-sm text-muted-foreground">
                        Sie haben das Recht, der Verarbeitung Ihrer Daten zu widersprechen.
                      </p>
                    </div>
                    <div>
                      <p className="font-medium text-sm">Beschwerderecht</p>
                      <p className="text-sm text-muted-foreground">
                        Sie haben das Recht, sich bei einer Datenschutz-Aufsichtsbehörde zu beschweren.
                      </p>
                    </div>
                  </div>
                </section>

                <Separator />

                {/* Kontakt Datenschutz */}
                <section>
                  <h2 className="text-xl font-semibold mb-4 text-primary">9. Kontakt in Datenschutzfragen</h2>
                  <div className="space-y-2 bg-muted/50 p-4 rounded-lg">
                    <p>Für Fragen zum Datenschutz wenden Sie sich bitte an:</p>
                    <p className="font-medium">Samuel Komorek</p>
                    <p>E-Mail: cheapfuel@web.de</p>
                  </div>
                </section>

                {/* Stand */}
                <div className="text-center pt-4">
                  <p className="text-xs text-muted-foreground">
                    Stand dieser Datenschutzerklärung: {new Date().toLocaleDateString('de-DE')}
                  </p>
                </div>
              </>
            ) : (
              <>
                {/* English Version */}
                <section>
                  <h2 className="text-xl font-semibold mb-4 text-primary">1. Privacy at a Glance</h2>
                  <h3 className="text-lg font-medium mb-2">General Information</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    The following information provides a simple overview of what happens to your personal data when you visit this website. Personal data is any data that can be used to identify you personally.
                  </p>
                </section>

                <Separator />

                <section>
                  <h2 className="text-xl font-semibold mb-4 text-primary">2. Data Collection on This Website</h2>
                  
                  <h3 className="text-lg font-medium mb-2">Who is responsible for data collection?</h3>
                  <div className="space-y-2 bg-muted/50 p-4 rounded-lg mb-4">
                    <p>Samuel Komorek</p>
                    <p>Schlierbachweg 12</p>
                    <p>83246 Unterwössen</p>
                    <p>Germany</p>
                    <p>Email: cheapfuel@web.de</p>
                    <p className="text-sm text-muted-foreground mt-2">(See also Legal Notice)</p>
                  </div>

                  <h3 className="text-lg font-medium mb-2">How do we collect your data?</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-2">
                    Your data is collected when you provide it to us. This could be data you enter in a contact form, for example.
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Other data is collected automatically or with your consent when you visit the website through our IT systems. This is primarily technical data (e.g., internet browser, operating system, or time of page access).
                  </p>

                  <h3 className="text-lg font-medium mb-2 mt-4">What do we use your data for?</h3>
                  <div className="space-y-2 bg-muted/50 p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      <strong>Location Data (GPS):</strong> This app uses your location to find gas stations near you. Location data is only used during your active use and is not permanently stored.
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      <strong>Analytics:</strong> We use Google Analytics to analyze the use of our website. This helps us improve user-friendliness and optimize content. Data is collected anonymously.
                    </p>
                  </div>

                  <h3 className="text-lg font-medium mb-2 mt-4">What rights do you have regarding your data?</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    You have the right to receive information about the origin, recipient, and purpose of your stored personal data free of charge at any time. You also have the right to request the correction or deletion of this data. If you have given consent for data processing, you can revoke this consent at any time for the future.
                  </p>
                </section>

                <Separator />

                <section>
                  <h2 className="text-xl font-semibold mb-4 text-primary">3. Hosting</h2>
                  <div className="space-y-2 bg-muted/50 p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      This website is hosted by Lovable. When you visit this website, the hosting provider automatically collects information in so-called server log files. These include:
                    </p>
                    <ul className="list-disc list-inside text-sm text-muted-foreground ml-4 mt-2 space-y-1">
                      <li>Browser type and version</li>
                      <li>Operating system used</li>
                      <li>Referrer URL</li>
                      <li>Hostname of the accessing computer</li>
                      <li>Time of server request</li>
                      <li>IP address</li>
                    </ul>
                    <p className="text-sm text-muted-foreground mt-2">
                      Data processing is based on Art. 6 (1) lit. f GDPR (legitimate interest in technically error-free presentation and optimization of the website).
                    </p>
                  </div>
                </section>

                <Separator />

                <section>
                  <h2 className="text-xl font-semibold mb-4 text-primary">4. Location Data (GPS)</h2>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-2">
                    This app uses your device's location data (GPS) to find gas stations near you.
                  </p>
                  <div className="space-y-3 bg-primary/10 p-4 rounded-lg border-l-4 border-primary">
                    <div>
                      <p className="font-medium text-sm">Legal Basis:</p>
                      <p className="text-sm text-muted-foreground">
                        Art. 6 (1) lit. a GDPR (consent) - You must actively consent to location sharing.
                      </p>
                    </div>
                    <div>
                      <p className="font-medium text-sm">Purpose:</p>
                      <p className="text-sm text-muted-foreground">
                        Display of gas stations in your area with current fuel prices.
                      </p>
                    </div>
                    <div>
                      <p className="font-medium text-sm">Storage:</p>
                      <p className="text-sm text-muted-foreground">
                        Your location is NOT permanently stored. Data is only used during your active session and is automatically deleted after leaving the app.
                      </p>
                    </div>
                    <div>
                      <p className="font-medium text-sm">Revocation:</p>
                      <p className="text-sm text-muted-foreground">
                        You can revoke location sharing at any time in your browser or device settings.
                      </p>
                    </div>
                  </div>
                </section>

                <Separator />

                <section>
                  <h2 className="text-xl font-semibold mb-4 text-primary">5. External Services and APIs</h2>
                  
                  <h3 className="text-lg font-medium mb-2">Tankerkoenig API</h3>
                  <div className="space-y-2 bg-muted/50 p-4 rounded-lg mb-4">
                    <p className="text-sm text-muted-foreground">
                      This app uses the Tankerkoenig API (Federal Cartel Office / MTS-K) to retrieve current fuel prices from German gas stations.
                    </p>
                    <div className="space-y-2 mt-3">
                      <div>
                        <p className="font-medium text-sm">Data Transfer:</p>
                        <p className="text-sm text-muted-foreground">
                          When searching for gas stations, your location (GPS coordinates) and technical data are transmitted to the Tankerkoenig API. Data is used exclusively to display gas stations and prices.
                        </p>
                      </div>
                      <div>
                        <p className="font-medium text-sm">Legal Basis:</p>
                        <p className="text-sm text-muted-foreground">
                          Art. 6 (1) lit. b GDPR (contract fulfillment) and Art. 6 (1) lit. f GDPR (legitimate interest in providing current price data).
                        </p>
                      </div>
                    </div>
                  </div>

                  <h3 className="text-lg font-medium mb-2">OpenStreetMap / MapLibre</h3>
                  <div className="space-y-2 bg-muted/50 p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      For map display, we use OpenStreetMap data via the MapLibre library.
                    </p>
                    <div className="space-y-2 mt-3">
                      <div>
                        <p className="font-medium text-sm">Data Transfer:</p>
                        <p className="text-sm text-muted-foreground">
                          When loading the map, map tiles are retrieved from OpenStreetMap servers. Your IP address and the displayed map area are transmitted.
                        </p>
                      </div>
                      <div>
                        <p className="font-medium text-sm">Legal Basis:</p>
                        <p className="text-sm text-muted-foreground">
                          Art. 6 (1) lit. f GDPR (legitimate interest in displaying locations on a map).
                        </p>
                      </div>
                      <div>
                        <p className="font-medium text-sm">More Information:</p>
                        <p className="text-sm text-muted-foreground">
                          OpenStreetMap Privacy Policy:{" "}
                          <a
                            href="https://wiki.osmfoundation.org/wiki/Privacy_Policy"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                          >
                            https://wiki.osmfoundation.org/wiki/Privacy_Policy
                          </a>
                        </p>
                      </div>
                    </div>
                  </div>
                </section>

                <Separator />

                <section>
                  <h2 className="text-xl font-semibold mb-4 text-primary">6. Cookies</h2>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                    This website uses cookies to ensure functionality and analyze usage. Cookies are small text files stored on your device.
                  </p>
                  
                  <div className="space-y-4">
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <h3 className="text-lg font-medium mb-2">Technically Necessary Cookies</h3>
                      <p className="text-sm text-muted-foreground">
                        These cookies are required for website operation and enable basic functions such as:
                      </p>
                      <ul className="list-disc list-inside text-sm text-muted-foreground ml-4 mt-2 space-y-1">
                        <li>Storage of language settings (i18next)</li>
                        <li>Map view functionality</li>
                        <li>Session management</li>
                      </ul>
                      <p className="text-sm text-muted-foreground mt-2">
                        <strong>Legal Basis:</strong> Art. 6 (1) lit. f GDPR (legitimate interest in technical functionality of the website).
                      </p>
                    </div>

                    <div className="bg-muted/50 p-4 rounded-lg">
                      <h3 className="text-lg font-medium mb-2">Analytics Cookies (Google Analytics)</h3>
                      <p className="text-sm text-muted-foreground">
                        We use Google Analytics to analyze website usage. These cookies help us improve user-friendliness.
                      </p>
                      <p className="text-sm text-muted-foreground mt-2">
                        <strong>Legal Basis:</strong> Art. 6 (1) lit. f GDPR (legitimate interest in website optimization).
                      </p>
                      <p className="text-sm text-muted-foreground mt-2">
                        More information about Google Analytics can be found in Section 7.
                      </p>
                    </div>

                    <div className="bg-primary/10 p-4 rounded-lg border-l-4 border-primary">
                      <p className="font-medium text-sm mb-1">Cookie Management</p>
                      <p className="text-sm text-muted-foreground">
                        You can manage your cookie settings at any time through your browser settings and delete or block cookies. Please note that disabling cookies may limit website functionality.
                      </p>
                    </div>
                  </div>
                </section>

                <Separator />

                <section>
                  <h2 className="text-xl font-semibold mb-4 text-primary">7. Analytics and Advertising Tools</h2>
                  
                  <h3 className="text-lg font-medium mb-2">Google Analytics</h3>
                  <div className="space-y-2 bg-muted/50 p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      This website uses Google Analytics, a web analytics service provided by Google Ireland Limited ("Google"). Google Analytics uses cookies that enable analysis of website usage.
                    </p>
                    <div className="space-y-2 mt-3">
                      <div>
                        <p className="font-medium text-sm">Scope of Processing:</p>
                        <p className="text-sm text-muted-foreground">
                          Google Analytics collects information about website usage (e.g., pages viewed, duration of visit, devices and browsers used). IP addresses are anonymized so that no conclusions can be drawn about individual users.
                        </p>
                      </div>
                      <div>
                        <p className="font-medium text-sm">Purpose:</p>
                        <p className="text-sm text-muted-foreground">
                          Analysis of user behavior to optimize the website and improve user-friendliness.
                        </p>
                      </div>
                      <div>
                        <p className="font-medium text-sm">Legal Basis:</p>
                        <p className="text-sm text-muted-foreground">
                          Art. 6 (1) lit. f GDPR (legitimate interest in analyzing and optimizing the website).
                        </p>
                      </div>
                      <div>
                        <p className="font-medium text-sm">Data Transmission:</p>
                        <p className="text-sm text-muted-foreground">
                          Information generated by the cookie is transmitted to and stored on Google servers. This may include transmission to third countries (e.g., USA).
                        </p>
                      </div>
                      <div>
                        <p className="font-medium text-sm">Objection:</p>
                        <p className="text-sm text-muted-foreground">
                          You can prevent the storage of cookies by adjusting your browser software settings or install the browser add-on to disable Google Analytics.
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-3">
                      More information about Google Analytics can be found at:{" "}
                      <a
                        href="https://policies.google.com/privacy"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        https://policies.google.com/privacy
                      </a>
                    </p>
                  </div>
                </section>

                <Separator />

                <section>
                  <h2 className="text-xl font-semibold mb-4 text-primary">8. Your Rights as a Data Subject</h2>
                  <div className="space-y-3">
                    <div>
                      <p className="font-medium text-sm">Right to Information (Art. 15 GDPR)</p>
                      <p className="text-sm text-muted-foreground">
                        You have the right to request information about your personal data processed by us.
                      </p>
                    </div>
                    <div>
                      <p className="font-medium text-sm">Right to Rectification (Art. 16 GDPR)</p>
                      <p className="text-sm text-muted-foreground">
                        You have the right to request the correction of inaccurate data.
                      </p>
                    </div>
                    <div>
                      <p className="font-medium text-sm">Right to Erasure (Art. 17 GDPR)</p>
                      <p className="text-sm text-muted-foreground">
                        You have the right to request the deletion of your data.
                      </p>
                    </div>
                    <div>
                      <p className="font-medium text-sm">Right to Restriction (Art. 18 GDPR)</p>
                      <p className="text-sm text-muted-foreground">
                        You have the right to request restriction of processing.
                      </p>
                    </div>
                    <div>
                      <p className="font-medium text-sm">Right to Data Portability (Art. 20 GDPR)</p>
                      <p className="text-sm text-muted-foreground">
                        You have the right to receive your data in a structured format.
                      </p>
                    </div>
                    <div>
                      <p className="font-medium text-sm">Right to Object (Art. 21 GDPR)</p>
                      <p className="text-sm text-muted-foreground">
                        You have the right to object to the processing of your data.
                      </p>
                    </div>
                    <div>
                      <p className="font-medium text-sm">Right to Complain</p>
                      <p className="text-sm text-muted-foreground">
                        You have the right to lodge a complaint with a data protection supervisory authority.
                      </p>
                    </div>
                  </div>
                </section>

                <Separator />

                <section>
                  <h2 className="text-xl font-semibold mb-4 text-primary">9. Contact for Privacy Matters</h2>
                  <div className="space-y-2 bg-muted/50 p-4 rounded-lg">
                    <p>For privacy-related questions, please contact:</p>
                    <p className="font-medium">Samuel Komorek</p>
                    <p>Email: cheapfuel@web.de</p>
                  </div>
                </section>

                <div className="text-center pt-4">
                  <p className="text-xs text-muted-foreground">
                    Date of this Privacy Policy: {new Date().toLocaleDateString('en-US')}
                  </p>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
};

export default Datenschutz;
