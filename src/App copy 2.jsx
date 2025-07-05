import React, { useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Sun, Moon, Github, Linkedin, Twitter, Mail, ArrowUp, Menu, X, Download, Briefcase, Code, Cpu, Database, Cloud, GitBranch, Link, ExternalLink, Award, CheckCircle } from 'lucide-react';

// --- Main App Component ---
export default function App() {
    const [theme, setTheme] = useState('dark');
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            document.documentElement.classList.add('dark');
            setTheme('dark');
        } else {
            document.documentElement.classList.remove('dark');
            setTheme('light');
        }
    }, []);

    const toggleTheme = () => {
        if (theme === 'light') {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
            setTheme('dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
            setTheme('light');
        }
    };
    
    const navLinks = [
        { name: 'About', href: '#about' },
        { name: 'Projects', href: '#projects' },
        { name: 'Skills', href: '#skills' },
        { name: 'Experience', href: '#experience' },
        { name: 'Certifications', href: '#certifications' },
        { name: 'Contact', href: '#contact' },
    ];

    return (
        <div className="bg-slate-50 dark:bg-gray-900 text-slate-800 dark:text-slate-200 font-sans transition-colors duration-300">
            {/* --- Header --- */}
            <Header navLinks={navLinks} theme={theme} toggleTheme={toggleTheme} isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
            
            <main>
                <HeroSection />
                <AboutSection />
                <ProjectsSection />
                <SkillsSection />
                <ExperienceSection />
                <CertificationsSection />
                <ContactSection />
            </main>

            <Footer />
            <ScrollToTopButton />
        </div>
    );
}

// --- UI Components ---

const Header = ({ navLinks, theme, toggleTheme, isMenuOpen, setIsMenuOpen }) => {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg shadow-md' : 'bg-transparent'}`}>
            <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                <a href="#home" className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                    R<span className="text-blue-600">.</span>
                </a>
                <nav className="hidden md:flex items-center space-x-8">
                    {navLinks.map(link => (
                        <a key={link.name} href={link.href} className="text-lg font-medium text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-500 transition-colors">
                            {link.name}
                        </a>
                    ))}
                </nav>
                <div className="flex items-center space-x-4">
                    <motion.button
                        onClick={toggleTheme}
                        className="p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-gray-700 transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        {theme === 'dark' ? <Sun size={24} /> : <Moon size={24} />}
                    </motion.button>
                    <div className="md:hidden">
                        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 text-slate-600 dark:text-slate-300">
                            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
                        </button>
                    </div>
                </div>
            </div>
            {/* Mobile Menu */}
            {isMenuOpen && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="md:hidden bg-white dark:bg-gray-800 shadow-lg"
                >
                    {navLinks.map(link => (
                        <a 
                            key={link.name} 
                            href={link.href} 
                            className="block text-center py-4 px-6 text-lg hover:bg-slate-100 dark:hover:bg-gray-700 transition-colors"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            {link.name}
                        </a>
                    ))}
                </motion.div>
            )}
        </header>
    );
};

const AnimatedSection = ({ children, id }) => {
    const controls = useAnimation();
    const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true });

    useEffect(() => {
        if (inView) {
            controls.start('visible');
        }
    }, [controls, inView]);

    return (
        <motion.section
            id={id}
            ref={ref}
            initial="hidden"
            animate={controls}
            variants={{
                visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
                hidden: { opacity: 0, y: 50 },
            }}
            className="py-24 lg:py-32"
        >
            {children}
        </motion.section>
    );
};

const SectionTitle = ({ children }) => (
    <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white">{children}</h2>
        <div className="mt-4 h-1.5 w-24 bg-blue-600 mx-auto rounded-full"></div>
    </div>
);

// --- Page Sections ---

