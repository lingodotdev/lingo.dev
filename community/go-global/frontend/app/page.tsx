'use client'

import { useState } from 'react'
import {
  Globe,
  Zap,
  Code,
  GitBranch,
  Rocket,
  CheckCircle,
  ArrowRight,
  Menu
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { ModeToggle } from '@/components/mode-toggle'
import { useRouter } from 'next/navigation'

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const router = useRouter();

  return (
    <div className="min-h-screen">
      <nav className="fixed top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <Globe className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold">GoGlobal</span>
            </div>

            <div className="hidden items-center gap-8 md:flex">
              <a href="#features" className="text-muted-foreground hover:text-foreground">
                Features
              </a>
              <a href="#how-it-works" className="text-muted-foreground hover:text-foreground">
                How It Works
              </a>
              <a href="#pricing" className="text-muted-foreground hover:text-foreground">
                Pricing
              </a>
              <Button onClick={() => { router.push('/home') }} className="rounded-full">Get Started</Button>
              <ModeToggle />
            </div>

            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <div className="mt-8 flex flex-col gap-6">
                  {['Features', 'How It Works', 'Pricing'].map(item => (
                    <a
                      key={item}
                      href={`#${item.toLowerCase().replaceAll(' ', '-')}`}
                      className="text-lg text-muted-foreground hover:text-foreground"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item}
                    </a>
                  ))}
                  <Button className="w-full rounded-full">Get Started</Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>

      <section className="px-6 pt-32 pb-20">
        <div className="mx-auto max-w-4xl text-center">
          <Badge variant="secondary" className="mb-6 px-4 py-2">
            <Zap className="mr-2 h-4 w-4" />
            Powered by Lingo.dev
          </Badge>

          <h1 className="mb-6 text-5xl font-bold leading-tight md:text-7xl">
            Launch Your Startup
            <span className="block text-primary">Globally in Minutes</span>
          </h1>

          <p className="mb-10 text-xl text-muted-foreground">
            Translate your landing page into 50+ languages with AI-powered localization.
            Get automated translations, GitHub integration, and multi-language deployment.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" className="rounded-full px-8 text-lg">
              Start Free Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="rounded-full px-8 text-lg">
              View Demo
            </Button>
          </div>

          <div className="mt-12 flex flex-wrap justify-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-primary" />
              No credit card required
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-primary" />
              5 free translations
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="bg-muted/30 py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold md:text-5xl">
              Everything You Need to Go Global
            </h2>
            <p className="mx-auto max-w-2xl text-xl text-muted-foreground">
              From translation to deployment, we handle the entire localization workflow
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: Zap,
                title: 'AI-Powered Translation',
                color: 'primary'
              },
              {
                icon: GitBranch,
                title: 'GitHub Integration',
                color: 'secondary'
              },
              {
                icon: Code,
                title: 'Export Ready Code',
                color: 'accent'
              },
              {
                icon: Globe,
                title: 'Multi-Language Sites',
                color: 'primary'
              },
              {
                icon: Rocket,
                title: 'Instant Deployment',
                color: 'secondary'
              },
              {
                icon: CheckCircle,
                title: 'Quality Assurance',
                color: 'accent'
              }
            ].map(({ icon: Icon, title, color }) => (
              <Card key={title} className="transition-shadow hover:shadow-lg">
                <CardHeader>
                  <div
                    className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-${color}/10`}
                  >
                    <Icon className={`h-6 w-6 text-${color}`} />
                  </div>
                  <CardTitle>{title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    Powerful AI-driven localization with developer-first workflows.
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold md:text-5xl">
              From Content to Deployment
            </h2>
            <p className="mx-auto max-w-2xl text-xl text-muted-foreground">
              Three simple steps to reach global markets
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              { step: 1, title: 'Input Your Content' },
              { step: 2, title: 'Select Markets' },
              { step: 3, title: 'Deploy Globally' }
            ].map(({ step, title }) => (
              <div key={step} className="text-center">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
                  {step}
                </div>
                <h3 className="mb-4 text-2xl font-semibold">{title}</h3>
                <p className="text-muted-foreground">
                  AI-powered workflows designed for speed, accuracy, and scalability.
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="bg-muted/30 py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold md:text-5xl">
              Simple, Transparent Pricing
            </h2>
            <p className="mx-auto max-w-2xl text-xl text-muted-foreground">
              Start free, scale as you grow
            </p>
          </div>

          <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Free</CardTitle>
                <div className="mt-4 text-4xl font-bold">
                  $0<span className="text-xl text-muted-foreground">/mo</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {['5 translations per month', 'Basic templates', 'Community support'].map(item => (
                  <div key={item} className="flex gap-3">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    <span className="text-muted-foreground">{item}</span>
                  </div>
                ))}
              </CardContent>
              <CardFooter>
                <Button variant="secondary" className="w-full rounded-full">
                  Get Started
                </Button>
              </CardFooter>
            </Card>

            <Card className="relative scale-105 border-2 border-primary shadow-xl">
              <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
                Most Popular
              </Badge>
              <CardHeader className="rounded-t-lg bg-primary text-primary-foreground">
                <CardTitle className="text-2xl">Pro</CardTitle>
                <div className="mt-4 text-4xl font-bold">
                  $49<span className="text-xl opacity-80">/mo</span>
                </div>
              </CardHeader>
              <CardContent className="mt-6 space-y-4">
                {[
                  'Unlimited translations',
                  '3 connected repositories',
                  'CI/CD automation',
                  'Priority support'
                ].map(item => (
                  <div key={item} className="flex gap-3">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    <span>{item}</span>
                  </div>
                ))}
              </CardContent>
              <CardFooter>
                <Button className="w-full rounded-full">Start Free Trial</Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Enterprise</CardTitle>
                <div className="mt-4 text-4xl font-bold">Custom</div>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  'Everything in Pro',
                  'Unlimited repositories',
                  'Custom workflows',
                  'Dedicated support'
                ].map(item => (
                  <div key={item} className="flex gap-3">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    <span className="text-muted-foreground">{item}</span>
                  </div>
                ))}
              </CardContent>
              <CardFooter>
                <Button variant="secondary" className="w-full rounded-full">
                  Contact Sales
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="mb-6 text-4xl font-bold md:text-5xl">
            Ready to Reach Global Markets?
          </h2>
          <p className="mb-10 text-xl text-muted-foreground">
            Join startups expanding internationally with AI-powered localization
          </p>
          <Button size="lg" className="rounded-full px-10 text-lg">
            Start Your Free Trial
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="flex items-center gap-2">
              <Globe className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">GoGlobal</span>
            </div>
            <div className="flex gap-8 text-sm text-muted-foreground">
              <a href="#" className="hover:text-foreground">Privacy</a>
              <a href="#" className="hover:text-foreground">Terms</a>
              <a href="#" className="hover:text-foreground">Contact</a>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2026 GoGlobal. Powered by Lingo.dev
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
