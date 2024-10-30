import { FC } from "react";
import Image from "next/image";

export const Logo: FC = () => {
  return <Image src={"/logo.svg"} alt="Primasense" width={25} height={25} />;
};
