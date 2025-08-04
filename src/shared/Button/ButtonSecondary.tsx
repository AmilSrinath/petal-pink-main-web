import Button, { type ButtonProps } from "./Button"
import type React from "react"

export interface ButtonSecondaryProps extends ButtonProps {}

const ButtonSecondary: React.FC<ButtonSecondaryProps> = ({ className = "", ...args }) => {
  return (
    <Button
      className={`ttnc-ButtonSecondary font-medium border bg-white/80 backdrop-blur-sm border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 dark:hover:from-purple-900/20 dark:hover:to-pink-900/20 hover:border-purple-300 dark:hover:border-purple-600 hover:scale-105 transition-all duration-300 ${className}`}
      {...args}
    />
  )
}

export default ButtonSecondary
