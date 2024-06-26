import { cn } from "@/lib/utils";
import Link from "next/link";
import { type FC } from "react";

interface MobileLinkProps {
  pathname: string;
  href: string;
  title: string;
}

const MobileLink: FC<MobileLinkProps> = ({ pathname, href, title }) => {
  return (
    <Link
      href={href}
      className={cn([
        "text-muted-foreground hover:text-foreground",
        {
          "text-foreground": pathname === "/",
        },
      ])}
    >
      {title}
    </Link>
  );
};

export default MobileLink;
