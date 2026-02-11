import React from 'react'

interface FeatureCardProps {
  icon: React.ReactNode
  title: string
  description: string
}

export function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="bg-muted/50 p-8 hover:bg-muted transition-colors">
      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-6">
        {icon}
      </div>
      <h3 className="font-serif text-2xl font-semibold mb-4">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">{description}</p>
    </div>
  )
}
