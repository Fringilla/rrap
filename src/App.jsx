import { useState } from 'react';
import {
    Box,
    Button,
    Stack,
    Text,
} from '@chakra-ui/react';
import { RecipeListPage } from './pages/RecipeListPage';
import { RecipePage } from './pages/RecipePage';
import { useColorMode } from './components/ui/color-mode';
import { recipeColorThemes } from './components/ui/theme-tokens';
import { data } from './utils/data';

const recipeItems = data.hits.map((hit, index) => {
    const item = { key: hit.recipe.label, index: index, ...hit.recipe };
    return item;
});

const AppearanceSettingsModal = ({ isOpen, onClose }) => {
    const { selectedTheme, setColorMode, colorMode } = useColorMode();
    const themeColors = recipeColorThemes[colorMode === 'dark' ? 'dark' : 'light'];

    if (!isOpen) return null;

    return (
        <Box
            position="fixed"
            inset={0}
            bg={themeColors.overlayBg}
            zIndex="overlay"
            display="flex"
            alignItems="center"
            justifyContent="center"
            px={4}
            onClick={onClose}
        >
            <Box
                bg={themeColors.surface}
                borderRadius="md"
                p={6}
                w="100%"
                maxW="420px"
                onClick={(event) => event.stopPropagation()}
            >
                <Text fontSize="lg" fontWeight="semibold" mb={2} color={themeColors.pageText}>
                    Appearance settings
                </Text>
                <Text fontSize="sm" color={themeColors.mutedText} mb={4}>
                    Choose how the app should look. Your preference is saved for this browser.
                </Text>

                <Stack direction="column" spacing={3}>
                    {['light', 'dark', 'system'].map((option) => (
                        <Button
                            key={option}
                            variant={selectedTheme === option ? 'solid' : 'outline'}
                            onClick={() => {
                                setColorMode(option);
                            }}
                        >
                            {option.charAt(0).toUpperCase() + option.slice(1)}
                        </Button>
                    ))}
                </Stack>

                <Button mt={6} onClick={onClose}>
                    Close
                </Button>
            </Box>
        </Box>
    );
};

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

            <AppearanceSettingsModal
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