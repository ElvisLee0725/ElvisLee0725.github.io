// Milestone 3 contact placeholder — replaces the old broken SendGrid form.
// Isolated on purpose: Milestone 7 swaps only this file's internals (e.g. for
// a Formspree/Web3Forms form) without touching Contact.jsx or Footer.jsx.
export default function ContactCta() {
  return (
    <a
      className="btn btn-outline-theme-red btn-sm contactBtn contact-cta-btn"
      href="mailto:elvislee0725@gmail.com?subject=Portfolio%20Inquiry"
    >
      Get in Touch
    </a>
  );
}