const HeroSection = () => {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.2, delayChildren: 0.3 },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    };

    return (
        <section id="home" className="h-screen flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-grid-slate-200/[0.2] dark:bg-grid-gray-700/[0.2] [mask-image:linear-gradient(to_bottom,white_0%,transparent_100%)]"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-teal-500/10"></div>
            
            <motion.div
                className="text-center z-10 p-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <motion.h1 
                    className="text-5xl md:text-7xl font-extrabold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300"
                    variants={itemVariants}
                >
                    Hi, I'm Rukshan Amodya
                </motion.h1>
                <motion.p 
                    className="text-xl md:text-2xl font-medium text-slate-600 dark:text-slate-300 mb-8 max-w-3xl mx-auto"
                    variants={itemVariants}
                >
                    Software Engineer | AI Enthusiast | Tech Entrepreneur
                </motion.p>
                 <motion.p 
                    className="text-lg md:text-xl text-slate-500 dark:text-slate-400 mb-10 max-w-2xl mx-auto"
                    variants={itemVariants}
                >
                    I build scalable, intelligent, and impactful software solutions.
                </motion.p>
                <motion.div 
                    className="flex flex-col sm:flex-row justify-center items-center gap-4"
                    variants={itemVariants}
                >
                    <motion.a href="#projects" className="w-full sm:w-auto px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-700 transition-all" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        Explore My Work
                    </motion.a>
                    <motion.a href="#" className="w-full sm:w-auto px-8 py-3 bg-white dark:bg-gray-800 text-slate-700 dark:text-slate-200 font-semibold rounded-lg shadow-lg hover:bg-slate-100 dark:hover:bg-gray-700 transition-all flex items-center justify-center gap-2" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Download size={20} /> Download CV
                    </motion.a>
                </motion.div>
            </motion.div>
        </section>
    );
};

const AboutSection = () => (
    <AnimatedSection id="about">
        <div className="container mx-auto px-6">
            <SectionTitle>About Me</SectionTitle>
            <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
                <motion.div 
                    className="lg:w-1/3"
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="relative">
                        <div className="absolute -inset-1.5 bg-gradient-to-r from-blue-600 to-teal-500 rounded-full blur opacity-50"></div>
                        <img src="/assets/rukshan-face2.png" alt="Rukshan Amodya" className="relative rounded-full shadow-2xl mx-auto border-4 border-slate-200 dark:border-gray-800 w-64 h-64 md:w-80 md:h-80 object-cover"/>
                    </div>
                </motion.div>
                <div className="lg:w-2/3 text-lg text-slate-600 dark:text-slate-300 space-y-6">
                    <p>
                        Rukshan Amodya is a technology entrepreneur and senior software engineer passionate about building scalable, intelligent digital systems. As the Founder of <strong className="font-semibold text-blue-600 dark:text-blue-500">Coding Divers</strong> and Co-Founder of <strong className="font-semibold text-blue-600 dark:text-blue-500">Gravix</strong>, he leads ventures focused on transforming businesses through smart technology and automation.
                    </p>
                    <p>
                        Currently a Senior Software Engineer at PIRM Holdings (PVT) Ltd, Rukshan specializes in AI integration, backend development, and cloud infrastructure. With deep expertise in domain systems, full-stack development, and digital architecture, his mission is to make powerful technology usable, reliable, and impactful for everyone.
                    </p>
                </div>
            </div>
        </div>
    </AnimatedSection>
);

