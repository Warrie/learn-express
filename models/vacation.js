var mongoose =require('mongoose');
var vacationSchema =mongoose.Schema({
  name:String,
  slug:String,
  category:String,
  sku:String,
  description:String,
  priceIncents: Number,
  tags:[String],
  inSeason:Boolean,
  maximumGuests:Number,
  notes:String,
  packageSold:Number,
});

vacationSchema.methods.getDisplayPrice=function(){
  return '$'+(this.priceIncents/100).toFixed(2);
}

var Vacation =mongoose.model('Vacation',vacationSchema);
module.exports=Vacation;