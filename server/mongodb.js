const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/test');

const productSchema = mongoose.Schema({
  descriptionValue: String,
   priceValue: String, 
   reductionValue: String,
   brandValue: String,
   imgValue: String
})

const product = mongoose.model('product', productSchema);

//const delete_all = await product.deleteMany({}) //mettre ce code dans une fonction exportable et lancer la fonction au debut dans test2.js pour ainsi supprimer toute les données a chaque relance du programme
    
     exports.insert_all = async function (dataJSON) {
      
      const all = dataJSON
      product.insertMany(all)
    }; 
    
  /*  async function insert_all(dataJSON){
    const all = dataJSON
      product.insertMany(all)
   }
     
   export {insert_all}
 */
  //const kitty = new product (all);
  //kitty.save().then(() => console.log('meow'));
  