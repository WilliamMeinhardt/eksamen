"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Clock, MapPin, Users, Calendar, CreditCard, AlertCircle } from "lucide-react"
import { useUser } from "@clerk/nextjs"

interface Session {
  id: number
  title: string
  instructor: string
  type: string
  duration: number
  maxParticipants: number
  currentParticipants: number
  waitlist: number
  time: string
  date: string
  location: string
  price: number
  rawDate?: string // ISO date string from the database
  rawTime?: string // Time string from the database
}

function isSessionExpired(session: Session): boolean {
  // If we have raw date and time values, use them for comparison
  if (session.rawDate && session.rawTime) {
    const sessionDateTime = new Date(`${session.rawDate}T${session.rawTime}`)
    return sessionDateTime < new Date()
  }

  // Fallback: Try to parse from formatted date and time
  // This is less reliable but works as a backup
  const [day, month, year] = session.date.split(".").map(Number)
  const [hours, minutes] = session.time.split(":").map(Number)

  if (!isNaN(day) && !isNaN(month) && !isNaN(year) && !isNaN(hours) && !isNaN(minutes)) {
    const sessionDate = new Date(year, month - 1, day, hours, minutes)
    return sessionDate < new Date()
  }

  return false
}

interface BookingDialogProps {
  session: Session
  open: boolean
  onOpenChange: (open: boolean) => void
  onBookingComplete?: () => void
}

export function BookingDialog({ session, open, onOpenChange, onBookingComplete }: BookingDialogProps) {
  const [isBooking, setIsBooking] = useState(false)
  const [bookingComplete, setBookingComplete] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { user } = useUser()

  const spotsLeft = session.maxParticipants - session.currentParticipants
  const isFull = spotsLeft <= 0
  const isExpired = isSessionExpired(session)

  const handleBooking = async () => {
    setIsBooking(true)
    setError(null)

    // Prevent booking expired sessions
    if (isExpired) {
      setError("Denne timen har allerede startet eller er avsluttet")
      setIsBooking(false)
      return
    }

    try {
      const response = await fetch("/api/book-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sessionId: session.id,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        const errorMsg =
          typeof data === "object" && data !== null && "error" in data ? (data as { error?: string }).error : undefined
        throw new Error(errorMsg || "Failed to book session")
      }

      setBookingComplete(true)

      // Call the callback to refresh data
      if (onBookingComplete) {
        onBookingComplete()
      }

      // Close dialog after showing success message
      setTimeout(() => {
        setBookingComplete(false)
        onOpenChange(false)
      }, 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsBooking(false)
    }
  }

  if (bookingComplete) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
            </div>
            <DialogTitle className="text-green-700">
              {isFull ? "Lagt til på venteliste!" : "Bestilling bekreftet!"}
            </DialogTitle>
            <DialogDescription>
              {isFull
                ? `Du er lagt til på ventelisten for ${session.title}. Vi vil varsle deg hvis en plass blir ledig.`
                : `Du er klar for ${session.title} den ${session.date} kl. ${session.time}.`}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{isFull ? "Bli med på venteliste" : "Bestill time"}</span>
            <Badge variant={session.type === "outdoor" ? "default" : "secondary"}>
              {session.type === "outdoor" ? "Utendørs" : "Innendørs"}
            </Badge>
          </DialogTitle>
          <DialogDescription>
            Fullfør din {isFull ? "ventelisteregistrering" : "bestilling"} for denne timen
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Session Details */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg">{session.title}</h3>
            <p className="text-sm text-muted-foreground">med {session.instructor}</p>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center text-muted-foreground">
                <Calendar className="h-4 w-4 mr-2" />
                {session.date}
              </div>
              <div className="flex items-center text-muted-foreground">
                <Clock className="h-4 w-4 mr-2" />
                {session.time} ({session.duration} min)
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
          </div>

          <Separator />

          {/* Availability Status */}
          {isExpired ? (
            <div className="flex items-center gap-2 p-3 bg-red-50 rounded-lg border border-red-200">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <div className="text-sm">
                <p className="font-medium text-red-800">Timen har utløpt</p>
                <p className="text-red-600">Denne timen har allerede startet eller er avsluttet</p>
              </div>
            </div>
          ) : isFull ? (
            <div className="flex items-center gap-2 p-3 bg-orange-50 rounded-lg border border-orange-200">
              <AlertCircle className="h-4 w-4 text-orange-600" />
              <div className="text-sm">
                <p className="font-medium text-orange-800">Timen er full</p>
                <p className="text-orange-600">
                  Du vil bli lagt til på ventelisten. Nåværende venteliste: {session.waitlist} personer
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg border border-green-200">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <p className="text-sm text-green-700">
                <span className="font-medium">{spotsLeft} plasser tilgjengelig</span>
              </p>
            </div>
          )}

          {/* User Info */}
          <div className="space-y-2">
            <h4 className="font-medium">Bestilling for:</h4>
            <p className="text-sm text-muted-foreground">{user?.fullName || user?.emailAddresses[0]?.emailAddress}</p>
          </div>

          <Separator />

          {/* Pricing */}
          <div className="flex items-center justify-between">
            <span className="font-medium">{isFull ? "Venteliste (Gratis)" : "Timepris"}</span>
            <span className="text-lg font-bold">{isFull ? "Gratis" : `${session.price} kr`}</span>
          </div>

          {!isFull && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CreditCard className="h-4 w-4" />
              <span>Betaling vil bli behandlet etter bestillingsbekreftelse</span>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 rounded-lg border border-red-200">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Avbryt
          </Button>
          <Button onClick={handleBooking} disabled={isBooking || isExpired} className="w-full sm:w-auto">
            {isBooking ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                {isFull ? "Legger til på venteliste..." : "Bestiller..."}
              </div>
            ) : isExpired ? (
              "Timen har utløpt"
            ) : isFull ? (
              "Bli med på venteliste"
            ) : (
              `Bestill for ${session.price} kr`
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
