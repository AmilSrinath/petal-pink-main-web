import { SocialType } from "shared/SocialsShare/SocialsShare";
import React, { FC } from "react";
import facebook from "images/socials/facebook.svg";
import tiktok from "images/socials/tiktok.svg";
import instagram from "images/socials/instagram.svg";
import whatsapp from "images/socials/icons8-whatsapp.svg";
// import youtube from "images/socials/youtube.svg";

export interface SocialsList1Props {
  className?: string;
}

const socials: SocialType[] = [
  { name: "Facebook", icon: facebook, href: "https://www.facebook.com/PetalPinkLanka.net?mibextid=LQQJ4d" },
  { name: "Tiktok", icon: tiktok, href: "https://www.tiktok.com/@petalpinkpvt?_t=8pXqclcOEEs&_r=1" },
  { name: "Instagram", icon: instagram, href: "https://www.instagram.com/petal_pink_lanka?igsh=bDh6YnVkYWpxOTVj&utm_source=qr" },
  { name: "Whatsapp", icon: whatsapp, href: "https://wa.me/94743026840" },
  // { name: "Twitter", icon: twitter, href: "#" },
];

const SocialsList1: FC<SocialsList1Props> = ({ className = "space-y-3" }) => {
  const renderItem = (item: SocialType, index: number) => {
    return (
      <a
        href={item.href}
        className="flex items-center text-2xl text-neutral-700 hover:text-black dark:text-neutral-300 dark:hover:text-white leading-none space-x-2 group"
        key={index}
      >
        <div className="flex-shrink-0 w-5 ">
          <img src={item.icon} alt="" />
        </div>
        <span className="hidden lg:block text-sm">{item.name}</span>
      </a>
    );
  };

  return (
    <div className={`nc-SocialsList1 ${className}`} data-nc-id="SocialsList1">
      {socials.map(renderItem)}
    </div>
  );
};

export default SocialsList1;
