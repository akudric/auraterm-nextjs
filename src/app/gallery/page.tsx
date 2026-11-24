import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Gallery from '@/components/Gallery';
import photos from '@/data/gallery.json';
import styles from '@/components/Gallery.module.css';

export const metadata: Metadata = {
  title: 'Galerija radova | AuraTerm',
  description: 'Pogledajte fotografije ugradnje, servisa i održavanja klimatizacijskih uređaja iz naše svakodnevice na terenu.',
};

export default function GalleryPage() {
  return <>
    <Header />
    <main className={styles.page}>
      <section className={styles.intro}>
        <div className={styles.shell}>
          <h1>Galerija naših radova</h1>
          <p className={styles.description}>Od pripreme i ugradnje do servisa i održavanja. Pogledajte detalje našeg rada i klimatizacijska rješenja na terenu.</p>
        </div>
      </section>
      <section className={`${styles.shell} ${styles.content}`} aria-label="Fotografije naših radova">
        <Gallery photos={photos} />
        <div className={styles.cta}>
          <div><h2>Planirate ugradnju ili servis?</h2><p>Javite nam se i pronađimo rješenje za vaš prostor.</p></div>
          <a href="/quote" className="btn">Besplatna procjena</a>
        </div>
      </section>
    </main>
    <Footer />
  </>;
}
