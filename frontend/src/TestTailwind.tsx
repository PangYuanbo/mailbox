import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, Sparkles, TrendingUp } from "lucide-react"

export function TestTailwind() {
  return (
    <div className="p-8 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Modern UI Test
        </h1>
        <p className="text-muted-foreground text-lg">Testing Tailwind CSS + shadcn/ui Components</p>
      </div>
      
      {/* Native Tailwind Test */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-r from-pink-500 to-rose-500 text-white p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1">
          <Sparkles className="w-8 h-8 mb-2" />
          <h3 className="text-xl font-semibold">Gradient Card</h3>
          <p className="opacity-90">Pure Tailwind styling</p>
        </div>
        
        <div className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1">
          <TrendingUp className="w-8 h-8 mb-2" />
          <h3 className="text-xl font-semibold">Hover Effects</h3>
          <p className="opacity-90">Smooth animations</p>
        </div>
        
        <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1">
          <Mail className="w-8 h-8 mb-2" />
          <h3 className="text-xl font-semibold">Responsive Grid</h3>
          <p className="opacity-90">Mobile-first design</p>
        </div>
      </div>
      
      {/* shadcn/ui Components Test */}
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>shadcn/ui Components</CardTitle>
          <CardDescription>Testing the component library integration</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4 flex-wrap">
            <Button>Default Button</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
          </div>
          
          <div className="bg-muted p-4 rounded-lg">
            <p className="text-sm text-muted-foreground">
              If you can see styled buttons above and this card has proper styling, 
              then both Tailwind CSS and shadcn/ui are working correctly!
            </p>
          </div>
        </CardContent>
        <CardFooter>
          <p className="text-sm text-muted-foreground">✨ Everything is configured properly!</p>
        </CardFooter>
      </Card>
      
      {/* Animation Test */}
      <div className="flex justify-center space-x-8">
        <div className="w-16 h-16 bg-blue-500 rounded-full animate-bounce"></div>
        <div className="w-16 h-16 bg-purple-500 rounded-full animate-pulse"></div>
        <div className="w-16 h-16 bg-pink-500 rounded-full animate-spin"></div>
      </div>
    </div>
  )
}