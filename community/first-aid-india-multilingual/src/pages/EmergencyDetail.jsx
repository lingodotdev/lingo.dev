import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { Share2, AlertTriangle, PhoneCall, Printer } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Stepper } from '../components/features/Stepper';
import { Timer } from '../components/features/Timer';
import emergenciesData from '../data/emergencies.json';

export default function EmergencyDetail() {
    const { slug } = useParams();
    const emergency = emergenciesData[slug];

    if (!emergency) {
        return <Navigate to="/search" replace />;
    }

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: `First Aid for ${emergency.title}`,
                text: `Quick steps for ${emergency.title} - India First Aid`,
                url: window.location.href,
            }).catch(console.error);
        } else {
            // Fallback for desktop: Copy to clipboard or WhatsApp link
            window.open(`https://wa.me/?text=First Aid for ${emergency.title}: ${window.location.href}`, '_blank');
        }
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="container px-4 mx-auto py-8 max-w-4xl">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-8">
                <div>
                    <div className="flex items-center space-x-2 mb-2">
                        <Badge variant={emergency.severity === 'critical' ? 'destructive' : 'default'} className="uppercase">
                            {emergency.severity} Priority
                        </Badge>
                        <span className="text-slate-400 text-sm">|</span>
                        <span className="text-slate-500 text-sm font-medium">India Specific Guide</span>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-2">{emergency.title}</h1>
                    <p className="text-slate-600 max-w-2xl">{emergency.overview}</p>
                </div>
                <div className="flex space-x-2 shrink-0">
                    <Button variant="outline" size="icon" onClick={handleShare}>
                        <Share2 className="h-5 w-5" />
                    </Button>
                    <Button variant="outline" size="icon" className="hidden md:flex" onClick={handlePrint}>
                        <Printer className="h-5 w-5" />
                    </Button>
                    <a href="tel:108">
                        <Button variant="destructive">
                            <PhoneCall className="h-4 w-4 mr-2" />
                            Call 108
                        </Button>
                    </a>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Steps */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100">
                        <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center">
                            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white text-sm mr-3">1</span>
                            Immediate Actions
                        </h2>
                        <Stepper steps={emergency.steps} />
                    </div>

                    {emergency.indiaNotes && (
                        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
                            <h3 className="font-bold text-blue-900 mb-1 flex items-center">
                                <AlertTriangle className="h-4 w-4 mr-2" />
                                India-Specific Note
                            </h3>
                            <p className="text-blue-800 text-sm">{emergency.indiaNotes}</p>
                        </div>
                    )}
                </div>

                {/* Sidebar / Tools */}
                <div className="space-y-6">
                    {emergency.timer && (
                        <Timer duration={emergency.timer} label={emergency.timerLabel} />
                    )}

                    {emergency.donts && (
                        <div className="bg-red-50 border border-red-100 rounded-xl p-6">
                            <h3 className="font-bold text-red-900 mb-4">CRITICAL DON'TS</h3>
                            <ul className="space-y-3">
                                {emergency.donts.map((dont, i) => (
                                    <li key={i} className="flex items-start text-sm text-red-800">
                                        <span className="mr-2 text-xl leading-none">×</span>
                                        {dont}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <div className="bg-slate-100 rounded-xl p-6">
                        <h3 className="font-bold text-slate-900 mb-3">Symptoms</h3>
                        <div className="flex flex-wrap gap-2">
                            {emergency.symptoms?.map(s => (
                                <Badge key={s} variant="secondary" className="bg-white text-slate-700">
                                    {s}
                                </Badge>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
