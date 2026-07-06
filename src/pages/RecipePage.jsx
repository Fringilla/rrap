import { Box, Button, Heading, Image, Stack, Text, Badge, SimpleGrid } from '@chakra-ui/react';
import { useColorMode } from '../components/ui/color-mode';
import { recipeColorThemes } from '../components/ui/theme-tokens';

export const RecipePage = ({ recipe, onReturn }) => {
    const { colorMode } = useColorMode();
    const themeColors = recipeColorThemes[colorMode === 'dark' ? 'dark' : 'light'];

    const nutrients = recipe.totalNutrients || {};
    const getNutrient = (key) => {
        const entry = nutrients[key];
        return entry ? Math.round(entry.quantity) + ' ' + (entry.unit || '') : 'N/A';
    };

    return (
        <Box px={{ base: 4, md: 8 }} py={6} bg={themeColors.pageBg} minH="100vh">
            <Box maxW="1200px" mx="auto">
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
                    <Heading as="h2" size="lg" color={themeColors.heading}>
                        {recipe.label}
                    </Heading>
                    <Button size="sm" variant="outline" onClick={() => onReturn(null)}>
                        Back
                    </Button>
                </Box>

                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                    <Box>
                        <Image src={recipe.image} alt={recipe.label} borderRadius="md" w="100%" h="420px" objectFit="cover" />
                        <Stack direction="row" spacing={2} mt={3} wrap="wrap">
                            {(recipe.mealType || []).map((m) => (
                                <Badge key={m} bg={themeColors.mealBg} color={themeColors.mealText} border="1px solid" borderColor={themeColors.mealBorder}>
                                    {m}
                                </Badge>
                            ))}
                            {(recipe.dishType || []).map((d) => (
                                <Badge key={d} bg={themeColors.dishBg} color={themeColors.dishText} border="1px solid" borderColor={themeColors.dishBorder}>
                                    {d}
                                </Badge>
                            ))}
                            <Badge bg={themeColors.dishBg} color={themeColors.dishText} border="1px solid" borderColor={themeColors.dishBorder}>
                                Time: {recipe.totalTime || recipe.totalCookingTime || 'N/A'} mins
                            </Badge>
                            <Badge bg={themeColors.dietaryBg} color={themeColors.dietaryText} border="1px solid" borderColor={themeColors.dietaryBorder}>
                                {((recipe.dietLabels && recipe.dietLabels.join(', ')) || (recipe.healthLabels && recipe.healthLabels.includes('Vegan') ? 'Vegan' : '')) || 'Diet'}
                            </Badge>
                        </Stack>

                        <Box mt={4}>
                            <Text fontWeight="semibold" color={themeColors.pageText} mb={2}>Health labels</Text>
                            <Stack direction="row" wrap="wrap" spacing={2}>
                                {(recipe.healthLabels || []).map((h) => (
                                    <Badge key={h} bg={themeColors.dietaryBg} color={themeColors.dietaryText} border="1px solid" borderColor={themeColors.dietaryBorder}>
                                        {h}
                                    </Badge>
                                ))}
                            </Stack>
                        </Box>

                        <Box mt={4}>
                            <Text fontWeight="semibold" color={themeColors.pageText} mb={2}>Cautions</Text>
                            <Stack direction="row" wrap="wrap" spacing={2}>
                                {(recipe.cautions && recipe.cautions.length ? recipe.cautions : ['None']).map((c) => (
                                    <Badge key={c} bg={themeColors.cautionBg} color={themeColors.cautionText} border="1px solid" borderColor={themeColors.cautionBorder}>
                                        {c}
                                    </Badge>
                                ))}
                            </Stack>
                        </Box>
                    </Box>

                    <Box ml={2}>
                        <Text fontSize="md" color={themeColors.pageText} mb={2}><strong>Servings:</strong> {recipe.yield || 'N/A'}</Text>


                        <Box mb={4}>
                            <Text fontWeight="semibold" color={themeColors.pageText} mb={2}>Ingredients</Text>
                            <Stack as="ul" pl={4} spacing={1}>
                                {(recipe.ingredientLines || []).map((ing, i) => (
                                    <Box as="li" key={i} color={themeColors.pageText}>{ing}</Box>
                                ))}
                            </Stack>
                        </Box>

                        <Box borderTop="1px solid" borderColor={themeColors.surfaceBorder} mb={4} />

                        <Box>
                            <Text fontWeight="semibold" color={themeColors.pageText} mb={2}>Total nutrients</Text>
                            <Stack spacing={1}>
                                <Text color={themeColors.pageText}>Energy: {getNutrient('ENERC_KCAL')}</Text>
                                <Text color={themeColors.pageText}>Protein: {getNutrient('PROCNT')}</Text>
                                <Text color={themeColors.pageText}>Fat: {getNutrient('FAT')}</Text>
                                <Text color={themeColors.pageText}>Carbs: {getNutrient('CHOCDF')}</Text>
                                <Text color={themeColors.pageText}>Cholesterol: {getNutrient('CHOLE')}</Text>
                                <Text color={themeColors.pageText}>Sodium: {getNutrient('NA')}</Text>
                            </Stack>
                        </Box>
                    </Box>
                </SimpleGrid>
            </Box>
        </Box>
    );
};