import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Clock } from 'lucide-react';

export function Stepper({ steps }) {
    return (
        <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
            {steps.map((step, index) => (
                <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="relative flex items-start group"
                >
                    {/* Timeline Node */}
                    <div className="absolute left-0 top-0 flex items-center justify-center w-10 h-10 rounded-full bg-white border-2 border-primary group-hover:border-accent-red group-hover:scale-110 transition-all z-10 shadow-sm">
                        <span className="font-bold text-primary group-hover:text-accent-red">{index + 1}</span>
                    </div>

                    {/* Content Card */}
                    <div className="ml-16 w-full bg-white p-6 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-lg font-bold text-slate-900">{step.title}</h3>
                            {step.time && (
                                <div className="flex items-center text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
                                    <Clock className="w-3 h-3 mr-1" />
                                    {step.time}
                                </div>
                            )}
                        </div>
                        <p className="text-slate-600">{step.desc}</p>
                    </div>
                </motion.div>
            ))}
        </div>
    );
}
