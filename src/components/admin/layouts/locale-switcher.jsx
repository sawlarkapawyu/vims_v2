import Link from "next/link";
import { useRouter } from "next/router";
import Image from "next/image";

export default function LocaleSwitcher() {
  const router = useRouter();

  const { locales, locale: activeLocale } = router;

  const otherLocales = locales?.filter(
    (locale) => locale !== activeLocale && locale !== "default"
  );

  return (
    <span className="cursor-pointer text-muted">
      {otherLocales?.map((locale) => {
        const { pathname, query, asPath } = router;

        // Define flag image URLs based on locale
        const flagUrl =
          locale === "en"
            ? "/images/flags/en.png"
            : locale === "mm"
            ? "/images/flags/mm.png"
            : null;
            
        return (
          <span key={"locale-" + locale} className="inline-flex items-center">
            <Link href={{ pathname, query }} as={asPath} locale={locale} className="flex items-center px-1">
            <Image
                  src={flagUrl}
                  alt={locale}
                  width={30}
                  height={23}
                  className="mr-2 rounded"
                />
              <span className="sm:text-sm">{locale === "en" ? "English" : locale === "mm" ? "Myanmar" : null}</span>
                
            </Link>
          </span>
        );
      })}
    </span>
  );
}