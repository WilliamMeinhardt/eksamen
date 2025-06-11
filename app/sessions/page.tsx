"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Clock, MapPin, Users, Star, Calendar, Search, Filter, Loader2 } from "lucide-react"
import Image from "next/image"
import { useUser } from "@clerk/nextjs"
import { BookingDialog } from "@/components/booking-dialog"

interface Session {
  id: number
  title: string
  description: string
  instructor: string
  type: string
  duration: number
  maxParticipants: number
  currentParticipants: number
  waitlist: number
  difficulty: string
  time: string
  date: string
  location: string
  price: number
  rating: number
  reviews: number
  image: string
  tags: string[]
}

export default function SessionsPage() {
  const [sessions, setSessions] = useState<Session[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedType, setSelectedType] = useState("all")
  const [selectedDifficulty, setSelectedDifficulty] = useState("all")
  const [selectedBooking, setSelectedBooking] = useState<Session | null>(null)
  const { isSignedIn } = useUser()

  useEffect(() => {
    fetchSessions()
  }, [])

  const fetchSessions = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/sessions")
      if (!response.ok) {
        throw new Error("Failed to fetch sessions")
      }
      const data = await response.json()
      setSessions(data as Session[])
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  const filteredSessions = sessions.filter((session) => {
    const matchesSearch =
      session.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.instructor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesType = selectedType === "all" || session.type === selectedType
    const matchesDifficulty = selectedDifficulty === "all" || session.difficulty === selectedDifficulty

    return matchesSearch && matchesType && matchesDifficulty
  })

  const indoorSessions = filteredSessions.filter((session) => session.type === "indoor")
  const outdoorSessions = filteredSessions.filter((session) => session.type === "outdoor")

  const handleBookSession = (session: Session) => {
    if (!isSignedIn) {
      // This would trigger the Clerk sign-in modal
      return
    }
    setSelectedBooking(session)
  }

  const handleBookingComplete = () => {
    // Refresh sessions data after booking
    fetchSessions()
  }

  const SessionCard = ({ session }: { session: Session }) => {
    const spotsLeft = session.maxParticipants - session.currentParticipants
    const isFull = spotsLeft <= 0

    return (
      <Card className="overflow-hidden hover:shadow-lg transition-shadow">
        <div className="aspect-video relative">
          <Image
            src={session.image || "/placeholder.svg?height=200&width=400"}
            alt={session.title}
            fill
            className="object-cover"
          />
          <div className="absolute top-4 left-4 flex gap-2">
            <Badge variant={session.type === "outdoor" ? "default" : "secondary"}>
              {session.type === "outdoor" ? "Utendørs" : "Innendørs"}
            </Badge>
            <Badge variant="outline" className="bg-white/90">
              {session.difficulty}
            </Badge>
          </div>
          {isFull && <Badge className="absolute top-4 right-4 bg-destructive">Full</Badge>}
        </div>

        <CardHeader>
          <CardTitle className="flex items-start justify-between">
            <div>
              <h3 className="text-xl font-semibold">{session.title}</h3>
              <p className="text-sm text-primary font-medium">med {session.instructor}</p>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold">{session.price} kr</div>
            </div>
          </CardTitle>
          <CardDescription className="text-sm leading-relaxed">{session.description}</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Session Details */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center text-muted-foreground">
              <Clock className="h-4 w-4 mr-2" />
              {session.duration} min
            </div>
            <div className="flex items-center text-muted-foreground">
              <Calendar className="h-4 w-4 mr-2" />
              {session.time}
            </div>
            <div className="flex items-center text-muted-foreground">
              <MapPin className="h-4 w-4 mr-2" />
              {session.location}
            </div>
            <div className="flex items-center text-muted-foreground">
              <Users className="h-4 w-4 mr-2" />
              {session.currentParticipants}/{session.maxParticipants}
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1">
            {session.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>

          {/* Rating and Availability */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Star className="h-4 w-4 text-yellow-500 mr-1" />
              <span className="text-sm">
                {session.rating > 0 ? `${session.rating} (${session.reviews} anmeldelser)` : "Ingen anmeldelser ennå"}
              </span>
            </div>
            <div className="text-sm">
              {isFull ? (
                <span className="text-destructive">Venteliste: {session.waitlist} personer</span>
              ) : (
                <span className="text-green-600">{spotsLeft} plasser igjen</span>
              )}
            </div>
          </div>

          {/* Book Button */}
          <Button
            className="w-full"
            onClick={() => handleBookSession(session)}
            variant={isFull ? "outline" : "default"}
          >
            {isFull ? "Bli med på venteliste" : "Bestill time"}
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (loading) {
    return (
      <div className="container py-8 md:py-12">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex items-center gap-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Laster treningstimer...</span>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container py-8 md:py-12">
        <Card className="text-center py-12">
          <CardContent>
            <h3 className="text-lg font-semibold mb-2 text-destructive">Feil ved lasting av timer</h3>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={fetchSessions}>Prøv igjen</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container py-8 md:py-12">
      {/* Header */}
      <div className="text-center space-y-4 mb-8">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Treningstimer</h1>
        <p className="text-xl text-muted-foreground max-w-[800px] mx-auto">
          Velg blant vårt mangfoldige utvalg av innendørs og utendørs treningsøkter. Alle nivåer er velkomne, med
          ekspertveiledning og støttende fellesskap.
        </p>
      </div>

      {/* Filters */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Søk etter timer, instruktører eller tags..."
                  value={searchTerm}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm((e.target as HTMLInputElement).value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-full md:w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Lokasjon" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle lokasjoner</SelectItem>
                <SelectItem value="indoor">Kun innendørs</SelectItem>
                <SelectItem value="outdoor">Kun utendørs</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Vanskelighetsgrad" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle nivåer</SelectItem>
                <SelectItem value="Nybegynner">Nybegynner</SelectItem>
                <SelectItem value="Middels">Middels</SelectItem>
                <SelectItem value="Avansert">Avansert</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Sessions Tabs */}
      <Tabs defaultValue="all" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">Alle timer ({filteredSessions.length})</TabsTrigger>
          <TabsTrigger value="indoor">Innendørs ({indoorSessions.length})</TabsTrigger>
          <TabsTrigger value="outdoor">Utendørs ({outdoorSessions.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredSessions.map((session) => (
              <SessionCard key={session.id} session={session} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="indoor" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {indoorSessions.map((session) => (
              <SessionCard key={session.id} session={session} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="outdoor" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {outdoorSessions.map((session) => (
              <SessionCard key={session.id} session={session} />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {filteredSessions.length === 0 && !loading && (
        <Card className="text-center py-12">
          <CardContent>
            <h3 className="text-lg font-semibold mb-2">Ingen timer funnet</h3>
            <p className="text-muted-foreground">
              Prøv å justere søkekriteriene eller filtrene for å finne flere timer.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Booking Dialog */}
      {selectedBooking && (
        <BookingDialog
          session={selectedBooking}
          open={!!selectedBooking}
          onOpenChange={(open) => !open && setSelectedBooking(null)}
          onBookingComplete={handleBookingComplete}
        />
      )}
    </div>
  )
}
