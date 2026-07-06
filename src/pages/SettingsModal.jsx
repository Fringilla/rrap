import { Box, Text, Stack, Button } from '@chakra-ui/react';
import { useColorMode } from '../components/ui/color-mode';
import { recipeColorThemes } from '../components/ui/theme-tokens';

export const SettingsModal = ({ isOpen, onClose }) => {
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
