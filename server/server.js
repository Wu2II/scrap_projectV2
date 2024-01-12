const { Cluster } = require('puppeteer-cluster');

const { insert_all } = require('./mongodb.js');



console.time('Execution Time');
const jsonData = require('./file.json');

(async () => {
  
    // Create a cluster with 2 workers
    const cluster = await Cluster.launch({
        concurrency: Cluster.CONCURRENCY_CONTEXT,
        maxConcurrency: 2,
    });

    const objectTab = []; 
    class Site_info  {}

    for (const site of jsonData.liste_site) {
        objectTab.push(site)
      const url = site.url
      const grid = site.grid
      const brand = site.brand
      const description = site.description
      const reduction = site.reduction
      const price = site.price
      const img = site.img
       
      
   
        
      
        cluster.queue({url,grid,brand,description,price,reduction,img});
       
}



    // Define a task (in this case: screenshot of page)
   await cluster.task(async ({ page, data:{url,grid,brand,description,price,reduction,img}}) => {
        await page.setUserAgent('Mozilla/5.0 (Windows NT 5.1; rv:5.0) Gecko/20100101 Firefox/5.0')
        await page.goto(url,{waitUntil: "networkidle0",});
        //await page.waitForTimeout(3000) 
        console.log(grid)
        

        const result = await page.evaluate(async (grid,brand,description,price,reduction,img) => {
          await new Promise((resolve) => {
            var totalHeight = 0;
            var distance = 1200;
            var timer = setInterval(() => {
                var scrollHeight = document.body.scrollHeight;
                window.scrollBy(0, distance);
                totalHeight += distance;

                if(totalHeight >= scrollHeight - window.innerHeight){
                    clearInterval(timer);
                    resolve();
                }
            }, 7);
        });
          const productCard = Array.from(document.querySelectorAll(grid)); // page qui n'a pas le temps de xharger ?
          const data = productCard.map((product) => ({
              brandValue: product.querySelector(brand)?.innerText || "No data found",
              descriptionValue: product.querySelector(description)?.innerText || "No data found",
              priceValue: product.querySelector(price)?.innerText || "No data found",
              reductionValue: product.querySelector(reduction)?.innerText || null,
              imgValue : product.querySelector(img).getAttribute('src').match(/\bhttps?:\/\/\S+/gi).toString() || "No data found" 
          }));

        
        
        

    
      
 
  
          
          return data; 
      }, grid,brand,description,price,reduction,img);
      
       // console.log("blabla de la fonction ",(result), grid)
        const DataProductJSON = result


        
       insert_all(DataProductJSON)
        
        
        
        const path = url.replace(/[^a-zA-Z]/g, '_') + '.png';
        await page.screenshot({ path });
        console.log(`Screenshot of ${url} saved: ${path}`);

        //module.exports.DataProductJSON = DataProductJSON
    });
   
    
    // Add some pages to queue
    //cluster.queue();
    //cluster.queue('https://www.wikipedia.org');
    //cluster.queue('https://github.com/');

    // Shutdown after everything is done
     await cluster.idle();
    await cluster.close();
    console.timeEnd('Execution Time');
})();

// Pour que le fichier data.json affiche tous les azrticles, il faudra concaténer les différents tableaux pour en former qu'ub n seul