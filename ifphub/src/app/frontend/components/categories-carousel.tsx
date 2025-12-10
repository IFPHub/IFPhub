import * as React from "react"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/app/frontend/components/ui/carousel"
import { cn } from "@/lib/utils"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { useRef } from "react"
import Autoplay from "embla-carousel-autoplay"

interface CategoriesCarouselProps {
    onSelectCategory: (category: string) => void;
    selectedCategory: string | null;
}

export function CategoriesCarousel({ onSelectCategory, selectedCategory }: CategoriesCarouselProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    const categories = [
        "Deportes",
        "Educacion",
        "Ocio",
        "Idiomas",
        "Tecnologia",
        "Arte",
        "Música",
        "Cocina"
    ]

    useGSAP(() => {
        gsap.from(".category-item", {
            y: 30,
            opacity: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: "power3.out",
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top 80%",
            }
        })
    }, { scope: containerRef });

    return (
        <div ref={containerRef} className="w-full bg-[#124d58] py-8 border-y border-[#1a6b7a]">
            <div className="max-w-5xl mx-auto px-12 relative">
                <Carousel
                    opts={{
                        align: "start",
                        loop: true,
                    }}
                    plugins={[
                        Autoplay({
                            delay: 2000,
                        }),
                    ]}
                    className="w-full"
                >
                    <CarouselContent className="-ml-4">
                        {categories.map((category, index) => (
                            <CarouselItem key={index} className="pl-4 md:basis-1/3 lg:basis-1/5 category-item">
                                <div className="flex items-center justify-center h-full">
                                    <button
                                        onClick={() => onSelectCategory(category)}
                                        className={cn(
                                            "text-xl font-bold transition-all duration-300 px-4 py-2 rounded-full",
                                            selectedCategory === category
                                                ? "bg-white text-[#124d58] scale-110 shadow-lg"
                                                : "text-white/80 hover:text-white hover:bg-white/10"
                                        )}
                                    >
                                        {category}
                                    </button>
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious className="bg-white/10 border-none hover:bg-white/20 text-white hover:text-white -left-10" />
                    <CarouselNext className="bg-white/10 border-none hover:bg-white/20 text-white hover:text-white -right-10" />
                </Carousel>
            </div>
        </div>
    )
}
