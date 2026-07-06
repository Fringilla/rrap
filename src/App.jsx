import { useState } from 'react';
import {
    Box,
    Button,
} from '@chakra-ui/react';
import { RecipeListPage } from './pages/RecipeListPage';
import { RecipePage } from './pages/RecipePage';
import { SettingsModal } from './pages/SettingsModal';
import { useColorMode } from './components/ui/color-mode';
import { recipeColorThemes } from './components/ui/theme-tokens';
import { data } from './utils/data';

const recipeItems = data.hits.map((hit, index) => {
    const item = { key: hit.recipe.label, index: index, ...hit.recipe };
    return item;
});

export const App = () => {
    const [selectedRecipe, setSelectedRecipe] = useState(null);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const { colorMode } = useColorMode();
    const themeColors = recipeColorThemes[colorMode === 'dark' ? 'dark' : 'light'];

    return (
        <Box minH="100vh" bg={themeColors.pageBg}>

            <Box display="flex" justifyContent="flex-end" px={4} pt={4}>
                <Button variant="outline" size="sm" onClick={() => setIsSettingsOpen(true)}>
                    Settings
                </Button>
            </Box>

            <SettingsModal
                isOpen={isSettingsOpen}
                onClose={() => setIsSettingsOpen(false)}
            />

            {selectedRecipe ? (
                <RecipePage recipe={selectedRecipe} onReturn={setSelectedRecipe} />
            ) : (
                <RecipeListPage recipes={recipeItems} onSelectRecipe={setSelectedRecipe} />
            )}
        </Box>
    );
};