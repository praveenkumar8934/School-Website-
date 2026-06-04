const puppeteer = require('puppeteer-core');
const fs = require('fs');

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
    headless: 'new'
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
    
    console.log('Checking modal styles...');
    // The modal is the inner div with text "Reset Password"
    const results = await page.evaluate(() => {
      const heading = Array.from(document.querySelectorAll('h3')).find(el => el.textContent === 'Reset Password');
      if (!heading) return { error: 'Could not find Reset Password heading' };
      
      const modal = heading.parentElement;
      const overlay = modal.parentElement;
      const paragraph = modal.querySelector('p');
      const input = modal.querySelector('input[type="email"]');
      
      const getStyles = (el) => {
        if (!el) return null;
        const styles = window.getComputedStyle(el);
        return {
          backgroundColor: styles.backgroundColor,
          color: styles.color,
          visibility: styles.visibility,
          opacity: styles.opacity,
          zIndex: styles.zIndex,
          position: styles.position
        };
      };
      
      return {
        overlay: getStyles(overlay),
        modal: getStyles(modal),
        heading: getStyles(heading),
        paragraph: getStyles(paragraph),
        input: getStyles(input)
      };
    });
    
    console.log('Verification Results:');
    console.log(JSON.stringify(results, null, 2));
    
  } catch (err) {
    console.error('Error during verification:', err);
  } finally {
    await browser.close();
  }
})();
