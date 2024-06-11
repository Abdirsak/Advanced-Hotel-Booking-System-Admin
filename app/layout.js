import "styles/theme.scss";

//
import NextTopLoader from "nextjs-toploader";

// import theme style scss file
import Wrapper from "layouts/Wrapper";

//

export const metadata = {
  title: "Dash UI - Next.Js Admin Dashboard Template",
  description:
    "Dash UI - Next JS admin dashboard template is free and available on GitHub. Create your stunning web apps with our Free Next js template. An open-source admin dashboard built using the new router, server components, and everything new in Next.js 13.",
  keywords:
    "Dash UI, Next.js 13, Admin dashboard, admin template, web apps, bootstrap 5, admin theme",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-light">
        <NextTopLoader
          color="#E7AB4E"
          initialPosition={0.08}
          crawlSpeed={200}
          height={4}
          crawl={true}
          showSpinner={false}
          easing="ease"
          speed={200}
          shadow="0 0 10px #ff5a5f,0 0 5px #ff5a5f"
        />
        <Wrapper>{children}</Wrapper>
      </body>
    </html>
  );
}
