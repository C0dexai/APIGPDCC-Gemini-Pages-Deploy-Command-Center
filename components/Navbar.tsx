
import React, { useEffect } from 'react';
import { SectionId } from '../types';

interface NavbarProps {
    sections: Record<SectionId, React.RefObject<HTMLElement>>;
    activeSection: SectionId;
    setActiveSection: (id: SectionId) => void;
}

const NAV_ITEMS: { id: SectionId; label: string }[] = [
    { id: 'header', label: 'Home' },
    { id: 'components', label: 'Components' },
    { id: 'lifecycle', label: 'Lifecycle' },
    { id: 'guidance', label: 'Guidance' },
    { id: 'workflow', label: 'Workflow' },
];

const Navbar: React.FC<NavbarProps> = ({ sections, activeSection, setActiveSection }) => {
    const scrollToSection = (sectionId: SectionId) => {
        sections[sectionId].current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY + 100;
            let currentSectionId: SectionId = 'header';

            for (const id of Object.keys(sections) as SectionId[]) {
                const section = sections[id].current;
                if (section && section.offsetTop <= scrollPosition) {
                    currentSectionId = id;
                }
            }
            
            if (activeSection !== currentSectionId) {
                setActiveSection(currentSectionId);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [sections, activeSection, setActiveSection]);


    return (
        <nav className="sticky top-0 bg-white/80 backdrop-blur-sm shadow-sm z-50">
            <div className="container mx-auto px-4">
                <div className="flex justify-center items-center py-3 space-x-2 md:space-x-4">
                    {NAV_ITEMS.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => scrollToSection(item.id)}
                            className={`nav-button transition-all duration-200 ease-in-out text-sm md:text-base font-semibold px-3 py-2 rounded-md ${
                                activeSection === item.id ? 'bg-gray-800 text-white' : 'text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            {item.label}
                        </button>
                    ))}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
