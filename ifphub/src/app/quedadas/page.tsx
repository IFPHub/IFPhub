"use client"

import { AppSidebar } from "@/app/frontend/compartir-proyectos/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/app/frontend/components/ui/sidebar";
import { Hero_quedadas } from "@/app/frontend/components/hero-quedadas";
import { EventCard } from "@/app/frontend/components/event-card";
import { CategoriesCarousel } from "@/app/frontend/components/categories-carousel";
import { HowItWorks } from "@/app/frontend/components/how-it-works";
import { Testimonials } from "@/app/frontend/components/testimonials";
import { EventDetailsModal } from "@/app/frontend/components/event-details-modal";
import { Footer } from "@/app/frontend/components/footer";
import { StatsSection } from "@/app/frontend/components/stats-section";
import { NewsletterSection } from "@/app/frontend/components/newsletter-section";
import { Button } from "@/app/frontend/components/ui/button";
import { ArrowLeft, Search } from "lucide-react";
import { Input } from "@/app/frontend/components/ui/input";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function Page() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [registeredEvents, setRegisteredEvents] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const [events, setEvents] = useState([
    {
      title: "TALLER DE PROGRAMACIÓN",
      description: "Aprende los fundamentos de React y Next.js en este taller intensivo para principiantes.",
      image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=2070&auto=format&fit=crop",
      participants: 20,
      date: "Apr 1, 2025",
      time: "9:41 AM",
      category: "Tecnologia",
      address: "Biblioteca Central, Sala 3"
    },
    {
      title: "PARTIDO DE FÚTBOL",
      description: "Ven a jugar un partido amistoso con compañeros de otros cursos. ¡Todos son bienvenidos!",
      image: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=2070&auto=format&fit=crop",
      participants: 14,
      date: "Apr 1, 2025",
      time: "5:00 PM",
      category: "Deportes",
      address: "Polideportivo Municipal"
    },
    {
      title: "HACKATHON NOCTURNO",
      description: "Desarrolla una solución innovadora en 12 horas. Pizza y bebidas incluidas.",
      image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2070&auto=format&fit=crop",
      participants: 45,
      date: "Apr 2, 2025",
      time: "8:00 PM",
      category: "Tecnologia",
      address: "Coworking Space, Calle Mayor 10"
    },
    {
      title: "CLUB DE LECTURA",
      description: "Discusión sobre el libro del mes: 'Clean Code'. Trae tus notas y opiniones.",
      image: "https://images.unsplash.com/photo-1491841550275-ad7854e35ca6?q=80&w=1974&auto=format&fit=crop",
      participants: 8,
      date: "Apr 3, 2025",
      time: "4:00 PM",
      category: "Educacion",
      address: "Cafetería El Libro"
    },
    {
      title: "CATA DE CERVEZAS",
      description: "Descubre nuevos sabores y aprende sobre la elaboración de cerveza artesanal.",
      image: "https://images.unsplash.com/photo-1575425186775-b8de9a427e67?q=80&w=1974&auto=format&fit=crop",
      participants: 12,
      date: "Apr 4, 2025",
      time: "7:30 PM",
      category: "Cocina",
      address: "Cervecería Artesana, Plaza Mayor"
    },
    {
      title: "SENDERISMO GRUPAL",
      description: "Ruta por la montaña para desconectar y disfrutar de la naturaleza.",
      image: "https://images.unsplash.com/photo-1551632811-561732d1e306?q=80&w=2070&auto=format&fit=crop",
      participants: 25,
      date: "Apr 5, 2025",
      time: "8:00 AM",
      category: "Deportes",
      address: "Parking de la Sierra, Km 15"
    }
  ]);

  const addEvent = (newEvent: any) => {
    setEvents(prev => [...prev, newEvent]);
  };

  const handleEventClick = (event: any, index: number) => {
    setSelectedEvent({ ...event, index });
    setModalOpen(true);
  };

  const handleRegister = () => {
    if (selectedEvent) {
      const eventIndex = selectedEvent.index;
      if (!registeredEvents.includes(eventIndex)) {
        setRegisteredEvents(prev => [...prev, eventIndex]);
        setEvents(prev => prev.map((event, idx) =>
          idx === eventIndex
            ? { ...event, participants: event.participants + 1 }
            : event
        ));
      }
    }
  };

  const filteredEvents = events.filter(event => {
    const matchesCategory = selectedCategory ? event.category === selectedCategory : true;
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const [uid, setUid] = useState<string | null>(null);
    const [sig, setSig] = useState<string | null>(null);
  
    useEffect(() => {
      const params = new URLSearchParams(window.location.search);
      setUid(params.get("uid"));
      setSig(params.get("sig"));
    }, []);
  
    if (!uid || !sig) return null;

  return (
    <SidebarProvider>
      <AppSidebar uid={uid} sig={sig}/>
      <SidebarInset>
        <header className="sticky top-4 z-50 px-4 md:px-8 w-full max-w-7xl mx-auto mb-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 px-6 py-3 flex items-center justify-between gap-4">
            {/* Left: Logo & Name */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#124d58] rounded-md flex-shrink-0 shadow-sm" />
              <div className="flex flex-col">
                <span className="font-bold text-[#124d58] leading-tight text-sm"></span>
                <span className="text-[10px] text-gray-400 font-medium"></span>
              </div>
            </div>

            {/* Right: Search */}
            <div className="w-48">
              <div className="relative">
                <Input
                  type="search"
                  placeholder="Buscar..."
                  className="h-8 text-xs bg-gray-50 border-gray-100 rounded-md pl-3 pr-8 focus-visible:ring-[#124d58]/20"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search className="absolute right-2.5 top-2 h-3.5 w-3.5 text-gray-300" />
              </div>
            </div>
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-4 pt-0 min-h-screen">
          {!selectedCategory && !searchQuery && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Hero_quedadas onCreateEvent={addEvent} />
            </motion.div>
          )}

          <CategoriesCarousel onSelectCategory={setSelectedCategory} selectedCategory={selectedCategory} />

          {(selectedCategory || searchQuery) && (
            <div className="p-4">
              <Button
                onClick={() => {
                  setSelectedCategory(null);
                  setSearchQuery("");
                }}
                variant="ghost"
                className="flex items-center gap-2 mb-4 hover:bg-[#D65A7E]/10 hover:text-[#D65A7E]"
              >
                <ArrowLeft className="w-4 h-4" />
                Volver a inicio
              </Button>
            </div>
          )}

          <div className="p-5 mt-8 container mx-auto">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl font-bold mb-8 flex justify-center text-center"
            >
              {searchQuery
                ? `Resultados para "${searchQuery}"`
                : selectedCategory
                  ? `Quedadas de ${selectedCategory}`
                  : "Top planes para estas semanas"}
            </motion.h1>

            {filteredEvents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
                {filteredEvents.map((event, index) => {
                  const originalIndex = events.findIndex(e => e === event);
                  return (
                    <EventCard
                      key={index}
                      {...event}
                      onClick={() => handleEventClick(event, originalIndex)}
                    />
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-20">
                <p className="text-xl text-muted-foreground">No se encontraron eventos.</p>
                <Button
                  variant="link"
                  onClick={() => setSearchQuery("")}
                  className="mt-2 text-[#D65A7E]"
                >
                  Limpiar búsqueda
                </Button>
              </div>
            )}
          </div>

          {!selectedCategory && !searchQuery && (
            <>
              <StatsSection />

              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <HowItWorks />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <Testimonials />
              </motion.div>

              <NewsletterSection />
            </>
          )}

          <Footer />
        </div>

        <EventDetailsModal
          event={selectedEvent}
          open={modalOpen}
          onOpenChange={setModalOpen}
          isRegistered={selectedEvent ? registeredEvents.includes(selectedEvent.index) : false}
          onRegister={handleRegister}
        />
      </SidebarInset>
    </SidebarProvider>
  );
}