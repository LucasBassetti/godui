import Image from "next/image";
import type { ComponentProps } from "react";

type GoduiLogoProps = Omit<ComponentProps<typeof Image>, "src" | "alt"> & {
  alt?: string;
};

export function GoduiLogo({ alt = "GoDUI", ...props }: GoduiLogoProps) {
  return (
    <Image src="/godui-logo.png" alt={alt} width={28} height={28} {...props} />
  );
}
