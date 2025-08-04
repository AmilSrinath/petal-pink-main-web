import { productImgs } from "contains/fakeData";

import hairOil from "img/Hair Oil.png";
import keratin from "img/Keratin pack.png";

export interface ProductVariant {
  id: number;
  name: string;
  thumbnail?: string;
  color?: string;
  featuredImage: string;
}
export interface Product {
  product_id: number;
  product_name: string;
  product_price: number;
  discount: number;
  weight: number;
  amount:number;
  unit_type:string;
  image_url: string;
  image_url_2:string;
  image_url_3:string;
  description: string;
  keyPoints:string;
  faq: string;
  howToUse: string;
  category: string;
  tags: string[];
  link: string;  // Changed from "/product-detail/" to string
  variants?: ProductVariant[];
  variantType?: "color" | "image";
  sizes?: string[];
  allOfSizes?: string[];
  status?: "New in" | "limited edition" | "Sold Out" | "50% Discount";
}

const DEMO_VARIANT_COLORS: ProductVariant[] = [
  {
    id: 1,
    name: "Violet",
    color: "bg-violet-400",
    featuredImage: productImgs[0],
  },
  {
    id: 2,
    name: "Yellow",
    color: "bg-yellow-400",
    featuredImage: productImgs[1],
  },
  {
    id: 3,
    name: "Orange",
    color: "bg-orange-400",
    featuredImage: productImgs[2],
  },
  {
    id: 4,
    name: "Sky Blue",
    color: "bg-sky-400",
    featuredImage: productImgs[3],
  },
  {
    id: 5,
    name: "Green",
    color: "bg-green-400",
    featuredImage: productImgs[4],
  },
];

export const PRODUCTS: Product[] = [
  {
    product_id: 1,
    product_name: 'Hair Oil',
    description: "",
    keyPoints:"",
    product_price: 2500,
    discount: 0,
    weight: 0,
    amount: 0,
    unit_type: "",
    image_url: hairOil,
    image_url_2: keratin,
    image_url_3: keratin,
    category: "Category 1",
    tags: ["tag1", "tag2"],
    faq: '',
    howToUse: '',
    link: "/product-detail/",
    variants: DEMO_VARIANT_COLORS,
    // variantType: "color",
    // status: "50% Discount",
  }
];

export const SPORT_PRODUCTS: Product[] = [
  // {
  //   id: 1,
  //   name: "Mastermind Toys",
  //   description: "Brown cockroach wings",
  //   price: 74,
  //   image: productSport1,
  //   category: "Category 1",
  //   tags: ["tag1", "tag2"],
  //   link: "/product-detail/",
  //   variants: DEMO_VARIANT_COLORS,
  //   variantType: "color",
  //   sizes: ["XS", "S", "M", "L", "XL"],
  //   allOfSizes: ["XS", "S", "M", "L", "XL", "2XL", "3XL"],
  //   status: "New in",
  // },
  // {
  //   id: 2,
  //   name: "Jump Rope Kids",
  //   description: "Classic green",
  //   price: 68,
  //   image: productSport2,
  //   category: "Category 1",
  //   tags: ["tag1", "tag2"],
  //   link: "/product-detail/",
  //   variants: DEMO_VARIANT_COLORS,
  //   variantType: "color",
  //   status: "50% Discount",
  // },
  // {
  //   id: 3,
  //   name: "Tee Ball Beanie",
  //   description: "New blue aqua",
  //   price: 132,
  //   image: productSport3,
  //   category: "Category 1",
  //   tags: ["tag1", "tag2"],
  //   link: "/product-detail/",
  //   variants: DEMO_VARIANTS,
  //   variantType: "image",
  //   sizes: ["S", "M", "L", "XL"],
  //   allOfSizes: ["S", "M", "L", "XL", "2XL", "3XL"],
  // },
  // {
  //   id: 4,
  //   name: "Rubber Table Tennis",
  //   description: "Dark pink 2023",
  //   price: 28,
  //   image: productSport4,
  //   category: "Category 1",
  //   tags: ["tag1", "tag2"],
  //   variants: DEMO_VARIANT_COLORS,
  //   variantType: "color",
  //   link: "/product-detail/",
  //   status: "Sold Out",
  // },
  // {
  //   id: 5,
  //   name: "Classic Blue Rugby",
  //   description: "Perfect mint green",
  //   price: 42,
  //   image: productSport5,
  //   category: "Category 1",
  //   tags: ["tag1", "tag2"],
  //   variants: DEMO_VARIANTS,
  //   variantType: "image",
  //   sizes: ["XS", "S", "M", "L", "XL"],
  //   allOfSizes: ["XS", "S", "M", "L", "XL", "2XL", "3XL"],
  //   link: "/product-detail/",
  // },
  // {
  //   id: 4,
  //   name: "Shampoo",
  //   description: "",
  //   price: 2500,
  //   image: shampoo,
  //   category: "Category 1",
  //   tags: ["tag1", "tag2"],
  //   variants: DEMO_VARIANT_COLORS,
  //   // variantType: "color",
  //   link: "/product-detail/",
  //   // status: "Sold Out",
  // },
  // {
  //   id: 7,
  //   name: "Tabletop Football ",
  //   description: "Matte black",
  //   price: 12,
  //   image: productSport7,
  //   category: "Category 1",
  //   tags: ["tag1", "tag2"],
  //   variants: DEMO_VARIANTS,
  //   variantType: "image",
  //   link: "/product-detail/",
  //   status: "New in",
  // },
  // {
  //   id: 8,
  //   name: "Pvc Catching Toy",
  //   description: "Cream pink",
  //   price: 145,
  //   image: productSport8,
  //   category: "Category 1",
  //   tags: ["tag1", "tag2"],
  //   variants: DEMO_VARIANT_COLORS,
  //   variantType: "color",
  //   sizes: ["XS", "S", "M", "L", "XL"],
  //   allOfSizes: ["XS", "S", "M", "L", "XL", "2XL", "3XL"],
  //   link: "/product-detail/",
  //   status: "limited edition",
  // },
];