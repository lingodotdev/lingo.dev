import React from 'react';
import { Link } from 'react-router-dom';
import { HeartPulse, Search, Menu, Phone } from 'lucide-react';
import { Button } from '../ui/button';
import { LanguageSwitcher } from '../LanguageSwitcher';

export function Navbar() {
    return (
        <nav className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                {/* Logo */}
                <Link to="/" className="flex items-center space-x-2">
                    <div className="bg-red-600 p-1.5 rounded-lg shadow-sm">
                        <HeartPulse className="h-6 w-6 text-white" />
                    </div>
                    <span className="text-xl font-bold text-slate-900 hidden sm:inline-block">India<span className="text-red-600">FirstAid</span></span>
                </Link>

                {/* Desktop Actions */}
                <div className="hidden md:flex items-center space-x-4">
                    <LanguageSwitcher />
                    <Link to="/search">
                        <Button variant="ghost" size="sm" className="text-slate-500 hover:text-slate-900">
                            <Search className="h-4 w-4 mr-2" />
                            Search Emergencies...
                        </Button>
                    </Link>
                    <a href="tel:108">
                        <Button variant="destructive" size="sm" className="shadow-red-200 font-bold animate-pulse">
                            <Phone className="h-4 w-4 mr-2" />
                            Call 108
                        </Button>
                    </a>
                </div>

                {/* Mobile Actions */}
                <div className="flex md:hidden items-center space-x-2">
                    <LanguageSwitcher />
                    <a href="tel:108">
                        <Button variant="destructive" size="icon" className="h-9 w-9">
                            <Phone className="h-4 w-4" />
                        </Button>
                    </a>
                    <Link to="/search">
                        <Button variant="ghost" size="icon" className="h-9 w-9">
                            <Search className="h-5 w-5" />
                        </Button>
                    </Link>
                </div>
            </div>
        </nav>
    );
}
