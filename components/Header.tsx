
import React, { forwardRef } from 'react';

const Header = forwardRef<HTMLElement>((props, ref) => (
    <header id="header" ref={ref} className="text-center py-16 md:py-24">
        <h1 className="text-4xl md:text-6xl font-black text-[#2D3748] uppercase tracking-wider">Cognitive Unified Architecture</h1>
        <p className="text-lg md:text-xl text-gray-600 mt-4 max-w-3xl mx-auto">An interactive guide to the CUA Engine, a powerful framework for seamless human-AI collaboration and workflow automation.</p>
    </header>
));

export default Header;
