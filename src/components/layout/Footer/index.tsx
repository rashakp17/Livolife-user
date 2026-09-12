import { PaymentBadge, SocialNetworks } from "./footer.types";
import { FaFacebookF, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";
import LinksSection from "./LinksSection";
import LayoutSpacing from "./LayoutSpacing";

const socialsData: SocialNetworks[] = [
  {
    id: 1,
    icon: <FaTwitter />,
    url: "https://twitter.com",
  },
  {
    id: 2,
    icon: <FaFacebookF />,
    url: "https://www.facebook.com/share/1KqBBfzWnG/?mibextid=wwXIfr",
  },
  {
    id: 3,
    icon: <FaInstagram />,
    url: "https://www.instagram.com/auravault06?igsh=NzBudmE1YTlsemNo",
  },
  {
    id: 4,
    icon: <FaYoutube />,
    url: "https://youtube.com/@hafizfaizhafizfaiz-fz8rs?si=r-Srr8blF_wr3zjL",
  },
];

const paymentBadgesData: PaymentBadge[] = [
  {
    id: 1,
    srcUrl: "/icons/Visa.svg",
  },
  {
    id: 2,
    srcUrl: "/icons/mastercard.svg",
  },
  {
    id: 3,
    srcUrl: "/icons/paypal.svg",
  },
  {
    id: 4,
    srcUrl: "/icons/applePay.svg",
  },
  {
    id: 5,
    srcUrl: "/icons/googlePay.svg",
  },
];

const Footer = () => {
  return (
    <footer className="surface-dark mt-10">
      <div className="relative">
        <div className="absolute bottom-0 w-full h-1/2 bg-card"></div>
      </div>
      <div className="pt-8 md:pt-[50px] bg-card px-4 pb-4">
        <div className="max-w-frame mx-auto">
          <nav className="lg:grid lg:grid-cols-12 mb-8">
            <div className="flex flex-col lg:col-span-3 lg:max-w-[248px]">
              <Link href="/" className="mb-6 inline-block">
                <Image
                  src="/images/livo-logo.png"
                  alt="Livolife"
                  width={560}
                  height={258}
                  className="w-[150px] h-auto"
                />
              </Link>
              <p className="text-muted-foreground text-sm mb-9">
                We have clothes that suits your style and which you’re proud to
                wear. From women to men.
              </p>
              <div className="flex items-center">
                {socialsData.map((social) => (
                  <Link
                    href={social.url}
                    key={social.id}
                    className="bg-background text-foreground hover:bg-primary hover:text-primary-foreground transition-all mr-3 w-7 h-7 rounded-full border border-border flex items-center justify-center p-1.5"
                  >
                    {social.icon}
                  </Link>
                ))}
              </div>
            </div>
            <div className="hidden lg:grid col-span-9 lg:grid-cols-4 lg:pl-10">
              <LinksSection />
            </div>
            <div className="grid lg:hidden grid-cols-2 sm:grid-cols-4">
              <LinksSection />
            </div>
          </nav>

          <hr className="h-[1px] border-t-border mb-6" />
          <div className="flex flex-col sm:flex-row justify-center sm:justify-between items-center mb-2">
          </div>
        </div>
        <LayoutSpacing />
      </div>
    </footer>
  );
};

export default Footer;
