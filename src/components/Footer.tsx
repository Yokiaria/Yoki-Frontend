import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <footer className="bg-[#1A2B4C] text-white py-12 mt-auto" id="footer-container">
            <div className="max-w-7xl mx-auto px-4 md:px-8">
                <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex flex-col items-center md:items-start gap-4 text-center md:text-left">
                        <Link
                            to="/"
                            className="font-h1 text-2xl tracking-tight text-white font-black cursor-pointer uppercase select-none hover:opacity-90"
                            id="footer-brand"
                        >
                            GRANDSTARIND
                        </Link>
                        <p className="font-body-md text-white/80 text-sm">
                            © 2024 GRANDSTARIND. Refined Indonesian Hospitality.
                        </p>
                    </div>
                    <nav className="flex flex-wrap justify-center md:justify-end gap-x-8 gap-y-4">
                        <Link
                            to="/"
                            className="font-label-caps text-xs uppercase tracking-wider text-white/80 hover:text-white transition-colors cursor-pointer"
                            id="footer-link-terms"
                        >
                            Terms of Service
                        </Link>
                        <Link
                            to="/"
                            className="font-label-caps text-xs uppercase tracking-wider text-white/80 hover:text-white transition-colors cursor-pointer"
                            id="footer-link-privacy"
                        >
                            Privacy Policy
                        </Link>
                        <Link
                            to="/"
                            className="font-label-caps text-xs uppercase tracking-wider text-white/80 hover:text-white transition-colors cursor-pointer"
                            id="footer-link-help"
                        >
                            Help Center
                        </Link>
                        <Link
                            to="/"
                            className="font-label-caps text-xs uppercase tracking-wider text-white/80 hover:text-white transition-colors cursor-pointer"
                            id="footer-link-contact"
                        >
                            Contact Us
                        </Link>
                    </nav>
                </div>
            </div>
        </footer>
    );
}
