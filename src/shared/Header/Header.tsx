import type { FC } from "react"
import MainNav1 from "./MainNav1"

export type HeaderProps = {}

const Header: FC<HeaderProps> = () => {
  return (
    <div
      id="nc-chifis-header"
      className="nc-Header w-full z-40 bg-gradient-to-r from-white/95 to-purple-50/95 dark:from-slate-900/95 dark:to-purple-900/95 backdrop-blur-md border-b border-white/20 dark:border-white/10 shadow-lg"
    >
      {/* NAV */}
      <MainNav1 isTop />
    </div>
  )
}

export default Header
