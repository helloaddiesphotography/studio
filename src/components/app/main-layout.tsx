'use client';

import React, { useState } from 'react';
import {
  Book,
  Bot,
  BrainCircuit,
  LayoutDashboard,
  Menu,
} from 'lucide-react';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { CivicsWhizIcon } from './icons';
import Flashcards from './flashcards';
import IntelligentQuiz from './intelligent-quiz';
import ProgressTracker from './progress-tracker';
import StudyPlanGenerator from './study-plan-generator';
import { Button } from '../ui/button';

type View = 'flashcards' | 'quiz' | 'progress' | 'study-plan';

export default function MainLayout() {
  const [activeView, setActiveView] = useState<View>('flashcards');

  const renderContent = () => {
    switch (activeView) {
      case 'flashcards':
        return <Flashcards />;
      case 'quiz':
        return <IntelligentQuiz />;
      case 'progress':
        return <ProgressTracker />;
      case 'study-plan':
        return <StudyPlanGenerator />;
      default:
        return <Flashcards />;
    }
  };

  const menuItems = [
    { id: 'flashcards', label: 'Flashcards', icon: <Book /> },
    { id: 'quiz', label: 'Intelligent Quiz', icon: <BrainCircuit /> },
    { id: 'progress', label: 'Progress Tracker', icon: <LayoutDashboard /> },
    { id: 'study-plan', label: 'AI Study Plan', icon: <Bot /> },
  ];

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2">
            <CivicsWhizIcon className="size-8 text-primary" />
            <h1 className="text-xl font-semibold">Civics Whiz</h1>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {menuItems.map(item => (
              <SidebarMenuItem key={item.id}>
                <SidebarMenuButton
                  onClick={() => setActiveView(item.id as View)}
                  isActive={activeView === item.id}
                  tooltip={{ children: item.label }}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <div className="text-xs text-muted-foreground p-2 text-center group-data-[collapsible=icon]:hidden">
            <p>&copy; {new Date().getFullYear()} Civics Whiz</p>
          </div>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-14 items-center gap-4 border-b bg-card px-4 lg:h-[60px] lg:px-6">
           <SidebarTrigger className="md:hidden" asChild>
                <Button variant="outline" size="icon">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle navigation menu</span>
                </Button>
            </SidebarTrigger>
          <div className="flex-1">
             <h2 className="text-xl font-bold tracking-tight">
              {menuItems.find(item => item.id === activeView)?.label}
            </h2>
          </div>
        </header>
        <main className="flex-1 overflow-auto p-4 sm:p-6">
          {renderContent()}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
