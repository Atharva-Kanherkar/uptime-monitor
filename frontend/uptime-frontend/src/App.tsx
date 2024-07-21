import { ThemeProvider } from "@/components/theme-provider"
import { ModeToggle } from "./components/mode-toggle"

function App() {
 
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
     <ModeToggle/>
      <div className="w-full h-full bg-background text-primary-foreground">
        <h1 className="text-4xl font-bold">Hello, world!</h1>
    </div>
    </ThemeProvider>
  )
}

export default App
