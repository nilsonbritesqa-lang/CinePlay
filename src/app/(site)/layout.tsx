import Header from '@/components/site/Header';
import Footer from '@/components/site/Footer';
import ChatBot from '@/components/site/ChatBot';

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
      <ChatBot />
    </>
  );
}
