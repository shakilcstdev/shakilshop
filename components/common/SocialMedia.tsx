import {
  FaGithub,
  FaLinkedin,
  FaSlack,
  FaYoutube,
  FaGlobe,
} from "react-icons/fa";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

import { cn } from "@/lib/utils";

interface Props {
  className?: string;
  iconClassName?: string;
  tooltipClassName?: string;
}

const socialLink = [
  {
    title: "Youtube",
    href: "www.youtube.com/@ShakilAhamed-en7db",
    icon: <FaYoutube className="w-5 h-5" />,
  },
  {
    title: "Github",
    href: "https://github.com/shakilcstdev",
    icon: <FaGithub className="w-5 h-5" />,
  },
  {
    title: "Linkedin",
    href: "https://www.linkedin.com/in/shakildv/",
    icon: <FaLinkedin className="w-5 h-5" />,
  },
  {
    title: "Website",
    href: "about-shakil.vercel.app",
    icon: <FaGlobe className="w-5 h-5" />,
  },
  {
    title: "Slack",
    href: "https://slack.com",
    icon: <FaSlack className="w-5 h-5" />,
  },
];

const SocialMedia = ({
  className,
  iconClassName,
  tooltipClassName,
}: Props) => {
  return (
    <TooltipProvider>
      <div className={cn("flex items-center gap-3.5 text-zinc-400", className)}>
        {socialLink.map((item) => (
          <Tooltip key={item.title}>
            <TooltipTrigger asChild>
              <a
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "p-2 border rounded-full hover:text-white hover:border-shop_dark_green hoverEffect",
                  iconClassName
                )}
              >
                {item.icon}
              </a>
            </TooltipTrigger>

            <TooltipContent
              className={cn(
                "bg-white text-dark-color font-semibold",
                tooltipClassName
              )}
            >
              {item.title}
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  );
};

export default SocialMedia;