import { motion } from 'motion/react';
import { Award, Camera, Globe, Heart } from 'lucide-react';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';

export function AboutPage() {
  const achievements = [
    {
      icon: Award,
      title: 'Award-Winning',
      description: 'Fashion Photographer of The Year Award recipient',
    },
    {
      icon: Globe,
      title: 'International Exhibitions',
      description: 'Work exhibited in London, Lagos, and Abuja',
    },
    {
      icon: Camera,
      title: '30+ Years Experience',
      description: 'Making images since 1989',
    },
    {
      icon: Heart,
      title: 'Passionate Educator',
      description: 'Executive programme at Lagos Business School',
    },
  ];

  const exhibitions = [
    {
      year: '2023',
      title: 'EKOMO',
      description: 'An exploration of African Musical heritage through traditional instruments',
      location: 'Pancras Library, Camden, London',
    },
    {
      year: '2022',
      title: 'Ili',
      description: 'A journey through African Fabrics',
      location: 'Moeshen Gallery, Abuja and Lagos',
    },
    {
      year: '2019',
      title: 'Skin Deep',
      description: 'Exhibition at the Ake Festival',
      location: 'Mike Adenuga Center, Ikoyi, Lagos',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[50vh] flex items-center justify-center overflow-hidden bg-[#1C1C1E]">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1617463874381-85b513b3e991?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaG90b2dyYXBoeSUyMHN0dWRpb3xlbnwxfHx8fDE3NjkzMjg3MTB8MA&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Photography Studio"
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        />
        
        <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="font-['Playfair_Display'] text-5xl md:text-6xl text-white mb-6 leading-tight"
          >
            About Hakeem
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-['Inter'] text-lg text-white/90 max-w-2xl mx-auto"
          >
            One of the most imaginative minds working the camera in Nigeria today
          </motion.p>
        </div>
      </section>

      {/* Biography Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="sticky top-8"
          >
            <div className="aspect-[3/4] bg-[#F5F5F5] overflow-hidden rounded-lg">
              <ImageWithFallback
                src="/hakeem-headshot.jpg"
                alt="Hakeem Salaam"
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-6"
          >
            <h2 className="font-['Playfair_Display'] text-4xl md:text-5xl text-[#1C1C1E] mb-8">
              Hakeem Salaam
            </h2>

            <div className="font-['Inter'] text-[#1C1C1E] leading-relaxed space-y-6 text-justify">
              <p>
                Hakeem is one of the most imaginative minds working the camera in Nigeria today. 
                Hakeem began making images in his mind as a child, and started capturing them in 1989 
                when he bought his first camera, a Pentax point-and-shoot Obscura. The fascination with 
                still images grew, but he remained in his dark room making private photographs until 2001, 
                when he began shooting real people with a Pentax SLR.
              </p>

              <p>
                Hakeem is a Chartered Estate Surveyor and Valuer, having graduated in the discipline in 
                1992, from the University of Lagos. Since 2007 he has engaged the profession of photography 
                seeking the uncommon beauty in the viewing lens of the camera. Aside from the sociocultural 
                trappings of his work is its pedagogical merit.
              </p>

              <p>
                Hakeem did an executive programme at the Lagos Business School, worked in estate firms and 
                the Lagos State Government until March 2010 when he voluntarily retired to follow his heart. 
                A widely published photographer, he is interested in documentary, travel and landscape, portrait 
                and fashion photography.
              </p>

              <p>
                He is the recipient of the Fashion photographer of The Year Award. His work has been exhibited 
                both locally and internationally. His work, Skin Deep was exhibited in 2019 at the Ake Festival 
                held at the Mike Adenuga Center, Ikoyi, Lagos.
              </p>

              <p>
                His most recent exhibitions, EKOMO, an exploration of African Musical heritage through traditional 
                instruments held at the Pancras Library, Camden, London, 2023 and Ili, a journey through African 
                Fabrics, 2022 held at Moeshen Gallery, Abuja and Lagos.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Achievements Grid */}
      <section className="bg-[#F5F5F5] py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-['Playfair_Display'] text-4xl md:text-5xl text-[#1C1C1E] mb-4">
              Achievements
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {achievements.map((achievement, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white p-8 rounded-lg text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-[#C9A45C]/10 rounded-full mb-6">
                  <achievement.icon className="h-8 w-8 text-[#C9A45C]" />
                </div>
                <h3 className="font-['Playfair_Display'] text-xl text-[#1C1C1E] mb-3">
                  {achievement.title}
                </h3>
                <p className="font-['Inter'] text-sm text-[#8E8E93]">
                  {achievement.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Exhibitions Timeline */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <h2 className="font-['Playfair_Display'] text-4xl md:text-5xl text-[#1C1C1E] mb-4">
            Recent Exhibitions
          </h2>
          <p className="font-['Inter'] text-[#8E8E93] max-w-2xl mx-auto">
            A selection of recent exhibitions showcasing work across different themes and locations
          </p>
        </div>

        <div className="space-y-12">
          {exhibitions.map((exhibition, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="relative pl-24 pb-12 border-l-2 border-[#C9A45C]/30 last:border-l-0 last:pb-0"
            >
              <div className="absolute left-0 top-0 -translate-x-1/2 w-12 h-12 bg-[#C9A45C] rounded-full flex items-center justify-center">
                <span className="font-['Playfair_Display'] text-white font-medium">
                  {exhibition.year.slice(2)}
                </span>
              </div>
              
              <div className="bg-white border border-[#8E8E93]/20 rounded-lg p-8 hover:shadow-lg transition-shadow">
                <span className="inline-block px-3 py-1 bg-[#C9A45C]/10 text-[#C9A45C] font-['Inter'] text-sm rounded-full mb-4">
                  {exhibition.year}
                </span>
                <h3 className="font-['Playfair_Display'] text-3xl text-[#1C1C1E] mb-3">
                  {exhibition.title}
                </h3>
                <p className="font-['Inter'] text-[#1C1C1E] mb-4">
                  {exhibition.description}
                </p>
                <p className="font-['Inter'] text-sm text-[#8E8E93]">
                  📍 {exhibition.location}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Philosophy */}
      <section className="bg-[#1C1C1E] text-white py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="font-['Playfair_Display'] text-4xl md:text-5xl mb-8">
              Philosophy
            </h2>
            <blockquote className="font-['Inter'] text-xl md:text-2xl text-white/90 leading-relaxed italic">
              "I seek the uncommon beauty in the viewing lens of the camera. 
              Beyond the sociocultural trappings, my work carries pedagogical merit, 
              teaching viewers to see the world through a different perspective."
            </blockquote>
            <p className="font-['Inter'] text-[#C9A45C] mt-6">— Hakeem Salaam</p>
          </motion.div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <h2 className="font-['Playfair_Display'] text-4xl md:text-5xl text-[#1C1C1E] mb-6">
          Let's Create Together
        </h2>
        <p className="font-['Inter'] text-lg text-[#8E8E93] mb-8 max-w-2xl mx-auto">
          Interested in collaborating or commissioning a project? 
          Get in touch to discuss how we can bring your vision to life.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="mailto:hakeem@hspimages.com"
            className="inline-flex items-center justify-center px-8 py-3 bg-[#C9A45C] hover:bg-[#B89350] text-white font-['Inter'] rounded-md transition-colors"
          >
            Get in Touch
          </a>
          <a
            href="https://hakeemsalaam.myportfolio.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-8 py-3 border-2 border-[#1C1C1E] text-[#1C1C1E] hover:bg-[#1C1C1E] hover:text-white font-['Inter'] rounded-md transition-colors"
          >
            View My Portfolio
          </a>
        </div>
      </section>
    </div>
  );
}
