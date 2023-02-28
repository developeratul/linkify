import LogoImage from "@/assets/logo.png";
import Image from "next/image";
import Link from "next/link";

export const LogoSrc = LogoImage;

export default function Logo() {
  return (
    <Link href="/">
      <Image src={LogoSrc} width={100} alt="Linkify logo" />
    </Link>
  );
}
