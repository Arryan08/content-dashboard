import "./globals.css";

export const metadata = {
  title: "Content Dashboard",
  description: "Google Sheets Content Analytics Dashboard",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
