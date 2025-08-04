import MyRouter from "routers/index"
import { Helmet, HelmetProvider } from "react-helmet-async"

function App() {
  return (
    <HelmetProvider>
      <Helmet>
        <title>Petal Pink</title>
        <meta name="description" content="Petal Pink" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </Helmet>

      {/* MAIN APP */}
      <div className="bg-white text-base dark:bg-slate-900 text-slate-900 dark:text-slate-200 min-h-screen w-full overflow-x-hidden">
        <MyRouter />
      </div>
    </HelmetProvider>
  )
}

export default App
