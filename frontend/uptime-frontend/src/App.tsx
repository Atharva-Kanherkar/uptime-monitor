import { ThemeProvider } from "@/components/theme-provider"
import { ModeToggle } from "./components/mode-toggle"
import { Navbar } from "./pages/navbar";
 
  

function App() {
 
  return (
    <>
     
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <>
      <div className="mt-2">
      <Navbar/>
      </div>
    
      </>
    </ThemeProvider>
    </>
  )
}

export default App;

