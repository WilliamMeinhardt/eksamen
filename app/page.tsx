import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart, Users, MapPin, Clock, ArrowRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function HomePage() {
  return (
    <div className="flex bg-[#409] dark:bg-[#409] flex-col items-center justify-center w-full min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-primary/5 to-background w-full">
        <div className="hero-pattern absolute inset-0" />
        <div className="container mx-auto relative py-24 md:py-32 flex flex-col items-center justify-center">
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-center justify-center w-full">
            <div className="space-y-6 text-center flex flex-col items-center justify-center">
              <div className="space-y-4">
                <Badge variant="secondary" className="w-fit mx-auto">
                  Velkommen til Treningsglede AS
                </Badge>
                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                  Trening for <span className="text-primary">alle</span>
                </h1>
                <p className="text-xl text-muted-foreground max-w-[600px] mx-auto text-white">
                  Bli med i vårt inkluderende treningsfellesskap hvor alle kropper blir feiret. Vi tilbyr varierte
                  treningsøkter både innendørs og utendørs, designet for å gjøre trening tilgjengelig og morsomt for
                  alle.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild>
                  <Link href="/sessions">
                    Se treningstimer
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link href="/staff">Møt vårt team</Link>
                </Button>
              </div>
            </div>
            <div className="relative flex justify-center items-center">
              <Image
                src="/trening.avif"
                alt="Folk som trener sammen i et hyggelig miljø"
                width={600}
                height={500}
                className="rounded-lg shadow-2xl"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-16 md:py-24 w-full flex justify-center">
        <div className="container flex flex-col items-center">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Vår treningsfilosofi</h2>
            <p className="text-xl text-muted-foreground max-w-[800px] mx-auto text-white">
              Hos Treningsglede AS tror vi at trening skal være en kilde til glede, ikke stress. Vår tilnærming
              fokuserer på å skape et støttende miljø hvor alle kan trives.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3 justify-center items-stretch max-w-5xl w-full px-4 mx-auto">
            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Heart className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Inkluderende fellesskap</CardTitle>
                <CardDescription>
                  Vi ønsker velkommen mennesker i alle aldre, på alle treningsnivåer og med alle bakgrunner. Alle
                  fortjener å føle seg komfortable og støttet på sin treningsreise.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Ekspertveiledning</CardTitle>
                <CardDescription>
                  Våre sertifiserte trenere gir personlig oppmerksomhet og tilpasninger for å sikre at hver deltaker får
                  mest mulig ut av hver økt.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Fleksible lokasjoner</CardTitle>
                <CardDescription>
                  Velg mellom innendørs studioøkter eller utendørs eventyr. Vi bringer variasjon for å holde
                  treningsrutinen din spennende og frisk.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Sessions */}
      <section className="py-16 md:py-24 bg-muted/50 w-full flex justify-center">
        <div className="container flex flex-col items-center">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Populære treningstimer</h2>
            <p className="text-xl text-muted-foreground text-white">Oppdag noen av våre mest populære treningsklasser</p>
          </div>

          <div className="grid gap-6 max-w-[1200px] mx-auto px-8 md:grid-cols-2 lg:grid-cols-3 justify-center">
            <Card className="w-full">
              <div className="aspect-video relative">
                <Image src="/placeholder.svg?height=200&width=400" alt="Styrketrening" fill className="object-cover" />
                <Badge className="absolute top-4 left-4" variant="secondary">
                  Innendørs
                </Badge>
              </div>
              <CardContent>
                <CardTitle className="flex items-center justify-between">
                  Styrke & Kondisjon
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="h-4 w-4 mr-1" />
                    50 min
                  </div>
                </CardTitle>
                <CardDescription>
                  Bygg funksjonell styrke med vårt omfattende styrketreningsprogram. Inkluderer instruksjon i riktig
                  form og progressive overbelastningsprinsipper.
                </CardDescription>
              </CardContent>
            </Card>
            <Card className="w-full">
              <div className="aspect-video relative">
                <Image src="/placeholder.svg?height=200&width=400" alt="Styrketrening" fill className="object-cover" />
                <Badge className="absolute top-4 left-4" variant="secondary">
                  Innendørs
                </Badge>
              </div>
              <CardContent>
                <CardTitle className="flex items-center justify-between">
                  Styrke & Kondisjon
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="h-4 w-4 mr-1" />
                    50 min
                  </div>
                </CardTitle>
                <CardDescription>
                  Bygg funksjonell styrke med vårt omfattende styrketreningsprogram. Inkluderer instruksjon i riktig
                  form og progressive overbelastningsprinsipper.
                </CardDescription>
              </CardContent>
            </Card>
            <Card className="w-full">
              <div className="aspect-video relative">
                <Image src="/placeholder.svg?height=200&width=400" alt="Styrketrening" fill className="object-cover" />
                <Badge className="absolute top-4 left-4" variant="secondary">
                  Innendørs
                </Badge>
              </div>
              <CardContent>
                <CardTitle className="flex items-center justify-between">
                  Styrke & Kondisjon
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="h-4 w-4 mr-1" />
                    50 min
                  </div>
                </CardTitle>
                <CardDescription>
                  Bygg funksjonell styrke med vårt omfattende styrketreningsprogram. Inkluderer instruksjon i riktig
                  form og progressive overbelastningsprinsipper.
                </CardDescription>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-8">
            <Button asChild>
              <Link href="/sessions">
                Se alle timer
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 w-full flex justify-center">
        <div className="container flex flex-col items-center">
          <Card className="gradient-bg text-black w-full max-w-2xl mx-auto">
            <CardContent className="p-8 md:p-12 text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
                Klar til å starte din treningsreise?
              </h2>
              <p className="text-xl opacity-90 mb-8 max-w-[600px] mx-auto">
                Bli med i fellesskapet vårt i dag og oppdag gleden ved bevegelse. Din første økt er på oss!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="secondary" asChild>
                  <Link href="/sessions">Bestill din første time</Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-primary"
                  asChild
                >
                  <Link href="/staff">Møt våre trenere</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
