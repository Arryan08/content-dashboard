import "./globals.css";

export const metadata = {
  title: "Master Dashboard",
  description: "Word Count Analytics Dashboard",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
