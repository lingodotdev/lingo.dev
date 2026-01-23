import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Phone, ArrowRight, Activity, Clock, Shield } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { SearchInput } from '../components/features/SearchInput';
import { EmergencyCard } from '../components/features/EmergencyCard';
import emergencyNumbers from '../data/emergencyNumbers.json';
import emergenciesData from '../data/emergencies.json';

// Import Lingo hook from provider
import { useLingo } from '../providers/LingoProvider';

export default function Home() {
    const featuredEmergencies = Object.values(emergenciesData).slice(0, 6);
    const { t } = useLingo();

    return (
        <div className="space-y-12 pb-12">
            {/* Hero Section */}
            <section className="relative bg-slate-900 text-white overflow-hidden pb-16 pt-12 md:pb-24 md:pt-20 lg:pb-32 lg:pt-28">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1588776814546-1ffcf4726ea?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center opacity-10"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-transparent"></div>

                <div className="container relative px-4 mx-auto text-center z-10">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-600/20 ring-4 ring-red-600/10"
                    >
                        <Activity className="h-10 w-10 text-red-500 animate-pulse" />
                    </motion.div>

                    <motion.h1
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl mb-6"
                    >
                        {t('hero.title', 'Save Lives in')} <span className="text-red-500">{t('hero.time', '60 Seconds')}</span>
                    </motion.h1>

                    <motion.p
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="mx-auto max-w-[700px] text-lg text-slate-300 mb-8"
                    >
                        {t('hero.subtitle', 'Instant, localized first aid guides for India. Medically accurate, offline-ready, and designed for the Golden Hour.')}
                    </motion.p>

                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="mx-auto max-w-md w-full"
                    >
                        <SearchInput className="shadow-2xl" placeholder={t('search.placeholder', 'Search for symptoms...')} />
                    </motion.div>
                </div>
            </section>

            {/* Emergency Numbers Carousel */}
            <section className="container px-4 mx-auto -mt-10 relative z-20">
                <div className="flex overflow-x-auto gap-4 py-4 no-scrollbar pb-8 snap-x">
                    {emergencyNumbers.map((num) => (
                        <a key={num.id} href={`tel:${num.number}`} className="flex-none w-48 snap-start">
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Card className="bg-white border-l-4 border-l-red-500 hover:shadow-lg transition-all text-center h-full">
                                    <CardContent className="pt-6">
                                        <div className="mx-auto bg-red-50 w-10 h-10 rounded-full flex items-center justify-center mb-3">
                                            <Phone className="h-5 w-5 text-red-600" />
                                        </div>
                                        <div className="text-2xl font-bold text-slate-900">{num.number}</div>
                                        <div className="text-sm font-medium text-slate-600 truncate">{t(`numbers.${num.id}.title`, num.title)}</div>
                                        <div className="text-xs text-slate-400 mt-1 truncate">{t(`numbers.${num.id}.desc`, num.description)}</div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </a>
                    ))}
                </div>
            </section>

            {/* Featured Emergencies */}
            <section className="container px-4 mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900">{t('home.common_emergencies', 'Common Emergencies')}</h2>
                    <Link to="/categories">
                        <Button variant="ghost" className="hidden sm:flex">
                            {t('home.view_all', 'View All')} <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {featuredEmergencies.map((emergency, index) => (
                        <motion.div
                            key={emergency.slug}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <EmergencyCard emergency={emergency} />
                        </motion.div>
                    ))}
                </div>

                <div className="mt-8 text-center sm:hidden">
                    <Link to="/categories">
                        <Button variant="outline" className="w-full">{t('home.view_all_cats', 'View All Categories')}</Button>
                    </Link>
                </div>
            </section>

            {/* Quick Stats */}
            <section className="bg-slate-50 py-16 border-y border-slate-200">
                <div className="container px-4 mx-auto">
                    <div className="grid grid-cols-1 gap-8 sm:grid-cols-3 text-center">
                        <div>
                            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 mb-4">
                                <Clock className="h-6 w-6 text-blue-600" />
                            </div>
                            <h3 className="text-4xl font-bold text-slate-900">50%</h3>
                            <p className="mt-2 text-sm text-slate-600">{t('stats.cpr', 'Cardiac arrest survival chance increased by CPR')}</p>
                        </div>
                        <div>
                            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 mb-4">
                                <Shield className="h-6 w-6 text-green-600" />
                            </div>
                            <h3 className="text-4xl font-bold text-slate-900">100%</h3>
                            <p className="mt-2 text-sm text-slate-600">{t('stats.free', 'Free & Offline Access')}</p>
                        </div>
                        <div>
                            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 mb-4">
                                <Activity className="h-6 w-6 text-orange-600" />
                            </div>
                            <h3 className="text-4xl font-bold text-slate-900">108</h3>
                            <p className="mt-2 text-sm text-slate-600">{t('stats.coverage', 'National Ambulance Service Coverage')}</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
