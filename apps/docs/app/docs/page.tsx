import Image, { type ImageProps } from "next/image";
import { Button } from "@repo/ui/components/button";
import styles from "./page.module.css";

type Props = Omit<ImageProps, "src"> & {
  srcLight: string;
  srcDark: string;
};

const ThemeImage = (props: Props) => {
  const { srcLight, srcDark, ...rest } = props;

  return (
    <>
      <Image {...rest} src={srcLight} className="imgLight" />
      <Image {...rest} src={srcDark} className="imgDark" />
    </>
  );
};

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <ThemeImage
          className={styles.logo}
          srcLight="turborepo-dark.svg"
          srcDark="turborepo-light.svg"
          alt="Turborepo logo"
          width={180}
          height={38}
          priority
        />
        <ol>
          <li>
            Docs zone — edit <code>apps/docs/app/docs/page.tsx</code>
          </li>
          <li>
            Served at <code>/docs</code> via Multi-Zones (hard nav from web)
          </li>
        </ol>

        <div className={styles.ctas}>
          {/* Cross-zone: use <a>, not next/link */}
          <a className={styles.primary} href="/">
            ← Back to web zone
          </a>
          <a
            href="https://nextjs.org/docs/app/guides/multi-zones"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.secondary}
          >
            Multi-Zones docs
          </a>
        </div>
        <Button variant="secondary" className={styles.secondary}>
          Open alert
        </Button>
      </main>
      <footer className={styles.footer}>
        <a
          href="https://vercel.com/templates?search=turborepo&utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          href="https://turborepo.dev?utm_source=create-turbo"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to turborepo.dev →
        </a>
      </footer>
    </div>
  );
}
