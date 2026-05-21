// Copyright The OpenTelemetry Authors
// SPDX-License-Identifier: Apache-2.0

import Header from '../Header';
import Footer from '../Footer';

interface IProps {
  children: React.ReactNode;
}

const Layout = ({ children }: IProps) => {
  return (
    <>
      <Header />
      <main>{children}</main> 
      <Footer />
    </>
  );
};

// MAKE THIS AN DEFAULT EXPORT
export default Layout;
