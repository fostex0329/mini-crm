"use client";

import { Button } from "@/components/yohaku/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/yohaku/ui/card";
import { Badge } from "@/components/yohaku/ui/badge";
import { Input } from "@/components/yohaku/ui/input";

export default function StyleGuidePage() {
  return (
    <div className="container mx-auto py-10 space-y-10">
      <header className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Yohaku Design System v2</h1>
        <p className="text-xl text-muted-foreground">Verification and Style Guide (Branch: feature/ui-rebuild)</p>
      </header>

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">Buttons</h2>
        <div className="flex flex-wrap gap-4">
          <Button>Default Button</Button>
          <Button variant="secondary">Secondary Button</Button>
          <Button variant="outline">Outline Button</Button>
          <Button variant="ghost">Ghost Button</Button>
          <Button variant="destructive">Destructive Button</Button>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">Badges</h2>
        <div className="flex flex-wrap gap-4">
          <Badge>Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="outline">Outline</Badge>
          <Badge variant="destructive">Destructive</Badge>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">Inputs</h2>
        <div className="max-w-sm space-y-4">
          <Input placeholder="Enter your text..." />
          <Input disabled placeholder="Disabled input" />
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">Cards</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Project A</CardTitle>
              <CardDescription>Initial phase of development.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">This project is focused on building the core CRM features.</p>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Badge variant="secondary">In Progress</Badge>
              <Button size="sm">Details</Button>
            </CardFooter>
          </Card>

          <Card className="bg-primary text-primary-foreground">
            <CardHeader>
              <CardTitle className="text-primary-foreground">Featured Item</CardTitle>
              <CardDescription className="text-primary-foreground/80">Highlighting important data.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">Cards can also use the primary color for emphasis.</p>
            </CardContent>
            <CardFooter>
              <Button variant="secondary" size="sm" className="w-full">Action</Button>
            </CardFooter>
          </Card>
        </div>
      </section>
    </div>
  );
}
