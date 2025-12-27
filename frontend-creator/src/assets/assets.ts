import ImgHero from "./ImgHero.svg";
import Logo from "./logo1.svg";
import ImgLogin from "./NFT_8.jpeg";
import Logo1 from "./logo-1.svg";
import Logo2 from "./logo2.png";
import Logo3 from "./logo3.png";
import Logo4 from "./logo4.png";
import Logo5 from "./logo5.png";
import Logo6 from "./logo6.png";

export const assets: {
  readonly ImgHero: string;
  readonly Logo: string;
  readonly ImgLogin: string;
  readonly Logo1: string;
  readonly Logo2: string;
  readonly Logo3: string;
  readonly Logo4: string;
  readonly Logo5: string;
  readonly Logo6: string;
} = {
  ImgHero,
  Logo,
  ImgLogin,
  Logo1,
  Logo2,
  Logo3,
  Logo4,
  Logo5,
  Logo6,
} as const;
