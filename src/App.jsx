import { useState } from 'react';
import { RecipeListPage } from './pages/RecipeListPage';
import { RecipePage } from './pages/RecipePage';
import { data } from './utils/data';

const recipeItems = data.hits.map((hit, index) => {
    const item = { key: hit.recipe.label, index: index, ...hit.recipe }; 
    return item; 
});
const setSelectedRecipe = (recipe) => {
    selectedRecipe = recipe;
};
export const App = () => {
    const [selectedRecipe, setSelectedRecipe] = useState(null);

    return (
        <>
            {selectedRecipe ? (
                <RecipePage recipe={selectedRecipe} onReturn={setSelectedRecipe} />
            ) : (
                <RecipeListPage recipes={recipeItems} onSelectRecipe={setSelectedRecipe} />
            )}
        </>
    );
};