import Head from 'next/head';
import Link from 'next/link';

export default function WelcomePage() {
  return (
    <>
      <Head>
        <title>Welcome to VIMS</title>
        <meta name="description" content="Welcome to the Village Information Management System" />
      </Head>
      <div className="container">
        <h1>Welcome to the Village Information Management System</h1>
        <p>
          The Village Information Management System (VIMS) is designed to streamline and manage various aspects of village
          administration, including record-keeping, reporting, and collaboration.
        </p>
        <p>
          As a registered user of VIMS, you will have access to a range of features and functionalities to facilitate your
          village management tasks.
        </p>
        <div className="cta-buttons">
          <Link href="/login">
            <a className="button">Login</a>
          </Link>
          <Link href="/register">
            <a className="button">Register</a>
          </Link>
        </div>
      </div>
      <style jsx>{`
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 40px;
          text-align: center;
        }

        h1 {
          font-size: 24px;
          margin-bottom: 20px;
        }

        p {
          margin-bottom: 20px;
        }

        .cta-buttons {
          display: flex;
          justify-content: center;
        }

        .button {
          display: inline-block;
          padding: 10px 20px;
          margin: 0 10px;
          font-size: 16px;
          text-decoration: none;
          color: #fff;
          background-color: #0070f3;
          border-radius: 4px;
        }
      `}</style>
    </>
  );
}