import React, { useState, useEffect, useRef, createContext, useContext } from 'react';
import {
  Sun,
  Moon,
  ChevronDown,
  Code,
  Smartphone,
  Layout,
  Briefcase,
  Users,
  Menu,
  X,
  Linkedin,
  Github,
  Mail,
  MessageSquare,
  Send,
} from 'lucide-react';
import lottie from 'lottie-web';
import { gunzipSync } from 'fflate'; // ➜ make sure: npm i lottie-web fflate

/* ---------------------------------------------------------------------------
  Helper utilities
----------------------------------------------------------------------------*/
const cn = (...classes) => classes.filter(Boolean).join(' ');

/* ---------------------------------------------------------------------------
  Dark‑mode Context
----------------------------------------------------------------------------*/
const ThemeContext = createContext();

const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');
  const toggleTheme = () => setTheme((t) => (t === 'light' ? 'dark' : 'light'));
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
  }, [theme]);
  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>;
};
const useTheme = () => useContext(ThemeContext);

/* ---------------------------------------------------------------------------
  ✅ TGS Player (loads .tgs directly, no pre‑conversion needed)
----------------------------------------------------------------------------*/
const TgsPlayer = ({ path, loop = true, autoplay = true, className = '' }) => {
  const container = useRef(null);
  useEffect(() => {
    if (!container.current) return;
    let anim;
    let cancelled = false;
    // 1. fetch the .tgs as ArrayBuffer
    fetch(path)
      .then((r) => r.arrayBuffer())
      .then((buf) => {
        if (cancelled) return;
        // 2. gunzip -> JSON string
        const jsonText = new TextDecoder().decode(gunzipSync(new Uint8Array(buf)));
        const animationData = JSON.parse(jsonText);
        // 3. start lottie
        anim = lottie.loadAnimation({
          container: container.current,
          renderer: 'svg',
          loop,
          autoplay,
          animationData,
        });
      })
      .catch((err) => console.error('Failed to load .tgs:', err));
    return () => {
      cancelled = true;
      if (anim) anim.destroy();
    };
  }, [path, loop, autoplay]);
  return <div ref={container} className={className} style={{ width: '100%', height: '100%', minHeight: 250 }} />;
};

