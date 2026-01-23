import React from 'react';
import { Heart } from 'lucide-react';

export function Footer() {
    return (
        <footer className="bg-slate-950 text-slate-300 py-8 mt-auto">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                        <h3 className="text-lg font-bold text-white mb-4">India First Aid</h3>
                        <p className="text-sm text-slate-400">
                            Instant, localized first aid guides for Indian emergencies.
                            Designed to save lives in the Golden Hour.
                        </p>
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-white mb-4">Urgent Numbers</h3>
                        <ul className="space-y-2 text-sm">
                            <li><a href="tel:108" className="hover:text-red-400 font-bold">108 - Ambulance</a></li>
                            <li><a href="tel:112" className="hover:text-red-400">112 - General Emergency</a></li>
                            <li><a href="tel:100" className="hover:text-red-400">100 - Police</a></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-white mb-4">Disclaimer</h3>
                        <p className="text-xs text-slate-500 leading-relaxed">
                            Information provided is for educational purposes only and not a substitute for professional medical advice.
                            Always seek professional help immediately in emergencies.
                        </p>
                    </div>
                </div>
                <div className="border-t border-slate-800 mt-8 pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500">
                    <p>© {new Date().getFullYear()} IndiaFirstAid. Open Source.</p>
                    <p className="flex items-center mt-2 md:mt-0">
                        Made with <Heart className="h-3 w-3 text-red-500 mx-1 fill-current" /> in India
                    </p>
                </div>
            </div>
        </footer>
    );
}
