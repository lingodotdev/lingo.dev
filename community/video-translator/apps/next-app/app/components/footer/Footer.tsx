import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <h3 className={styles.title}>Lingo.video</h3>
        <ul className={styles.links}>
          <li>
            <a
              href="https://www.linkedin.com/in/shubham-oulkar"
              target="_blank"
              rel="noopener"
            >
              LinkedIn
            </a>
          </li>
          <li>
            <a
              href="https://www.frontendmentor.io/profile/ShubhamOulkar"
              target="_blank"
              rel="noopener"
            >
              Frontend Mentor
            </a>
          </li>
          <li>
            <a href="https://x.com/shubhuoulkar" target="_blank" rel="noopener">
              X
            </a>
          </li>
          <li>
            <a
              href="https://github.com/ShubhamOulkar/lingo.video"
              target="_blank"
              rel="noopener"
            >
              GitHub – lingo.video
            </a>
          </li>
        </ul>
        <p className={styles.copy}>
          © 2025 Shubham Oulkar. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
