export const getPuppeteer = async () => {
    let puppeteer;
    let chrome = null;
      //if not deployed aws lambda function will be undefined and we can use puppeteer directly
    if (process.env.NODE_ENV==='production') {
      chrome = (await import('chrome-aws-lambda')).default;
      puppeteer = (await import('puppeteer-core')).default;
    } else {
      puppeteer = (await import('puppeteer')).default;
    }
  
    return { puppeteer, chrome };
  };