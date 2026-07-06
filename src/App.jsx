import { useState } from 'react';
import {
    Box,
    Button,
    Heading,
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
    const [selectedRecipe, setSelectedRecipe] = useState(null, () => {
        window.scrollTo(0, 0);
    });
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const { colorMode } = useColorMode();
    const themeColors = recipeColorThemes[colorMode === 'dark' ? 'dark' : 'light'];

    return (
        <Box minH="100vh" bg={themeColors.pageBg}>

            <Box
                as="header"
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                px={4}
                pt={4}
                pb={2}
                maxW="1200px"
                mx="auto"
            >
                <Heading as="h1" size="lg" color={themeColors.heading} m={0}>
                    React Recipe App Project
                </Heading>

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