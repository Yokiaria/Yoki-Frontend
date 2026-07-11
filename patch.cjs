const fs = require('fs');
const path = require('path');
const srcDir = path.join(process.cwd(), 'src');

function patchFile(file, patcher) {
  const filepath = path.join(srcDir, file);
  if (!fs.existsSync(filepath)) return;
  const content = fs.readFileSync(filepath, 'utf8');
  const newContent = patcher(content);
  if (content !== newContent) {
    fs.writeFileSync(filepath, newContent);
    console.log('Patched ' + file);
  }
}

// 1. Header.tsx
patchFile('components/Header.tsx', c => {
  let res = c.replace(/import \{ ActiveTab.*\} from '\.\.\/types';/, 'import { UserProfile } from \'../types\';\nimport { useNavigate, useLocation } from \'react-router-dom\';');
  res = res.replace(/activeTab: ActiveTab;/g, '');
  res = res.replace(/setActiveTab: \(tab: ActiveTab\) => void;/g, '');
  res = res.replace(/activeTab,\s*setActiveTab,/g, '');
  res = res.replace(/const isScrolled =/g, 'const navigate = useNavigate();\n    const location = useLocation();\n    const activeTab = location.pathname.substring(1) || \'home\';\n    const isScrolled =');
  res = res.replace(/setActiveTab\('home'\)/g, 'navigate(\'/\')');
  res = res.replace(/setActiveTab\('search'\)/g, 'navigate(\'/search\')');
  res = res.replace(/setActiveTab\('promosi'\)/g, 'navigate(\'/promosi\')');
  res = res.replace(/setActiveTab\('auth-login'\)/g, 'navigate(\'/login\')');
  res = res.replace(/setActiveTab\('auth-register'\)/g, 'navigate(\'/register\')');
  res = res.replace(/setActiveTab\('dashboard'\)/g, 'navigate(\'/dashboard\')');
  res = res.replace(/setActiveTab\('wallet'\)/g, 'navigate(\'/wallet\')');
  return res;
});

