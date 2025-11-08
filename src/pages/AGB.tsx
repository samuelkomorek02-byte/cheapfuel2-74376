import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Footer from "@/components/Footer";

const AGB = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background animate-fade-in">
      <header className="border-b opacity-0 animate-fade-in" style={{ animationDelay: '0.1s' }}>
        <div className="container mx-auto px-4 py-4">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Zurück
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl opacity-0 animate-fade-in" style={{ animationDelay: '0.2s' }}>
        <h1 className="text-3xl font-bold mb-8">Allgemeine Geschäftsbedingungen (AGB)</h1>
        
        <div className="prose prose-slate dark:prose-invert max-w-none space-y-6">
          <section>
            <h2 className="text-2xl font-semibold mb-4">§ 1 Geltungsbereich</h2>
            <p className="text-muted-foreground">
              Diese Allgemeinen Geschäftsbedingungen (nachfolgend "AGB") gelten für die Nutzung der Cheapfuel Web-App (nachfolgend "App") und regeln das Vertragsverhältnis zwischen dem Betreiber der App (nachfolgend "Anbieter") und den Nutzern der App (nachfolgend "Nutzer"). Mit der Registrierung und Nutzung der App erklärt sich der Nutzer mit diesen AGB einverstanden.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">§ 2 Vertragsgegenstand</h2>
            <p className="text-muted-foreground mb-3">
              Der Anbieter stellt dem Nutzer eine Web-App zur Verfügung, die Informationen über aktuelle Kraftstoffpreise an Tankstellen in Deutschland bereitstellt. Die App ermöglicht es Nutzern:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Tankstellen in der Nähe zu finden</li>
              <li>Aktuelle Kraftstoffpreise einzusehen</li>
              <li>Preisvergleiche durchzuführen</li>
              <li>Routen zu Tankstellen zu planen</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">§ 3 Vertragsschluss und Registrierung</h2>
            <p className="text-muted-foreground mb-3">
              Die Nutzung der App erfordert eine Registrierung. Der Vertragsschluss erfolgt in folgenden Schritten:
            </p>
            <ol className="list-decimal pl-6 text-muted-foreground space-y-2">
              <li>Registrierung mit E-Mail-Adresse</li>
              <li>Auswahl eines Abo-Modells</li>
              <li>Abschluss des Zahlungsvorgangs</li>
              <li>Bestätigung durch den Anbieter per E-Mail</li>
            </ol>
            <p className="text-muted-foreground mt-3">
              Mit Abschluss der Registrierung und Zahlung kommt ein verbindlicher Vertrag zwischen Nutzer und Anbieter zustande.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">§ 4 Leistungsumfang und Verfügbarkeit</h2>
            <p className="text-muted-foreground mb-3">
              Der Anbieter bemüht sich um eine hohe Verfügbarkeit der App. Es besteht jedoch kein Anspruch auf eine ununterbrochene Verfügbarkeit. Der Anbieter behält sich das Recht vor, die App jederzeit zu warten, zu aktualisieren oder temporär einzustellen.
            </p>
            <p className="text-muted-foreground">
              Die bereitgestellten Preisinformationen stammen von der Markttransparenzstelle für Kraftstoffe (MTS-K). Der Anbieter übernimmt keine Gewähr für die Richtigkeit, Vollständigkeit und Aktualität der Daten.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">§ 5 Zahlungsbedingungen und Abo-Laufzeit</h2>
            <p className="text-muted-foreground mb-3">
              Die Nutzung der App erfolgt im Rahmen eines Abonnements. Der Nutzer wählt bei der Registrierung ein Abo-Modell aus:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li><strong>Jahresabo:</strong> Zahlung erfolgt jährlich im Voraus</li>
            </ul>
            <p className="text-muted-foreground mt-3">
              Das Abonnement verlängert sich automatisch um den gewählten Zeitraum, sofern es nicht vor Ablauf der Laufzeit gekündigt wird. Die Zahlung erfolgt über den gewählten Zahlungsdienstleister (z.B. Stripe).
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">§ 6 Widerrufsrecht</h2>
            <p className="text-muted-foreground mb-3">
              Verbrauchern steht gemäß § 355 BGB ein gesetzliches Widerrufsrecht zu. Die Widerrufsfrist beträgt 14 Tage ab Vertragsschluss.
            </p>
            <div className="bg-muted/50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Widerrufsbelehrung</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Sie haben das Recht, binnen vierzehn Tagen ohne Angabe von Gründen diesen Vertrag zu widerrufen. Die Widerrufsfrist beträgt vierzehn Tage ab dem Tag des Vertragsabschlusses.
              </p>
              <p className="text-sm text-muted-foreground">
                Um Ihr Widerrufsrecht auszuüben, müssen Sie uns mittels einer eindeutigen Erklärung (z.B. per E-Mail) über Ihren Entschluss, diesen Vertrag zu widerrufen, informieren.
              </p>
            </div>
            <p className="text-muted-foreground mt-3">
              Bei vorzeitiger Inanspruchnahme der Dienstleistung erlischt das Widerrufsrecht gemäß § 356 Abs. 5 BGB, wenn der Nutzer ausdrücklich zugestimmt hat und zur Kenntnis genommen hat, dass er sein Widerrufsrecht verliert.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">§ 7 Pflichten des Nutzers</h2>
            <p className="text-muted-foreground mb-3">Der Nutzer verpflichtet sich:</p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Bei der Registrierung wahrheitsgemäße Angaben zu machen</li>
              <li>Seine Zugangsdaten vertraulich zu behandeln</li>
              <li>Die App nicht missbräuchlich zu nutzen</li>
              <li>Keine automatisierten Systeme zur Datenextraktion zu verwenden</li>
              <li>Rechte Dritter nicht zu verletzen</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">§ 8 Kündigung</h2>
            <p className="text-muted-foreground mb-3">
              Beide Parteien können das Vertragsverhältnis ordentlich kündigen:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Der Nutzer kann jederzeit über die App-Einstellungen oder per E-Mail kündigen</li>
              <li>Die Kündigung wird zum Ende der laufenden Abo-Periode wirksam</li>
              <li>Eine Erstattung bereits gezahlter Beträge erfolgt nicht</li>
            </ul>
            <p className="text-muted-foreground mt-3">
              Das Recht zur außerordentlichen Kündigung aus wichtigem Grund bleibt unberührt.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">§ 9 Haftung</h2>
            <p className="text-muted-foreground mb-3">
              Der Anbieter haftet uneingeschränkt für Schäden aus der Verletzung des Lebens, des Körpers oder der Gesundheit, die auf einer vorsätzlichen oder fahrlässigen Pflichtverletzung des Anbieters oder eines gesetzlichen Vertreters oder Erfüllungsgehilfen des Anbieters beruhen.
            </p>
            <p className="text-muted-foreground mb-3">
              Für sonstige Schäden haftet der Anbieter nur bei Verletzung wesentlicher Vertragspflichten. Die Haftung ist dabei auf den vertragstypischen, vorhersehbaren Schaden begrenzt.
            </p>
            <p className="text-muted-foreground">
              Der Anbieter haftet nicht für die Richtigkeit der angezeigten Kraftstoffpreise, da diese von externen Datenquellen stammen.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">§ 10 Datenschutz</h2>
            <p className="text-muted-foreground">
              Die Erhebung, Verarbeitung und Nutzung personenbezogener Daten erfolgt gemäß den Bestimmungen der Datenschutz-Grundverordnung (DSGVO) und dem Bundesdatenschutzgesetz (BDSG). Weitere Informationen finden Sie in unserer{" "}
              <a href="/datenschutz" className="text-primary hover:underline">
                Datenschutzerklärung
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">§ 11 Änderungen der AGB</h2>
            <p className="text-muted-foreground mb-3">
              Der Anbieter behält sich das Recht vor, diese AGB jederzeit zu ändern. Die Nutzer werden über Änderungen per E-Mail oder über die App informiert.
            </p>
            <p className="text-muted-foreground">
              Widerspricht der Nutzer den geänderten AGB nicht innerhalb von vier Wochen nach Bekanntgabe, gelten die geänderten AGB als akzeptiert. Der Anbieter wird in der Änderungsmitteilung auf das Widerspruchsrecht und die Folgen des Schweigens hinweisen.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">§ 12 Geistiges Eigentum</h2>
            <p className="text-muted-foreground">
              Alle Inhalte der App, einschließlich Texte, Grafiken, Logos und Software, sind urheberrechtlich geschützt und Eigentum des Anbieters oder seiner Lizenzgeber. Eine Nutzung über den vertraglich vereinbarten Umfang hinaus ist ohne ausdrückliche Zustimmung nicht gestattet.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">§ 13 Schlussbestimmungen</h2>
            <p className="text-muted-foreground mb-3">
              Es gilt das Recht der Bundesrepublik Deutschland unter Ausschluss des UN-Kaufrechts.
            </p>
            <p className="text-muted-foreground mb-3">
              Sollten einzelne Bestimmungen dieser AGB unwirksam sein oder werden, bleibt die Wirksamkeit der übrigen Bestimmungen davon unberührt.
            </p>
            <p className="text-muted-foreground">
              Gerichtsstand ist, soweit gesetzlich zulässig, der Sitz des Anbieters.
            </p>
          </section>

          <section className="border-t pt-6 mt-8">
            <p className="text-sm text-muted-foreground">
              Stand: Januar 2025
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AGB;
