import type { AppProps } from "next/app";
import "@/styles/globals.scss";

//RSUITE CONFIGURATIONS
import 'rsuite/dist/rsuite-no-reset.min.css';
import { CustomProvider } from 'rsuite';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <CustomProvider>
      <Component {...pageProps} />
    </CustomProvider>
  )
}