// 2. Footer.tsx
patchFile('components/Footer.tsx', c => {
  let res = c.replace(/import \{ ActiveTab \} from '\.\.\/types';/, 'import { Link } from \'react-router-dom\';');
  res = res.replace(/setActiveTab: \(tab: ActiveTab\) => void;/g, '');
  res = res.replace(/setActiveTab\s*,?/g, '');
  res = res.replace(/export default function Footer\(\{\s*\}\: FooterProps\)/g, 'export default function Footer()');
  res = res.replace(/<button onClick=\{.*?setActiveTab\('home'\).*?>/g, '<Link to=\"/\">');
  res = res.replace(/<button onClick=\{.*?setActiveTab\('search'\).*?>/g, '<Link to=\"/search\">');
  res = res.replace(/<button onClick=\{.*?setActiveTab\('promosi'\).*?>/g, '<Link to=\"/promosi\">');
  res = res.replace(/<\/button>/g, '</Link>'); // Note: only works if no other buttons exist
  return res;
});

// 3. LandingPage.tsx
patchFile('components/LandingPage.tsx', c => {
  let res = c.replace(/import \{ ActiveTab \} from '\.\.\/types';/, 'import { useNavigate } from \'react-router-dom\';');
  res = res.replace(/setActiveTab: \(tab: ActiveTab\) => void;/g, '');
  res = res.replace(/setActiveTab,/g, '');
  res = res.replace(/const \[searchType/g, 'const navigate = useNavigate();\n    const [searchType');
  res = res.replace(/setActiveTab\('search'\)/g, 'navigate(\'/search\')');
  res = res.replace(/setActiveTab\('detail'\)/g, 'navigate(`/hotel/${hotelId}`)');
  return res;
});

// 4. SearchResults.tsx
patchFile('components/SearchResults.tsx', c => {
  let res = c.replace(/import \{ ActiveTab.*\} from '\.\.\/types';/, 'import { Hotel, Flight } from \'../types\';\nimport { useNavigate } from \'react-router-dom\';');
  res = res.replace(/setActiveTab: \(tab: ActiveTab\) => void;/g, '');
  res = res.replace(/setActiveTab,/g, '');
  res = res.replace(/const \[isLoadingFlights/g, 'const navigate = useNavigate();\n    const [isLoadingFlights');
  res = res.replace(/setActiveTab\('detail'\)/g, 'navigate(`/hotel/${hotelId}`)');
  res = res.replace(/setActiveTab\('checkout'\)/g, 'navigate(`/checkout`)');
  return res;
});

// 5. Auth.tsx
patchFile('components/Auth.tsx', c => {
  let res = c.replace(/import \{ ActiveTab.*\} from '\.\.\/types';/, 'import { UserProfile } from \'../types\';\nimport { useNavigate } from \'react-router-dom\';');
  res = res.replace(/activeTab: ActiveTab;/g, '');
  res = res.replace(/setActiveTab: \(tab: ActiveTab\) => void;/g, '');
  res = res.replace(/export default function Auth\(\{(.*?)\}?: AuthProps\) {/g, 'export default function Auth({ isLogin, setUser, onSuccessToast, onErrorToast }: { isLogin: boolean, setUser: any, onSuccessToast: any, onErrorToast: any }) {');
  res = res.replace(/const isLogin = activeTab === 'auth-login';/g, 'const navigate = useNavigate();');
  res = res.replace(/setActiveTab\('home'\)/g, 'navigate(\'/\')');
  res = res.replace(/setActiveTab\('auth-register'\)/g, 'navigate(\'/register\')');
  res = res.replace(/setActiveTab\('auth-login'\)/g, 'navigate(\'/login\')');
  return res;
});

// 6. Dashboard.tsx
patchFile('components/Dashboard.tsx', c => {
  let res = c.replace(/import \{ ActiveTab.*\} from '\.\.\/types';/, 'import { Booking, UserProfile } from \'../types\';\nimport { useNavigate } from \'react-router-dom\';');
  res = res.replace(/setActiveTab: \(tab: ActiveTab\) => void;/g, '');
  res = res.replace(/setActiveTab,/g, '');
  res = res.replace(/const handleLogout =/g, 'const navigate = useNavigate();\n    const handleLogout =');
  res = res.replace(/setActiveTab\('home'\)/g, 'navigate(\'/\')');
  res = res.replace(/setActiveTab\('search'\)/g, 'navigate(\'/search\')');
  res = res.replace(/setActiveTab\('wallet'\)/g, 'navigate(\'/wallet\')');
  res = res.replace(/setActiveTab\('detail'\)/g, 'navigate(`/hotel/${hotelId}`)');
  res = res.replace(/setActiveTab\('checkin'\)/g, 'navigate(`/checkin/${hotelId}`)');
  return res;
});

// 7. WriteReview.tsx
patchFile('components/WriteReview.tsx', c => {
  let res = c.replace(/import \{ ActiveTab.*\} from '\.\.\/types';/, 'import { Hotel } from \'../types\';\nimport { useNavigate } from \'react-router-dom\';');
  res = res.replace(/setActiveTab: \(tab: ActiveTab\) => void;/g, '');
  res = res.replace(/setActiveTab,/g, '');
  res = res.replace(/const \[rating/g, 'const navigate = useNavigate();\n    const [rating');
  res = res.replace(/setActiveTab\('detail'\)/g, 'navigate(-1)'); // just go back
  return res;
});

// 8. CheckInOnline.tsx
patchFile('components/CheckInOnline.tsx', c => {
  let res = c.replace(/import \{ ActiveTab.*\} from '\.\.\/types';/, 'import { Hotel, UserProfile } from \'../types\';\nimport { useNavigate } from \'react-router-dom\';');
  res = res.replace(/setActiveTab: \(tab: ActiveTab\) => void;/g, '');
  res = res.replace(/setActiveTab\s*,?/g, '');
  res = res.replace(/const \[step/g, 'const navigate = useNavigate();\n    const [step');
  res = res.replace(/setActiveTab\('dashboard'\)/g, 'navigate(\'/dashboard\')');
  return res;
});

// 9. WalletTopUp.tsx
patchFile('components/WalletTopUp.tsx', c => {
  let res = c.replace(/import \{ ActiveTab.*\} from '\.\.\/types';/, 'import { UserProfile } from \'../types\';\nimport { useNavigate } from \'react-router-dom\';');
  res = res.replace(/setActiveTab: \(tab: ActiveTab\) => void;/g, '');
  res = res.replace(/setActiveTab,/g, '');
  res = res.replace(/const \[amount/g, 'const navigate = useNavigate();\n    const [amount');
  res = res.replace(/setActiveTab\('home'\)/g, 'navigate(\'/\')');
  res = res.replace(/setActiveTab\('dashboard'\)/g, 'navigate(\'/dashboard\')');
  return res;
});

// 10. Promosi.tsx
patchFile('components/Promosi.tsx', c => {
  let res = c.replace(/import \{ ActiveTab.*\} from '\.\.\/types';/, 'import { Promo } from \'../types\';\nimport { useNavigate } from \'react-router-dom\';');
  res = res.replace(/setActiveTab: \(tab: ActiveTab\) => void;/g, '');
  res = res.replace(/setActiveTab,/g, '');
  res = res.replace(/const handleCopy =/g, 'const navigate = useNavigate();\n    const handleCopy =');
  res = res.replace(/setActiveTab\('search'\)/g, 'navigate(\'/search\')');
  return res;
});

// 11. Checkout.tsx
patchFile('components/Checkout.tsx', c => {
  let res = c.replace(/import \{ ActiveTab.*\} from '\.\.\/types';/, 'import { Hotel, Flight, Booking, UserProfile } from \'../types\';\nimport { useNavigate, useLocation } from \'react-router-dom\';');
  res = res.replace(/setActiveTab: \(tab: ActiveTab\) => void;/g, '');
  res = res.replace(/setActiveTab,/g, '');
  res = res.replace(/const \[paymentMethod/g, 'const navigate = useNavigate();\n    const location = useLocation();\n    // If hotel is passed via state, use it (optional depending on how we route)\n    const stateHotel = location.state?.hotel;\n    const activeHotel = stateHotel || hotel;\n    const [paymentMethod');
  res = res.replace(/setActiveTab\('dashboard'\)/g, 'navigate(\'/dashboard\')');
  res = res.replace(/setActiveTab\('detail'\)/g, 'navigate(-1)');
  return res;
});

console.log('Patching complete.');
