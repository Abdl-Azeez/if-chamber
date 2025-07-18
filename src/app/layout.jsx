import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./globals.css";
import PropTypes from "prop-types";
import { Inter } from "next/font/google";
import ProgressBar from "./components/ProgressBar";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Islamic Finance Chamber",
  description:
    "A global community for Islamic Finance experts and enthusiasts.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ProgressBar />
        {children}
      </body>
    </html>
  );
}

RootLayout.propTypes = {
  children: PropTypes.node.isRequired,
};
