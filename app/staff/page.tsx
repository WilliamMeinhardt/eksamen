"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Mail, Award, Heart, Users, Loader2 } from "lucide-react"
import Image from "next/image"

interface Instructor {
  id: number
  name: string
  email: string
  role: string
  bio: string
  specialties: string[]
  certifications: string[]
  image_url: string
  active: boolean
  created_at: string
}

export default function StaffPage() {
  const [instructors, setInstructors] = useState<Instructor[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchInstructors()
  }, [])

  const fetchInstructors = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/instructors")
      if (!response.ok) {
        throw new Error("Failed to fetch instructors")
      }
      const data = await response.json()
      setInstructors(data as Instructor[])
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="container py-8 md:py-12">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex items-center gap-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Laster trenere...</span>
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
            <h3 className="text-lg font-semibold mb-2 text-destructive">Feil ved lasting av trenere</h3>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={fetchInstructors}>Prøv igjen</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const totalCertifications = instructors.reduce((total, instructor) => total + instructor.certifications.length, 0)
  const totalSpecialties = new Set(instructors.flatMap((instructor) => instructor.specialties)).size

  return (
    <div className="container py-8 md:py-12">
      {/* Header */}
      <div className="text-center space-y-4 mb-12">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Møt vårt fantastiske team</h1>
        <p className="text-xl text-muted-foreground max-w-[800px] mx-auto">
          Våre sertifiserte trenere og fitnessfagfolk er lidenskapelig opptatt av å hjelpe deg med å nå dine mål i et
          støttende, inkluderende miljø. Hver bringer unik ekspertise og et engasjement for å gjøre trening tilgjengelig
          for alle.
        </p>
      </div>

      {/* Team Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        <Card className="text-center">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-primary">{instructors.length}</div>
            <div className="text-sm text-muted-foreground">Eksperttrenere</div>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-primary">{totalCertifications}</div>
            <div className="text-sm text-muted-foreground">Sertifiseringer</div>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-primary">{totalSpecialties}</div>
            <div className="text-sm text-muted-foreground">Spesialiteter</div>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-primary">1000+</div>
            <div className="text-sm text-muted-foreground">Fornøyde medlemmer</div>
          </CardContent>
        </Card>
      </div>

      {/* Staff Grid */}
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {instructors.map((instructor) => (
          <Card key={instructor.id} className="overflow-hidden">
            <div className="aspect-square relative">
              <Image
                src={instructor.image_url || "/placeholder.svg?height=300&width=300"}
                alt={`${instructor.name} - ${instructor.role}`}
                fill
                className="object-cover"
              />
            </div>
            <CardHeader>
              <CardTitle className="flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-semibold">{instructor.name}</h3>
                  <p className="text-sm text-primary font-medium">{instructor.role}</p>
                </div>
              </CardTitle>
              <CardDescription className="text-sm leading-relaxed">{instructor.bio}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Specialties */}
              <div>
                <h4 className="text-sm font-semibold mb-2 flex items-center">
                  <Heart className="h-4 w-4 mr-1 text-primary" />
                  Spesialiteter
                </h4>
                <div className="flex flex-wrap gap-1">
                  {instructor.specialties.map((specialty) => (
                    <Badge key={specialty} variant="secondary" className="text-xs">
                      {specialty}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Certifications */}
              <div>
                <h4 className="text-sm font-semibold mb-2 flex items-center">
                  <Award className="h-4 w-4 mr-1 text-primary" />
                  Sertifiseringer
                </h4>
                <div className="flex flex-wrap gap-1">
                  {instructor.certifications.map((cert) => (
                    <Badge key={cert} variant="outline" className="text-xs">
                      {cert}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Contact */}
              <Button variant="outline" size="sm" className="w-full" asChild>
                <a href={`mailto:${instructor.email}`}>
                  <Mail className="h-4 w-4 mr-2" />
                  Kontakt {instructor.name.split(" ")[0]}
                </a>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Team Philosophy */}
      <section className="mt-16 md:mt-24">
        <Card className="bg-muted/50">
          <CardContent className="p-8 md:p-12">
            <div className="text-center space-y-6">
              <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-3xl font-bold tracking-tight">Vår teamfilosofi</h2>
              <p className="text-lg text-muted-foreground max-w-[800px] mx-auto">
                Vi tror at de beste treningsresultatene kommer fra en kombinasjon av ekspertveiledning, ekte omsorg og
                et støttende fellesskap. Teamet vårt er forpliktet til kontinuerlig læring og holder seg oppdatert med
                den nyeste treningsforskningen for å gi deg de mest effektive og trygge treningsmetodene.
              </p>
              <div className="grid gap-4 md:grid-cols-3 mt-8">
                <div className="text-center">
                  <h3 className="font-semibold mb-2">Inkluderende tilnærming</h3>
                  <p className="text-sm text-muted-foreground">
                    Hver trener er forpliktet til å skape velkomne rom for alle treningsnivåer og evner.
                  </p>
                </div>
                <div className="text-center">
                  <h3 className="font-semibold mb-2">Kontinuerlig læring</h3>
                  <p className="text-sm text-muted-foreground">
                    Teamet vårt deltar regelmessig på workshops og kurs for å holde seg oppdatert med treningstrender.
                  </p>
                </div>
                <div className="text-center">
                  <h3 className="font-semibold mb-2">Personlig tilknytning</h3>
                  <p className="text-sm text-muted-foreground">
                    Vi tar oss tid til å forstå dine mål og skape personlige opplevelser.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
