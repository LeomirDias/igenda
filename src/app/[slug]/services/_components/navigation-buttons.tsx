'use client';

import { Button } from '@/components/ui/button';
import { CalendarCheck, CalendarPlus } from 'lucide-react';
import Link from 'next/link';

interface NavigationButtonsProps {
    params: { slug: string };
}

const NavigationButtons = ({ params }: NavigationButtonsProps) => {
    const { slug } = params;
    return (
        <div className="flex flex-wrap items-center gap-4">
            <Button asChild className='flex flex-col items-center justify-center gap-2'>
                <Link href={`/${slug}/catalog`}>
                    <CalendarPlus className="mr-2 h-5 w-5" />
                    Agendar Serviço
                </Link>
            </Button>
            <Button asChild className='flex flex-col items-center justify-center gap-2'>
                <Link href={`/${slug}/clients-appointments`}>
                    <CalendarCheck className="mr-2 h-5 w-5" />
                    Meus Agendamentos
                </Link>
            </Button>
        </div>
    );
}

export default NavigationButtons;