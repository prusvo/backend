import RecipeBox from "../models/Recipe.js";

class RecipePage {
  async saveRecipe(req, res) {
    try {
      const { dishName, ingredients } = req.body;
      const newRecipe = new RecipeBox({ dishName, ingredients });
      await newRecipe.save();
      res.json({ message: "Recipe was saved" });
    } catch (error) {
      console.error('Error saving recipe:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  async getRecipe(req, res) {
    try {
      const recipes = await RecipeBox.find();
      res.json(recipes);
    } catch (error) {
      console.error('Error getting recipes:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  async deleteRecipe(req, res) {
    const { _id } = req.body;
    try {
      const deletedRecipe = await RecipeBox.findByIdAndDelete(_id);
      if (!deletedRecipe) {
        return res.status(404).json({ error: 'Recipe not found' });
      }
      res.json({ message: 'Delete success' });
    } catch (error) {
      console.error('Error deleting recipe:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  async updateRecipe(req, res) {
    try {
      const { _id, newDishName, newIngredients } = req.body;
      await RecipeBox.findByIdAndUpdate(_id, { dishName: newDishName, ingredients: newIngredients });
      res.json({ message: 'Update success' });
    } catch (error) {
      console.error('Error updating recipe:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  async addIngredient(req, res) {
    try {
      const { _id, newIngredient } = req.body;
      await RecipeBox.findByIdAndUpdate(_id, { $push: { ingredients: newIngredient } });
      res.json({ message: 'Ingredient added successfully' });
    } catch (error) {
      console.error('Error adding ingredient:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
  async deleteIngredient (req, res)  {
    try {
      const { recipeId, ingredientId } = req.params;
  
      // Ваш код для видалення інгредієнта за id
      await RecipeBox.findByIdAndUpdate(recipeId, { $pull: { ingredients: { _id: ingredientId } } });
  
      res.json({ message: 'Ingredient deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error deleting ingredient' });
      
    }
  }
  async getIngredient (req, res) {
    try {
      const recipes = await Recipe.find();
      res.json(recipes);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
    }
    async addNewIngredient   (req, res)  {
        try {
          const newRecipe = new Recipe(req.body);
          const savedRecipe = await newRecipe.save();
          res.status(201).json(savedRecipe);
        } catch (error) {
          res.status(500).json({ error: 'Internal Server Error' });
        }
    }
    async searchRecipe(req, res) {
      try {
        const { query } = req.query;
        const recipes = await RecipeBox.find({ dishName: { $regex: query, $options: 'i' } });
        res.json(recipes);
      } catch (error) {
        console.error('Error searching recipes:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    }
    
}

export default new RecipePage();
