const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

(async () => {
  console.log('Starting verification script...');
  
  // Common paths for MS Edge on Windows
  const edgePaths = [
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe'
  ];
  
  let executablePath = edgePaths.find(p => fs.existsSync(p));
  
  if (!executablePath) {
    console.error('Could not find Edge browser to run verification.');
    process.exit(1);
  }

  const browser = await puppeteer.launch({
    executablePath,
    headless: 'new',
    defaultViewport: { width: 1280, height: 800 }
  });
  
  const page = await browser.newPage();
  
  try {
    console.log('Navigating to login page...');
    await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle2' });
    
    console.log('Clicking "Forgot Password?"...');
    const clicked = await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const forgot = btns.find(b => b.textContent.includes('Forgot Password?'));
      if (forgot) {
        forgot.click();
        return true;
      }
      return false;
    });
    
    if (!clicked) {
      console.log('Could not find Forgot Password button!');
      await browser.close();
      return;
    }
    
    // Wait for the modal animation (AnimatePresence)
    await new Promise(r => setTimeout(r, 1000));
    
    console.log('Taking screenshot...');
    // Copy screenshot to artifacts so it can be embedded in markdown
    const artifactsDir = 'C:\\Users\\pk595\\.gemini\\antigravity-ide\\brain\\b1405e0c-5969-4637-bd57-217d6bfeb4e5\\scratch';
    if (!fs.existsSync(artifactsDir)) {
      fs.mkdirSync(artifactsDir, { recursive: true });
    }
    const screenshotPath = path.join(artifactsDir, 'forgot-password-pink.png');
    await page.screenshot({ path: screenshotPath, fullPage: true });
    
    console.log(`Screenshot saved to: ${screenshotPath}`);
    
  } catch (err) {
    console.error('Error during verification:', err);
  } finally {
    await browser.close();
  }
})();
