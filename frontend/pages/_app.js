import App from "next/app"
import Head from "next/head"
import Layout from "../components/Layout"
import { getCategories } from "../utils/api"
import "../styles/index.css"

const MyApp = ({ Component, pageProps }) => {
  return (
    <Layout categories={pageProps.categories}>
      <Head>
        <script
          src="https://code.jquery.com/jquery-3.6.0.slim.min.js"
          integrity="sha256-u7e5khyithlIdTpu22PHhENmPcRdFiHRjhAuHcs05RI="
          crossOrigin="anonymous"
        />
      </Head>
      <Component {...pageProps} />
      <div id="modal-root"></div>
      <script src={`${process.env.NEXT_PUBLIC_STRAPI_API_URL || "http://localhost:1337"}/xrp-cart/public/xrp-cart-init`} />
    </Layout>
  )
}

// getInitialProps disables automatic static optimization for pages that don't
// have getStaticProps. So [[...slug]] pages still get SSG.
// Hopefully we can replace this with getStaticProps once this issue is fixed:
// https://github.com/vercel/next.js/discussions/10949
MyApp.getInitialProps = async (ctx) => {
  // Calls page's `getInitialProps` and fills `appProps.pageProps`
  const appProps = await App.getInitialProps(ctx)
  // Fetch global site settings from Strapi
  const categories = await getCategories()
  // Pass the data to our page via props
  return { ...appProps, pageProps: { categories, path: ctx.pathname } }
}

export default MyApp
