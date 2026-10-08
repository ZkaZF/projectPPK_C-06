
const fs = require('fs'); 
let c = fs.readFileSync('frontend/src/pages/user/DashboardPage.tsx', 'utf8'); 
c = c.replace(/background: color \+ "20",[\s\S]*?color:[\s\S]*?display: "flex"/g, 'background: "var(--primary-bg)",\n        color: "var(--primary)",\n        display: "flex"'); 
fs.writeFileSync('frontend/src/pages/user/DashboardPage.tsx', c);

