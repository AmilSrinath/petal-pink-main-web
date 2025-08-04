import React, { FC } from "react";

export interface PricesProps {
  className?: string;
  price?:  number | string;
  contentClass?: string;
  style?: React.CSSProperties; // Allow style as a prop
}

const Prices: FC<PricesProps> = ({
  className = "",
  price = "",
  contentClass = "py-1 px-2 md:py-1.5 md:px-2.5 text-sm font-medium",
    style
}) => {
  return (
    <div className={`${className}`}>
      <div
        className={`flex items-center border-2 border-green-500 rounded-lg ${contentClass}`}
      style={style}>
        <span className="text-green-500 !leading-none" style={style}>
          Rs. {price}
        </span>
      </div>
    </div>
  );
};

export default Prices;
