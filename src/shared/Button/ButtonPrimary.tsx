import Button, { type ButtonProps } from "./Button"
import type React from "react"

export interface ButtonPrimaryProps extends ButtonProps {}

const ButtonPrimary: React.FC<ButtonPrimaryProps> = ({ className = "", ...args }) => {
  return (
    <Button
      className={`ttnc-ButtonPrimary disabled:bg-opacity-70 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-slate-50 shadow-xl hover:shadow-2xl border-0 hover:scale-105 transition-all duration-300 ${className}`}
      {...args}
    />
  )
}

export default ButtonPrimary
