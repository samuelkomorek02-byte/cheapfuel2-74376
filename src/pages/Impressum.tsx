import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Footer from "@/components/Footer";

const Impressum = () => {
  const { t, i18n } = useTranslation();
  const isGerman = i18n.language === 'de';

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary to-background animate-fade-in">
      <div className="container max-w-4xl py-8 px-4">
        <Link to="/">
          <Button variant="ghost" className="mb-6 opacity-0 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('back_to_home')}
          </Button>
        </Link>

        <Card className="opacity-0 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <CardHeader>
            <CardTitle className="text-3xl font-bold">{t('impressum')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            {isGerman ? (
              <>
                {/* Angaben gemäß § 5 TMG */}
                <section>
                  <h2 className="text-xl font-semibold mb-4 text-primary">Angaben gemäß § 5 TMG</h2>
                  <div className="space-y-2 bg-muted/50 p-4 rounded-lg">
                    <p>Samuel Komorek</p>
                    <p>Schlierbachweg 12</p>
                    <p>83246 Unterwössen</p>
                  </div>
                </section>

                <Separator />

                {/* Kontakt */}
                <section>
                  <h2 className="text-xl font-semibold mb-4 text-primary">Kontakt</h2>
                  <div className="space-y-2 bg-muted/50 p-4 rounded-lg">
                    <p>E-Mail: samuel.komorek@icloud.com</p>
                  </div>
                </section>

                <Separator />

                {/* EU-Streitschlichtung */}
                <section>
                  <h2 className="text-xl font-semibold mb-4 text-primary">EU-Streitschlichtung</h2>
                  <p className="text-sm text-muted-foreground">
                    Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:
                  </p>
                  <a
                    href="https://ec.europa.eu/consumers/odr/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    https://ec.europa.eu/consumers/odr/
                  </a>
                  <p className="text-sm text-muted-foreground mt-2">
                    Unsere E-Mail-Adresse finden Sie oben im Impressum.
                  </p>
                </section>

                <Separator />

                {/* Verbraucherstreitbeilegung */}
                <section>
                  <h2 className="text-xl font-semibold mb-4 text-primary">Verbraucherstreitbeilegung / Universalschlichtungsstelle</h2>
                  <p className="text-sm text-muted-foreground">
                    Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.
                  </p>
                </section>

                <Separator />

                {/* Haftungsausschluss */}
                <section>
                  <h2 className="text-xl font-semibold mb-4 text-primary">Haftung für Inhalte</h2>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed mt-2">
                    Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den allgemeinen Gesetzen bleiben hiervon unberührt. Eine diesbezügliche Haftung ist jedoch erst ab dem Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung möglich. Bei Bekanntwerden von entsprechenden Rechtsverletzungen werden wir diese Inhalte umgehend entfernen.
                  </p>
                </section>

                <Separator />

                <section>
                  <h2 className="text-xl font-semibold mb-4 text-primary">Haftung für Links</h2>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich. Die verlinkten Seiten wurden zum Zeitpunkt der Verlinkung auf mögliche Rechtsverstöße überprüft. Rechtswidrige Inhalte waren zum Zeitpunkt der Verlinkung nicht erkennbar.
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed mt-2">
                    Eine permanente inhaltliche Kontrolle der verlinkten Seiten ist jedoch ohne konkrete Anhaltspunkte einer Rechtsverletzung nicht zumutbar. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Links umgehend entfernen.
                  </p>
                </section>

                <Separator />

                <section>
                  <h2 className="text-xl font-semibold mb-4 text-primary">Urheberrecht</h2>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers. Downloads und Kopien dieser Seite sind nur für den privaten, nicht kommerziellen Gebrauch gestattet.
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed mt-2">
                    Soweit die Inhalte auf dieser Seite nicht vom Betreiber erstellt wurden, werden die Urheberrechte Dritter beachtet. Insbesondere werden Inhalte Dritter als solche gekennzeichnet. Sollten Sie trotzdem auf eine Urheberrechtsverletzung aufmerksam werden, bitten wir um einen entsprechenden Hinweis. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Inhalte umgehend entfernen.
                  </p>
                </section>
              </>
            ) : (
              <>
                {/* English Version */}
                <section>
                  <h2 className="text-xl font-semibold mb-4 text-primary">Information according to § 5 TMG</h2>
                  <div className="space-y-2 bg-muted/50 p-4 rounded-lg">
                    <p>Samuel Komorek</p>
                    <p>Schlierbachweg 12</p>
                    <p>83246 Unterwössen</p>
                    <p>Germany</p>
                  </div>
                </section>

                <Separator />

                {/* Contact */}
                <section>
                  <h2 className="text-xl font-semibold mb-4 text-primary">Contact</h2>
                  <div className="space-y-2 bg-muted/50 p-4 rounded-lg">
                    <p>Email: samuel.komorek@icloud.com</p>
                  </div>
                </section>

                <Separator />

                {/* EU Dispute Resolution */}
                <section>
                  <h2 className="text-xl font-semibold mb-4 text-primary">EU Dispute Resolution</h2>
                  <p className="text-sm text-muted-foreground">
                    The European Commission provides a platform for online dispute resolution (OS):
                  </p>
                  <a
                    href="https://ec.europa.eu/consumers/odr/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    https://ec.europa.eu/consumers/odr/
                  </a>
                  <p className="text-sm text-muted-foreground mt-2">
                    You can find our email address in the legal notice above.
                  </p>
                </section>

                <Separator />

                {/* Consumer Dispute Resolution */}
                <section>
                  <h2 className="text-xl font-semibold mb-4 text-primary">Consumer Dispute Resolution</h2>
                  <p className="text-sm text-muted-foreground">
                    We are not willing or obliged to participate in dispute resolution proceedings before a consumer arbitration board.
                  </p>
                </section>

                <Separator />

                {/* Liability Disclaimer */}
                <section>
                  <h2 className="text-xl font-semibold mb-4 text-primary">Liability for Content</h2>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    As a service provider, we are responsible for our own content on these pages in accordance with § 7 paragraph 1 TMG under general law. According to §§ 8 to 10 TMG, we are not obliged to monitor transmitted or stored third-party information or to investigate circumstances that indicate illegal activity.
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed mt-2">
                    Obligations to remove or block the use of information under general law remain unaffected. However, liability in this regard is only possible from the time of knowledge of a specific infringement. Upon becoming aware of corresponding legal violations, we will remove this content immediately.
                  </p>
                </section>

                <Separator />

                <section>
                  <h2 className="text-xl font-semibold mb-4 text-primary">Liability for Links</h2>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Our website contains links to external third-party websites over whose content we have no influence. Therefore, we cannot assume any liability for this external content. The respective provider or operator of the pages is always responsible for the content of the linked pages. The linked pages were checked for possible legal violations at the time of linking. Illegal content was not recognizable at the time of linking.
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed mt-2">
                    Permanent monitoring of the content of the linked pages is not reasonable without concrete evidence of a legal violation. Upon becoming aware of legal violations, we will remove such links immediately.
                  </p>
                </section>

                <Separator />

                <section>
                  <h2 className="text-xl font-semibold mb-4 text-primary">Copyright</h2>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    The content and works created by the site operators on these pages are subject to German copyright law. Duplication, processing, distribution, and any kind of exploitation outside the limits of copyright require the written consent of the respective author or creator. Downloads and copies of this page are only permitted for private, non-commercial use.
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed mt-2">
                    Insofar as the content on this page was not created by the operator, the copyrights of third parties are respected. In particular, third-party content is marked as such. Should you nevertheless become aware of a copyright infringement, please inform us accordingly. Upon becoming aware of legal violations, we will remove such content immediately.
                  </p>
                </section>
              </>
            )}
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
};

export default Impressum;
