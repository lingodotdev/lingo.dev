import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle } from '../components/ui/card';
import { Heart, Wind, Zap, Skull, Sun, Bug, Baby, Activity } from 'lucide-react';
import emergenciesData from '../data/emergencies.json';

const categories = [
    { id: 'bites', title: 'Bites & Stings', icon: Bug, items: ['snake-bite', 'scorpion-sting', 'dog-bite'] },
    { id: 'heart', title: 'Heart & Circulation', icon: Heart, items: ['heart-attack', 'cpr', 'dengue'] },
    { id: 'trauma', title: 'Trauma & Accidents', icon: Activity, items: ['road-accident', 'drowning', 'bleeding'] }, // bleeding missing in json but logic holds
    { id: 'burns', title: 'Burns & Chemicals', icon: Zap, items: ['burns', 'chemical-burn', 'electrocution', 'gas-leak'] },
    { id: 'env', title: 'Environmental', icon: Sun, items: ['heatstroke', 'food-poisoning'] },
    { id: 'breathing', title: 'Breathing', icon: Wind, items: ['choking'] },
];

export default function Categories() {
    return (
        <div className="container px-4 mx-auto py-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-8">Emergency Categories</h1>

            <div className="space-y-12">
                {categories.map((category) => (
                    <div key={category.id}>
                        <div className="flex items-center space-x-3 mb-6">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <category.icon className="h-6 w-6 text-primary" />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900">{category.title}</h2>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {category.items.map((slug) => {
                                const data = emergenciesData[slug];
                                if (!data) return null;

                                return (
                                    <Link key={slug} to={`/emergency/${slug}`}>
                                        <Card className="hover:shadow-md transition-shadow h-full">
                                            <CardHeader className="p-4">
                                                <CardTitle className="text-lg flex items-center justify-between">
                                                    {data.title}
                                                    <span className={`text-xs px-2 py-1 rounded-full ${data.severity === 'critical' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-600'}`}>
                                                        {data.severity}
                                                    </span>
                                                </CardTitle>
                                            </CardHeader>
                                        </Card>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
