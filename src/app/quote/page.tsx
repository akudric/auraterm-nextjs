'use client';

import { useContactSubmission } from '@/lib/contact-submission';
import ContactSuccess from '@/components/ContactSuccess';

import Header from '@/components/Header';
import Section from '@/components/Section';
import Footer from '@/components/Footer';

export default function QuotePage() {
  const { onSubmit, status, loading, successOpen, closeSuccess } = useContactSubmission();

  return (
  <>
      {successOpen && <ContactSuccess onClose={closeSuccess} />}

      <div className="bg-gray-50 min-h-screen">
        <Header />
        <Section>
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-extrabold text-center mb-6 text-gray-800">Besplatna procjena</h1>
            <p className="text-center text-gray-600 mb-12">Imate pitanje ili želite ponudu? Ispunite obrazac ispod i javit ćemo vam se u najkraćem mogućem roku.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
              <div className="bg-white p-8 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Kontakt informacije</h2>
                <div className="flex items-center mb-4">
                  <svg className="w-6 h-6 mr-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                  <p className="text-gray-700">Ulica kralja Zvonimira 1, Karlovac</p>
                </div>
                <div className="flex items-center mb-4">
                  <svg className="w-6 h-6 mr-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                  <p className="text-gray-700">+385 99319993</p>
                </div>
                <div className="flex items-center">
                  <svg className="w-6 h-6 mr-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                  <p className="text-gray-700">info@auraterm.hr</p>
                </div>
              </div>
              <div className="bg-white p-8 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Zatražite ponudu</h2>
                <form onSubmit={onSubmit} className="flex flex-col gap-6">
                  <input name="name" type="text" placeholder="Ime i prezime" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition" required />
                  <input name="email" type="email" placeholder="Email adresa" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition" required />
                  <input name="phone" type="tel" placeholder="Broj telefona" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition" />
                  <select name="system_type" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition">
                    <option value="">Odaberite tip sustava</option>
                    <option value="hlađenje">Hlađenje</option>
                    <option value="grijanje">Grijanje</option>
                    <option value="ventilacija">Ventilacija</option>
                  </select>
                  <textarea name="message" placeholder="Opišite Vaš upit" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition" rows={5} required></textarea>
                  <input
                    type="text"
                    name="company_website"
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden="true"
                    style={{ position: 'absolute', left: -10000, width: 1, height: 1, overflow: 'hidden' }}
                  />
                  <button type="submit" disabled={loading} className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg transition duration-300 ease-in-out transform hover:-translate-y-1 disabled:opacity-60">
                    {loading ? 'Slanje…' : 'Pošalji upit'}
                  </button>
                </form>
                <p className="py-2 text-sm text-center" aria-live="polite">{status}</p>
              </div>
            </div>
          </div>
        </Section>
        <Footer />
      </div>
    </>
  );
}
