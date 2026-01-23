import React from 'react';
import { Link } from 'react-router-dom';
import * as Icons from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { useLingo } from '../../providers/LingoProvider';

export function EmergencyCard({ emergency }) {
    const Icon = Icons[emergency.icon] || Icons.HelpCircle;
    const { t } = useLingo();

    return (
        <Card className="hover:shadow-lg transition-all duration-300 border-l-4" style={{ borderLeftColor: emergency.color === 'red' ? '#DC2626' : emergency.color === 'orange' ? '#F59E0B' : '#10B981' }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xl font-bold">{t(`emergency.${emergency.slug}.title`, emergency.title)}</CardTitle>
                <div className={`p-2 rounded-full ${emergency.color === 'red' ? 'bg-red-100 text-red-600' : emergency.color === 'orange' ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-600'}`}>
                    <Icon className="h-6 w-6" />
                </div>
            </CardHeader>
            <CardContent>
                <div className="flex items-center space-x-2 mb-4">
                    <Badge variant={emergency.severity === 'critical' ? 'destructive' : emergency.severity === 'high' ? 'destructive' : 'secondary'}>
                        {t(`severity.${emergency.severity}`, emergency.severity.toUpperCase())}
                    </Badge>
                    {emergency.timer && (
                        <Badge variant="outline" className="text-slate-500">
                            ⏱️ {t('card.action', 'Action')}: {emergency.timerLabel || '< 30 mins'}
                        </Badge>
                    )}
                </div>
                <p className="text-sm text-slate-600 line-clamp-2 min-h-[40px]">
                    {t(`emergency.${emergency.slug}.overview`, emergency.overview || `Immediate first aid steps for ${emergency.title}. Click to view life-saving actions.`)}
                </p>
            </CardContent>
            <CardFooter>
                <Link to={`/emergency/${emergency.slug}`} className="w-full">
                    <Button className="w-full" variant={emergency.color === 'red' ? 'destructive' : 'default'}>
                        {t('card.view_steps', 'View Steps')}
                    </Button>
                </Link>
            </CardFooter>
        </Card>
    );
}
