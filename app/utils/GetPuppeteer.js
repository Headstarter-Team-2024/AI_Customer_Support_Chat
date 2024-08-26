
export const getPuppeteer = async () => {
    let puppeteer;
    let chromium = null;
      //if not deployed aws lambda function will be undefined and we can use puppeteer directly
    if (process.env.NODE_ENV==='production') {
   
      chromium = (await import('@sparticuz/chromium')).default;
      chromium.setHeadlessMode = true;

      puppeteer = (await import('puppeteer-core')).default;
    } else {
      puppeteer = (await import('puppeteer')).default;
    }
  
    return { puppeteer, chromium };
  };