const ProjectsSection = () => {
    const projects = [
        {
            title: "AI-Powered Analytics Dashboard",
            description: "A smart dashboard that uses AI to provide deep business insights and predictive analytics.",
            tags: ["React", "Node.js", "Python", "OpenAI"],
            image: "https://placehold.co/600x400/3b82f6/ffffff?text=Project+One",
            liveUrl: "#",
            githubUrl: "#",
        },
        {
            title: "E-commerce Automation Platform",
            description: "A scalable platform for e-commerce businesses to automate inventory and order management.",
            tags: ["Laravel", "PHP", "MySQL", "AWS"],
            image: "https://placehold.co/600x400/14b8a6/ffffff?text=Project+Two",
            liveUrl: "#",
            githubUrl: "#",
        },
        {
            title: "Cloud DevOps Pipeline",
            description: "A CI/CD pipeline for deploying microservices with zero downtime on cloud infrastructure.",
            tags: ["Docker", "Git", "CI/CD", "Firebase"],
            image: "https://placehold.co/600x400/6d28d9/ffffff?text=Project+Three",
            liveUrl: null,
            githubUrl: "#",
        },
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    };

    return (
        <AnimatedSection id="projects">
            <div className="container mx-auto px-6">
                <SectionTitle>Featured Projects</SectionTitle>
                <motion.div 
                    className="grid md:grid-cols-2 lg:grid-cols-3 gap-10"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                >
                    {projects.map((project, index) => (
                        <motion.div 
                            key={index}
                            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden group"
                            variants={itemVariants}
                            whileHover={{ y: -8, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="overflow-hidden">
                               <img src={project.image} alt={project.title} className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300" />
                            </div>
                            <div className="p-6">
                                <h3 className="text-2xl font-bold mb-2 text-slate-900 dark:text-white">{project.title}</h3>
                                <p className="text-slate-600 dark:text-slate-400 mb-4">{project.description}</p>
                                <div className="flex flex-wrap gap-2 mb-6">
                                    {project.tags.map(tag => (
                                        <span key={tag} className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full dark:bg-blue-900/50 dark:text-blue-300">{tag}</span>
                                    ))}
                                </div>
                                <div className="flex items-center gap-4">
                                    {project.liveUrl && <a href={project.liveUrl} className="flex items-center gap-2 text-blue-600 font-semibold hover:underline">
                                        <ExternalLink size={18} /> Live Demo
                                    </a>}
                                    <a href={project.githubUrl} className="flex items-center gap-2 text-blue-600 font-semibold hover:underline">
                                        <Github size={18} /> GitHub
                                    </a>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </AnimatedSection>
    );
};

const SkillsSection = () => {
    const skills = [
        { name: 'JavaScript', icon: <Code size={40} className="text-yellow-500" /> },
        { name: 'Python', icon: <Code size={40} className="text-blue-500" /> },
        { name: 'PHP', icon: <Code size={40} className="text-indigo-400" /> },
        { name: 'TypeScript', icon: <Code size={40} className="text-blue-400" /> },
        { name: 'React', icon: <Cpu size={40} className="text-cyan-400" /> },
        { name: 'Node.js', icon: <Cpu size={40} className="text-green-500" /> },
        { name: 'Laravel', icon: <Cpu size={40} className="text-red-500" /> },
        { name: 'AWS', icon: <Cloud size={40} className="text-orange-500" /> },
        { name: 'Firebase', icon: <Cloud size={40} className="text-yellow-400" /> },
        { name: 'Docker', icon: <Briefcase size={40} className="text-blue-600" /> },
        { name: 'Git', icon: <GitBranch size={40} className="text-slate-600 dark:text-slate-400" /> },
        { name: 'MySQL', icon: <Database size={40} className="text-blue-700" /> },
        { name: 'MongoDB', icon: <Database size={40} className="text-green-600" /> },
        { name: 'PostgreSQL', icon: <Database size={40} className="text-indigo-500" /> },
        { name: 'OpenAI API', icon: <Cpu size={40} className="text-teal-500" /> },
        { name: 'LangChain', icon: <Link size={40} className="text-purple-500" /> },
    ];
    
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
    };

    const itemVariants = {
        hidden: { opacity: 0, scale: 0.5 },
        visible: { opacity: 1, scale: 1 },
    };

    return (
        <AnimatedSection id="skills">
            <div className="container mx-auto px-6">
                <SectionTitle>Tech Stack & Skills</SectionTitle>
                <motion.div 
                    className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-8 gap-8 text-center"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                >
                    {skills.map(skill => (
                        <motion.div 
                            key={skill.name} 
                            className="flex flex-col items-center gap-3 p-4 rounded-lg"
                            variants={itemVariants}
                            whileHover={{ scale: 1.1, y: -5, backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
                            transition={{ duration: 0.2 }}
                        >
                            {skill.icon}
                            <span className="font-semibold text-sm">{skill.name}</span>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </AnimatedSection>
    );
};

const ExperienceSection = () => {
    const experiences = [
        {
            role: "Founder & CEO",
            company: "Coding Divers",
            date: "Present",
            description: "Leading a tech venture to build innovative software solutions and drive digital transformation for businesses.",
        },
        {
            role: "Co-Founder",
            company: "Gravix",
            date: "Present",
            description: "Co-founding a startup focused on smart automation and intelligent systems to enhance business productivity.",
        },
        {
            role: "Senior Software Engineer",
            company: "PIRM Holdings (PVT) Ltd",
            date: "Current Role",
            description: "Developing and maintaining backend systems, integrating AI models, and managing cloud infrastructure for enterprise-level applications.",
        },
    ];

    return (
        <AnimatedSection id="experience">
            <div className="container mx-auto px-6">
                <SectionTitle>Career Timeline</SectionTitle>
                <div className="relative max-w-3xl mx-auto">
                    <div className="absolute left-3 md:left-1/2 -ml-px w-0.5 h-full bg-slate-300 dark:bg-gray-700"></div>
                    {experiences.map((exp, index) => (
                        <motion.div 
                            key={index}
                            className="relative mb-12"
                            initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, amount: 0.5 }}
                            transition={{ duration: 0.5 }}
                        >
                            <div className="absolute left-3 md:left-1/2 -ml-4 w-8 h-8 bg-blue-600 rounded-full border-4 border-slate-50 dark:border-gray-900 flex items-center justify-center">
                                <Briefcase size={16} className="text-white"/>
                            </div>
                            <div className={`ml-12 md:ml-0 md:w-1/2 ${index % 2 === 0 ? 'md:pr-8 md:text-right' : 'md:pl-8 md:ml-auto'}`}>
                                <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
                                    <p className="text-sm font-semibold text-blue-600 dark:text-blue-500">{exp.date}</p>
                                    <h3 className="text-xl font-bold mt-1 text-slate-900 dark:text-white">{exp.role}</h3>
                                    <p className="text-md text-slate-500 dark:text-slate-400">{exp.company}</p>
                                    <p className="text-sm mt-2 text-slate-600 dark:text-slate-300">{exp.description}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </AnimatedSection>
    );
};

const CertificationsSection = () => {
    const certifications = [
        {
            title: "Getting Started with Cloud Ops",
            issuer: "AWS Educate",
            date: "Issued Jun 2024",
            verificationUrl: "https://www.credly.com/earner/earned/badge/d0624cdf-10ac-4cd6-a03f-eb9a200840e5",
            image: "/assets/aws-educate-getting-started-with-cloud-ops.png",
            skills: ["CloudFormation", "EC2", "IAM", "VPC", "DevOps"],
            bgColor: "from-orange-500/20 to-orange-500/5",
        },
        {
            title: "Getting Started with Compute",
            issuer: "AWS Educate",
            date: "Issued May 2024",
            verificationUrl: "https://www.credly.com/earner/earned/badge/f57acddc-646b-48c0-b3da-06bf8dd9fb36",
            image: "/assets/aws-educate-getting-started-with-compute.png",
            skills: ["EC2", "Lambda", "Elastic Beanstalk", "Containers"],
            bgColor: "from-blue-500/20 to-blue-500/5",
        },
        {
            title: "Getting Started with Databases",
            issuer: "AWS Educate",
            date: "Issued May 2024",
            verificationUrl: "https://www.credly.com/earner/earned/badge/f913010b-84f8-42f7-a898-959e8026de62",
            image: "/assets/aws-educate-getting-started-with-databases.png",
            skills: ["RDS", "DynamoDB", "Aurora", "Database Migration"],
            bgColor: "from-green-500/20 to-green-500/5",
        },
        {
            title: "Getting Started with Networking",
            issuer: "AWS Educate",
            date: "Issued Apr 2024",
            verificationUrl: "https://www.credly.com/earner/earned/badge/a39666da-567f-4cce-9828-19bfe4ff8062",
            image: "/assets/aws-educate-getting-started-with-networking.png",
            skills: ["VPC", "Route 53", "Direct Connect", "Load Balancing"],
            bgColor: "from-purple-500/20 to-purple-500/5",
        },
    ];

    const CertificationCard = ({ cert, index }) => (
        <motion.div
            className="bg-white dark:bg-gray-800/80 rounded-2xl shadow-lg overflow-hidden group relative"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
        >
            <div className={`absolute inset-0 bg-gradient-to-br ${cert.bgColor} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
            <div className="p-6 md:p-8 grid md:grid-cols-3 gap-6 items-center relative">
                <motion.div 
                    className="md:col-span-1 flex justify-center"
                    whileHover={{ scale: 1.05, rotate: 3 }}
                >
                    <img 
                        src={cert.image} 
                        alt={`${cert.title} badge`} 
                        className="w-36 h-36 rounded-full object-cover shadow-md border-4 border-slate-200 dark:border-gray-700"
                        onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/200x200/ef4444/ffffff?text=Error'; }}
                    />
                </motion.div>
                <div className="md:col-span-2">
                    <p className="text-sm font-semibold text-blue-600 dark:text-blue-400 mb-1">{cert.issuer}</p>
                    <h3 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white mb-3">{cert.title}</h3>
                    
                    <div className="mb-4">
                        <h4 className="font-semibold text-sm text-slate-600 dark:text-slate-300 mb-2">Skills Covered:</h4>
                        <div className="flex flex-wrap gap-2">
                            {cert.skills.map(skill => (
                                <span key={skill} className="bg-slate-200 dark:bg-gray-700 text-slate-700 dark:text-slate-300 text-xs font-medium px-2.5 py-1 rounded-full">{skill}</span>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                        <span>{cert.date}</span>
                        <a
                            href={cert.verificationUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 font-semibold text-blue-600 dark:text-blue-500 hover:underline"
                        >
                            <CheckCircle size={14} />
                            Verify
                        </a>
                    </div>
                </div>
            </div>
        </motion.div>
    );

    return (
        <AnimatedSection id="certifications">
            <div className="container mx-auto px-6">
                <SectionTitle>Professional Certifications</SectionTitle>
                <div className="grid lg:grid-cols-2 gap-8">
                    {certifications.map((cert, index) => (
                        <CertificationCard key={index} cert={cert} index={index} />
                    ))}
                </div>
            </div>
        </AnimatedSection>
    );
};


const ContactSection = () => {
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 5000);
        e.target.reset();
    };

    return (
        <AnimatedSection id="contact">
            <div className="container mx-auto px-6">
                <SectionTitle>Get In Touch</SectionTitle>
                <div className="max-w-2xl mx-auto">
                    <motion.form 
                        onSubmit={handleSubmit}
                        className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-2xl"
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.5 }}
                        transition={{ duration: 0.5 }}
                    >
                        {submitted && (
                               <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6" role="alert">
                                 <p className="font-bold">Thank you!</p>
                                 <p>Your message has been sent successfully.</p>
                               </div>
                        )}
                        <div className="mb-6">
                            <label htmlFor="name" className="block text-sm font-bold mb-2 text-slate-600 dark:text-slate-300">Name</label>
                            <input type="text" id="name" name="name" required className="w-full px-4 py-3 rounded-lg bg-slate-100 dark:bg-gray-700 border-2 border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 transition"/>
                        </div>
                        <div className="mb-6">
                            <label htmlFor="email" className="block text-sm font-bold mb-2 text-slate-600 dark:text-slate-300">Email</label>
                            <input type="email" id="email" name="email" required className="w-full px-4 py-3 rounded-lg bg-slate-100 dark:bg-gray-700 border-2 border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 transition"/>
                        </div>
                        <div className="mb-8">
                            <label htmlFor="message" className="block text-sm font-bold mb-2 text-slate-600 dark:text-slate-300">Message</label>
                            <textarea id="message" name="message" rows="5" required className="w-full px-4 py-3 rounded-lg bg-slate-100 dark:bg-gray-700 border-2 border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 transition"></textarea>
                        </div>
                        <div className="text-center">
                            <motion.button 
                                type="submit" 
                                className="w-full px-8 py-4 bg-blue-600 text-white font-bold text-lg rounded-lg shadow-lg hover:bg-blue-700 transition-all"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Send Message
                            </motion.button>
                        </div>
                    </motion.form>
                    <div className="text-center mt-12">
                        <p className="text-slate-600 dark:text-slate-400 mb-4">Or reach out directly:</p>
                        <a href="mailto:contact@rukshanamodya.com" className="text-blue-600 dark:text-blue-500 font-semibold text-lg hover:underline flex items-center justify-center gap-2">
                            <Mail size={20} /> contact@rukshanamodya.com
                        </a>
                    </div>
                </div>
            </div>
        </AnimatedSection>
    );
};

const Footer = () => {
    const socialLinks = [
        { name: 'GitHub', icon: <Github />, url: '#' },
        { name: 'LinkedIn', icon: <Linkedin />, url: '#' },
        { name: 'Twitter', icon: <Twitter />, url: '#' },
    ];
    return (
        <footer className="bg-slate-100 dark:bg-gray-800 py-10">
            <div className="container mx-auto px-6 text-center text-slate-600 dark:text-slate-400">
                <div className="flex justify-center space-x-6 mb-6">
                    {socialLinks.map(link => (
                        <motion.a 
                            key={link.name} 
                            href={link.url} 
                            aria-label={link.name} 
                            className="hover:text-blue-600 dark:hover:text-blue-500 transition-colors"
                            whileHover={{ scale: 1.2, y: -3 }}
                        >
                            {link.icon}
                        </motion.a>
                    ))}
                </div>
                <p>&copy; {new Date().getFullYear()} Rukshan Amodya. All Rights Reserved.</p>
            </div>
        </footer>
    );
};

const ScrollToTopButton = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const toggleVisibility = () => {
            if (window.pageYOffset > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };
        window.addEventListener('scroll', toggleVisibility);
        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <>
            {isVisible && (
                <motion.button
                    onClick={scrollToTop}
                    className="fixed bottom-6 right-6 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-all focus:outline-none"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                >
                    <ArrowUp size={24} />
                </motion.button>
            )}
        </>
    );
};