/* ---------------------------------------------------------------------------
  Scroll animation wrapper
----------------------------------------------------------------------------*/
const AnimateOnScroll = ({ children, className, delay = 0 }) => {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (ref.current) observer.unobserve(ref.current);
        }
      },
      { threshold: 0.05 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      className={cn(
        'transition-all duration-1000 ease-out',
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12',
        className
      )}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

/* ---------------------------------------------------------------------------
  Header
----------------------------------------------------------------------------*/
const Header = () => {
  const { theme, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  const navLinks = [
    { name: 'සේවාවන්', href: '#services' },
    { name: 'ව්‍යාපෘති', href: '#projects' },
    { name: 'ප්‍රතිචාර', href: '#testimonials' },
    { name: 'මා ගැන', href: '#about' },
  ];
  return (
    <header
      className={cn(
        'sticky top-0 z-50 transition-all duration-300',
        isScrolled ? 'bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg shadow-lg' : 'bg-transparent'
      )}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <a
            href="#"
            className="flex items-center space-x-2 text-2xl font-bold text-blue-600 dark:text-blue-500 transition-transform duration-300 hover:scale-110"
          >
            RA
          </a>
          <nav className="hidden md:flex items-center space-x-2">
            {navLinks.map((l) => (
              <a
                key={l.name}
                href={l.href}
                className="px-4 py-2 rounded-full text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                {l.name}
              </a>
            ))}
          </nav>
          <div className="flex items-center space-x-3">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>
            <a
              href="#"
              className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              <Linkedin size={20} />
            </a>
            <a
              href="#"
              className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              <Github size={20} />
            </a>
            <a
              href="#contact"
              className="hidden sm:block bg-blue-600 text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-blue-700 transition-all transform hover:scale-105 shadow-md hover:shadow-lg"
            >
              Contact Me
            </a>
            {/* mobile menu toggle */}
            <div className="md:hidden">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 rounded-md text-gray-600 dark:text-gray-300">
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </div>
      {isMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 shadow-xl">
          <div className="px-2 pt-2 pb-4 space-y-1 sm:px-3">
            {navLinks.map((l) => (
              <a
                key={l.name}
                href={l.href}
                onClick={() => setIsMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                {l.name}
              </a>
            ))}
            <div className="pt-4 px-3">
              <a
                href="#contact"
                onClick={() => setIsMenuOpen(false)}
                className="block w-full text-center bg-blue-600 text-white px-4 py-2 rounded-full font-semibold hover:bg-blue-700 transition-all"
              >
                Contact Me
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

/* ---------------------------------------------------------------------------
  Hero Section (uses the new TgsPlayer)
----------------------------------------------------------------------------*/
const HeroSection = () => (
  <section className="relative overflow-hidden bg-white dark:bg-gray-900">
    <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-100 dark:from-gray-900 dark:to-blue-900/20 animate-gradient-xy" />
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="min-h-screen flex items-center">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16 items-center w-full">
          <AnimateOnScroll className="text-center md:text-left">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-800 dark:text-white leading-tight tracking-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">ඩිජිටල් ලෝකයේ නව්‍යකරණය</span>
              <br />
              Rukshan Amodya
            </h1>
            <p className="mt-6 text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-xl mx-auto md:mx-0">
              මෘදුකාංග ඉංජිනේරු සහ තාක්ෂණික උපදේශක
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <a
                href="#projects"
                className="bg-blue-600 text-white px-8 py-3.5 rounded-full font-bold hover:bg-blue-700 transition-all transform hover:scale-105 shadow-lg hover:shadow-blue-500/30"
              >
                මගේ ව්‍යාපෘති
              </a>
              <a
                href="#contact"
                className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white px-8 py-3.5 rounded-full font-bold hover:bg-gray-300 dark:hover:bg-gray-600 transition-all transform hover:scale-105"
              >
                මා අමතන්න
              </a>
            </div>
          </AnimateOnScroll>
          {/* Lottie / TGS visual */}
          <AnimateOnScroll className="w-full h-full" delay={200}>
            {/* Copy a .tgs file into public/stickers, eg party_parrot.tgs    /animations/AnimatedSticker.tgs*/}
            <TgsPlayer path="/animations/AnimatedSticker.tgs" className="w-full h-full" />
          </AnimateOnScroll>
        </div>
      </div>
    </div>
  </section>
);

/* ---------------------------------------------------------------------------
  Section Title helper
----------------------------------------------------------------------------*/
const SectionTitle = ({ children }) => (
  <AnimateOnScroll className="text-center mb-16">
    <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white">{children}</h2>
    <div className="mt-4 h-1.5 w-24 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full" />
  </AnimateOnScroll>
);

/* ---------------------------------------------------------------------------
  About Section (unchanged content)
----------------------------------------------------------------------------*/
const AboutSection = () => (
  <section id="about" className="py-20 lg:py-24 bg-white dark:bg-gray-900">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-8 md:gap-12 items-center">
        <AnimateOnScroll className="md:col-span-3">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-6">මා ගැන</h2>
          <div className="space-y-4 text-gray-600 dark:text-gray-400 leading-relaxed">
            <p>
              මම රුක්ෂාන් අමෝද්‍ය, ශ්‍රී ලංකාව පදනම් කරගත් මෘදුකාංග ඉංජිනේරුවෙක්. නවීන තාක්ෂණයන් වන React, Node.js, සහ Python භාවිතා කරමින්, පරිශීලක-හිතකාමී සහ ඉහළ ක්‍රියාකාරීත්වයකින් යුතු වෙබ් සහ ජංගම යෙදුම් නිර්මාණය කිරීම මගේ විශේෂත්වයයි.
            </p>
            <p>
              සෑම ව්‍යාපෘතියක්ම සාර්ථක කරගැනීම සඳහා පාරිභෝගිකයා සමග සමීපව කටයුතු කරමින්, ඔවුන්ගේ අදහස් යථාර්ථයක් බවට පත්කිරීමට මම කැපවී සිටිමි.
            </p>
          </div>
          <div className="mt-8 text-6xl text-gray-300 dark:text-gray-600">&ldquo;</div>
        </AnimateOnScroll>
        <AnimateOnScroll className="md:col-span-2" delay={200}>
          <div className="relative p-2 rounded-2xl bg-gradient-to-br from-blue-200 to-purple-300 dark:from-blue-800 dark:to-purple-900 shadow-2xl transform hover:scale-105 transition-transform duration-500">
            <img
              src="https://placehold.co/400x500/e2e8f0/334155?text=Rukshan+Amodya"
              alt="Rukshan Amodya"
              className="rounded-xl w-full"
            />
          </div>
        </AnimateOnScroll>
      </div>
    </div>
  </section>
);


// Services Section
const ServicesSection = () => {
    const services = [
        { icon: Code, title: 'Web Application Development', text: 'පරිශීලක අවශ්‍යතා සඳහා විශේෂිත වූ, ආරක්‍ෂිත සහ වේගවත් වෙබ් යෙදුම්.' },
        { icon: Smartphone, title: 'Mobile Application Development', text: 'iOS සහ Android යන දෙකටම ගැලපෙන Cross-Platform ජංගම යෙදුම්.' },
        { icon: Layout, title: 'UI/UX Design & Prototyping', text: 'භාවිතයට පහසු, ආකර්ෂණීය මෝස්තර සහ ක්‍රියාකාරී ආකෘති නිර්මාණය.' },
    ];
    return (
        <section id="services" className="py-20 lg:py-24 bg-gray-50 dark:bg-gray-900/50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <SectionTitle>මාගේ ප්‍රධාන සේවාවන්</SectionTitle>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                     {services.map((service, index) => (
                        <AnimateOnScroll key={index} delay={index * 150}>
                            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-transparent dark:border-gray-700/50 h-full text-center hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group">
                                <div className="inline-block p-5 bg-gradient-to-br from-blue-100 to-purple-200 dark:from-blue-800 dark:to-purple-900 rounded-full mb-6 group-hover:scale-110 transition-transform duration-300">
                                    <service.icon className="text-blue-600 dark:text-blue-400" size={32} />
                                </div>
                                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3">{service.title}</h3>
                                <p className="text-gray-600 dark:text-gray-400 text-sm">{service.text}</p>
                            </div>
                        </AnimateOnScroll>
                    ))}
                </div>
            </div>
        </section>
    );
};

// Projects Section
const ProjectsSection = () => {
    const projects = [
        { title: 'E-Commerce Platform', desc: 'සම්පූර්ණ E-Commerce වෙළඳසැලක් සඳහා වූ විසඳුම.', img: 'https://placehold.co/600x400/e2e8f0/334155?text=Project+1', tags: ['React', 'Node.js', 'MongoDB'] },
        { title: 'Booking System', desc: 'හමුවීම් සහ වෙන් කිරීම් කළමනාකරණය සඳහා පද්ධතියක්.', img: 'https://placehold.co/600x400/e2e8f0/334155?text=Project+2', tags: ['Vue.js', 'Firebase'] },
        { title: 'Learning Management System', desc: 'මාර්ගගත අධ්‍යාපනය සඳහා වූ සම්පූර්ණ මෘදුකාංගයක්.', img: 'https://placehold.co/600x400/e2e8f0/334155?text=Project+3', tags: ['Next.js', 'PostgreSQL'] },
    ];

    return (
        <section id="projects" className="py-20 lg:py-24 bg-white dark:bg-gray-900">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <SectionTitle>
                    <Briefcase className="inline-block mr-3 text-yellow-500" size={36} />
                    මගේ නිර්මාණ
                </SectionTitle>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {projects.map((project, index) => (
                        <AnimateOnScroll key={index} delay={index * 100}>
                            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl shadow-lg overflow-hidden group flex flex-col h-full">
                                <div className="overflow-hidden aspect-video">
                                    <img src={project.img} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>
                                </div>
                                <div className="p-6 flex flex-col flex-grow">
                                    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">{project.title}</h3>
                                    <p className="text-gray-600 dark:text-gray-400 flex-grow">{project.desc}</p>
                                    <div className="mt-4 flex flex-wrap gap-2">
                                        {project.tags.map(tag => (
                                            <span key={tag} className="text-xs font-semibold bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300 px-2.5 py-1 rounded-full">{tag}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </AnimateOnScroll>
                    ))}
                </div>
            </div>
        </section>
    );
};

// Testimonials Section
const TestimonialsSection = () => {
    const testimonials = [
        { name: 'Sadun Perera', company: 'Creative Minds Inc.', text: 'Rukshan delivered a high-quality product on time. His technical skills and communication are excellent. Highly recommended!' },
        { name: 'Nimali Silva', company: 'Startup Hub', text: 'Working with Rukshan was a great experience. He understood our vision perfectly and brought it to life with a fantastic mobile app.' },
        { name: 'Kasun Fernando', company: 'Tech Solutions', text: 'The web platform he built for us is fast, secure, and easy to use. Our user engagement has increased significantly.' },
    ];
    return (
        <section id="testimonials" className="py-20 lg:py-24 bg-gray-50 dark:bg-gray-900/50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <SectionTitle>පාරිභෝගික ප්‍රතිචාර</SectionTitle>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {testimonials.map((item, index) => (
                        <AnimateOnScroll key={index} delay={index * 100}>
                            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-transparent dark:border-gray-700/50 h-full flex flex-col">
                                <MessageSquare className="text-blue-500 dark:text-blue-400 mb-5" size={32} />
                                <p className="text-gray-600 dark:text-gray-400 mb-6 flex-grow">&ldquo;{item.text}&rdquo;</p>
                                <div>
                                    <p className="font-bold text-gray-800 dark:text-white">{item.name}</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{item.company}</p>
                                </div>
                            </div>
                        </AnimateOnScroll>
                    ))}
                </div>
            </div>
        </section>
    );
};


// Contact Section
const ContactSection = () => {
    const contacts = [
        { title: 'LinkedIn', handle: 'rukshan-amodya', icon: Linkedin, link: '#' },
        { title: 'GitHub', handle: 'rukshanamodya', icon: Github, link: '#' },
        { title: 'Email', handle: 'hello@rukshan.dev', icon: Mail, link: 'mailto:hello@rukshan.dev' },
    ];

    return (
        <section id="contact" className="py-20 lg:py-24 bg-white dark:bg-gray-900">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <SectionTitle>
                    <Send className="inline-block mr-3 text-blue-500" size={36} />
                    මා හා සම්බන්ධ වන්න
                </SectionTitle>
                <AnimateOnScroll className="max-w-xl mx-auto text-center">
                     <p className="mb-12 text-gray-600 dark:text-gray-400">ඔබගේ ව්‍යාපෘතිය ගැන කතා කිරීමට හෝ මා ගැන වැඩි විස්තර දැනගැනීමට, පහත ක්‍රම ඔස්සේ මා හා සම්බන්ධ වන්න.</p>
                </AnimateOnScroll>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
                    {contacts.map((contact, index) => (
                        <AnimateOnScroll key={index} delay={index * 100}>
                            <a href={contact.link} target="_blank" rel="noopener noreferrer" className="block bg-gray-50 dark:bg-gray-800/50 p-6 rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-2 transition-all duration-300 border border-gray-200 dark:border-gray-700">
                                <div className="flex flex-col items-center text-center">
                                    <div className="p-4 bg-gradient-to-br from-blue-100 to-purple-200 dark:from-blue-800 dark:to-purple-900 rounded-full mb-4">
                                        <contact.icon className="text-blue-600 dark:text-blue-400" size={28} />
                                    </div>
                                    <h3 className="font-bold text-lg text-gray-800 dark:text-white">{contact.title}</h3>
                                    <p className="text-sm text-blue-500 dark:text-blue-400">{contact.handle}</p>
                                </div>
                            </a>
                        </AnimateOnScroll>
                    ))}
                </div>
            </div>
        </section>
    );
};

// FAQ Section
const FaqItem = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="border-b border-gray-200 dark:border-gray-700 last:border-b-0">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center py-5 text-left text-gray-800 dark:text-white gap-4"
            >
                <span className="font-semibold text-lg">{question}</span>
                <ChevronDown className={cn("transform transition-transform duration-300 flex-shrink-0", isOpen ? "rotate-180" : "")} />
            </button>
            <div
                className={cn(
                    "grid grid-rows-[0fr] transition-all duration-500",
                     isOpen ? "grid-rows-[1fr]" : ""
                )}
            >
                <div className="overflow-hidden">
                    <p className="pb-5 text-gray-600 dark:text-gray-400 pr-8">{answer}</p>
                </div>
            </div>
        </div>
    );
};

const FAQSection = () => {
    const faqs = [
        { question: 'ඔබ භාවිතා කරන ප්‍රධාන තාක්ෂණයන් මොනවාද?', answer: 'මම ප්‍රධාන වශයෙන් React/Next.js, Node.js, Python (Django/FastAPI), සහ Flutter භාවිතා කරමි. ව්‍යාපෘතියේ අවශ්‍යතාවය අනුව සුදුසුම තාක්ෂණය තෝරාගැනීමට මම කටයුතු කරමි.' },
        { question: 'ව්‍යාපෘතියක් සඳහා මිල ගණන් තීරණය කරන්නේ කෙසේද?', answer: 'මිල ගණන් තීරණය වන්නේ ව්‍යාපෘතියේ සංකීර්ණත්වය, අවශ්‍ය වන කාලය, සහ විශේෂාංග මතයි. ඔබගේ අවශ්‍යතා සාකච්ඡා කිරීමෙන් පසු නිශ්චිත මිලක් ලබා දිය හැක.' },
        { question: 'ව්‍යාපෘතියක් අවසන් වූ පසු සහාය ලබා දෙනවාද?', answer: 'ඔව්, ව්‍යාපෘතිය අවසන් වූ පසු නඩත්තු සහ යාවත්කාලීන කිරීම් සඳහා එකඟතාවය මත පදනම්ව සේවා සපයනු ලැබේ.' },
    ];
    return (
        <section id="faq" className="py-20 lg:py-24 bg-gray-50 dark:bg-gray-900/50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
                <SectionTitle>නිතර අසන ප්‍රශ්න</SectionTitle>
                <AnimateOnScroll className="bg-white dark:bg-gray-800 p-4 sm:p-8 rounded-2xl shadow-xl">
                    {faqs.map((faq, index) => (
                        <FaqItem key={index} question={faq.question} answer={faq.answer} />
                    ))}
                </AnimateOnScroll>
            </div>
        </section>
    );
};

// Footer Component
const Footer = () => (
    <footer className="bg-gray-800 dark:bg-gray-900 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
                <div className="md:col-span-2 lg:col-span-1">
                    <h3 className="text-2xl font-bold mb-4">Rukshan Amodya</h3>
                    <p className="text-gray-400 text-sm">නවීන තාක්ෂණයෙන් ඔබගේ අදහස් යථාර්ථයක් බවට පත්කිරීම.</p>
                </div>
                <div>
                    <h4 className="font-semibold text-lg mb-4">Quick Links</h4>
                    <ul className="space-y-3">
                        <li><a href="#services" className="text-gray-400 hover:text-white transition-colors">සේවාවන්</a></li>
                        <li><a href="#projects" className="text-gray-400 hover:text-white transition-colors">ව්‍යාපෘති</a></li>
                        <li><a href="#about" className="text-gray-400 hover:text-white transition-colors">මා ගැන</a></li>
                        <li><a href="#faq" className="text-gray-400 hover:text-white transition-colors">FAQ</a></li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-semibold text-lg mb-4">Contact</h4>
                    <ul className="space-y-3 text-gray-400 text-sm">
                        <li className="flex items-center gap-2"><Mail size={16}/> hello@rukshan.dev</li>
                        <li className="flex items-center gap-2"><Users size={16}/> Panadura, Sri Lanka</li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-semibold text-lg mb-4">Follow Me</h4>
                    <div className="flex space-x-4">
                        <a href="#" target="_blank" rel="noopener noreferrer" className="p-2 bg-gray-700 rounded-full hover:bg-blue-600 transition-colors"><Linkedin size={20} /></a>
                        <a href="#" target="_blank" rel="noopener noreferrer" className="p-2 bg-gray-700 rounded-full hover:bg-blue-600 transition-colors"><Github size={20} /></a>
                    </div>
                </div>
            </div>
            <div className="mt-12 pt-8 border-t border-gray-700 text-center text-gray-500 text-sm">
                <p>&copy; {new Date().getFullYear()} Rukshan Amodya. All Rights Reserved. Designed & Developed with ❤️.</p>
            </div>
        </div>
    </footer>
);


// Main App Component
export default function App() {
    // Inject custom fonts for better Sinhala rendering on all devices
    useEffect(() => {
        const style = document.createElement('style');
        style.id = 'font-styles';
        style.innerHTML = `
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Noto+Sans+Sinhala:wght@400;700;900&display=swap');
            
            body {
                font-family: 'Inter', 'Sinhala Sangam MN', 'Noto Sans Sinhala', 'Iskoola Pota', sans-serif;
            }
        `;
        if(!document.getElementById('font-styles')){
            document.head.appendChild(style);
        }

        return () => {
            const styleElement = document.getElementById('font-styles');
            if (styleElement) {
                document.head.removeChild(styleElement);
            }
        };
    }, []);

    return (
        <ThemeProvider>
            <div className="bg-white dark:bg-gray-900 transition-colors duration-300">
                <Header />
                <main>
                    <HeroSection />
                    <AboutSection />
                    <ServicesSection />
                    <ProjectsSection />
                    <TestimonialsSection />
                    <ContactSection />
                    <FAQSection />
                </main>
                <Footer />
            </div>
        </ThemeProvider>
    );
}
