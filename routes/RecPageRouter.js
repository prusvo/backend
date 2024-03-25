import { Router } from "express";
import page from "../data/saveAndGetData.js";
import Recipe from "../models/Recipe.js";


const router = new Router()

router.post('/add', page.saveRecipe)
router.get('/menu', page.getRecipe)
router.post('/delete', page.deleteRecipe)
router.post('/update', page.updateRecipe)
router.post('/addIngredient', page.addIngredient)

router.get('/add', page.getIngredient);
router.post('/add', page.addNewIngredient);
router.delete('/deleteIngredient/:recipeId/:ingredientId',page.deleteIngredient);
router.get('/search', page.searchRecipe);




export default router