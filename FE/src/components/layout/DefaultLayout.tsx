import React from 'react';
import Header from './Header';
import Footer from './Footer';
import { ScriptProvider } from '../../config/ScriptProvider';

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <ScriptProvider />
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}
