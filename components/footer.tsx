import Link from "next/link"
import { Dumbbell, Facebook, Instagram, Twitter } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="container mx-auto py-8 md:py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4 justify-center items-start">
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2 justify-center md:justify-start">
              <Dumbbell className="h-6 w-6 text-primary" />
              <span className="font-bold text-foreground">Treningsglede AS</span>
            </Link>
            <p className="text-sm text-muted-foreground text-center md:text-left">
              Vi gjør trening tilgjengelig og morsomt for alle gjennom inkluderende treningsøkter.
            </p>
          </div>
          <div className="space-y-4 text-center md:text-left">
            <h4 className="text-sm font-semibold text-foreground">Hurtiglenker</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-primary">
                  Hjem
                </Link>
              </li>
              <li>
                <Link href="/staff" className="text-muted-foreground hover:text-primary">
                  Våre trenere
                </Link>
              </li>
              <li>
                <Link href="/sessions" className="text-muted-foreground hover:text-primary">
                  Treningstimer
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-4 text-center md:text-left">
            <h4 className="text-sm font-semibold text-foreground">Kontakt</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>E-post: info@treningsglede.no</li>
              <li>Telefon: +47 123 45 678</li>
              <li>Adresse: Oslo, Norge</li>
            </ul>
          </div>
          <div className="space-y-4 text-center md:text-left">
            <h4 className="text-sm font-semibold text-foreground">Følg oss</h4>
            <div className="flex justify-center md:justify-start space-x-4">
              <Link href="#" className="text-muted-foreground hover:text-primary">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-border pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2024 Treningsglede AS. Alle rettigheter reservert.</p>
        </div>
      </div>
    </footer>
  )
}
