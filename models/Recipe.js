import mongoose, {Schema, model} from "mongoose";

const ingredientSchema = new Schema({
    name: {
      type: String,
      required: true
    },
    amount: {
      type: Number,
      required: true
    },
    unit: {
      type: String,
    }
  });
  
  const recipeSchema = new Schema({
    dishName: {
      type: String,
      required: true
    },
    ingredients: [ingredientSchema]  // Використовуйте правильний ключ тут
  });
  
  const Recipe = mongoose.model('Recipe', recipeSchema);

export default Recipe