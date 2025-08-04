import { SocialType } from "shared/SocialsShare/SocialsShare";
import React, { FC } from "react";
import facebook from "images/socials/facebook.svg";
import tiktok from "images/socials/tiktok.svg";
import instagram from "images/socials/instagram.svg";
import whatsapp from "images/socials/icons8-whatsapp.svg";

export interface SocialsListProps {
  className?: string;
  itemClass?: string;
  socials?: SocialType[];
}

const socialsDemo: SocialType[] = [
  { name: "Facebook", icon: facebook, href: "https://www.facebook.com/PetalPinkLanka.net?mibextid=LQQJ4d" },
  { name: "tiktok", icon: tiktok, href: "https://www.tiktok.com/@petalpinkpvt?_t=8pXqclcOEEs&_r=1" },
  // { name: "Youtube", icon: youtube, href: "" },
  { name: "Telegram", icon: instagram, href: "https://www.instagram.com/petal_pink_lanka?igsh=bDh6YnVkYWpxOTVj&utm_source=qr" },
  { name: "Whatsapp", icon: whatsapp, href: "https://wa.me/94743026840" },
];


const SocialsList: FC<SocialsListProps> = ({
  className = "",
  itemClass = "block w-6 h-6",
  socials = socialsDemo,
}) => {
  return (
    <nav
      className={`nc-SocialsList flex space-x-2.5 text-2xl text-neutral-6000 dark:text-neutral-300 ${className}`}
      data-nc-id="SocialsList"
    >
      {socials.map((item, i) => (
        <a
          key={i}
          className={`${itemClass}`}
          href={item.href}
          target="_blank"
          rel="noopener noreferrer"
          title={item.name}
        >
          <img src={item.icon} alt="" />
        </a>
      ))}
    </nav>
  );
};

export default SocialsList;
