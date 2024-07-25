import Head from "next/head";
import styles from "./styles.module.scss";
import Link from "next/link";

export default function Header() {
    return (
        <>
            <Head>
                <title>Protocol Manager - Rafael Menegalli</title>
            </Head>
            <header>
                <div className={styles.container}>
                    <Link href="/"><h1>Protocol Manager</h1></Link>

                    <div className={styles.navContainer}>
                        <Link href="/documents">Documentos</Link>
                        <Link href="/people">Pessoas</Link>
                    </div>
                </div>
            </header>
        </>
    )
}