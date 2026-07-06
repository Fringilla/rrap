import { useState } from 'react';
import {
    Badge,
    Box,
    Heading,
    Image,
    Input,
    SimpleGrid,
    Stack,
    Text,
} from '@chakra-ui/react';
import { useColorMode } from '../components/ui/color-mode';
import { recipeColorThemes } from '../components/ui/theme-tokens';

export const RecipeListPage = ({ recipes, onSelectRecipe }) => {
    const [search, setSearch] = useState('');
    const [activeFilters, setActiveFilters] = useState([]);
    const { colorMode } = useColorMode();
    const themeColors = recipeColorThemes[colorMode === 'dark' ? 'dark' : 'light'];

    const toggleFilter = (value, kind) => {
        setActiveFilters((current) => {
            const normalizedValue = value?.toLowerCase();
            const exists = current.some((filter) => filter.value.toLowerCase() === normalizedValue && filter.kind === kind);

            if (exists) {
                return current.filter((filter) => !(filter.value.toLowerCase() === normalizedValue && filter.kind === kind));
            }

            return [...current, { value, kind }];
        });
    };

    const getDietaryFlags = (recipe) => {
        const healthLabels = recipe.healthLabels || [];
        const isVegan = Boolean(recipe.vegan || healthLabels.includes('Vegan'));
        const isVegetarian = Boolean(!isVegan && healthLabels.includes('Vegetarian'));

        return { isVegan, isVegetarian };
    };

    const filteredRecipes = recipes.filter((recipe) => {
        const query = search.toLowerCase().trim();
        const { isVegan, isVegetarian } = getDietaryFlags(recipe);

        const matchesQuery = !query
            ? true
            : [
                  recipe.label,
                  recipe.mealType?.join(' '),
                  recipe.dishType?.join(' '),
                  recipe.cautions?.join(' '),
                  recipe.healthLabels?.join(' '),
              ]
                  .filter(Boolean)
                  .join(' ')
                  .toLowerCase()
                  .includes(query);

        const matchesFilter = activeFilters.length === 0
            ? true
            : activeFilters.every((filterItem) => {
                  const filterValue = filterItem.value.toLowerCase();
                  const mealType = recipe.mealType?.[0]?.toLowerCase();
                  const dishType = recipe.dishType?.[0]?.toLowerCase();
                  const cautions = (recipe.cautions || []).map((item) => item.toLowerCase());

                  switch (filterItem.kind) {
                      case 'dietary':
                          if (filterValue === 'vegan') return isVegan;
                          if (filterValue === 'vegetarian') return isVegetarian;
                          if (filterValue === 'not vegan') return !isVegan && !isVegetarian;
                          return false;
                      case 'mealType':
                          return filterValue === mealType;
                      case 'dishType':
                          return filterValue === dishType;
                      case 'caution':
                          return cautions.includes(filterValue);
                      default:
                          return false;
                  }
              });

        return matchesQuery && matchesFilter;
    });

    return (
        <Box minH="100vh" px={{ base: 4, md: 8 }} py={8} bg={themeColors.pageBg}>
            <Heading as="h1" size="lg" mb={4} textAlign="center" color={themeColors.heading}>
                React Recipe App Project
            </Heading>

            <Box maxW="540px" mx="auto" mb={4}>
                <Input
                    placeholder="Search recipes"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    bg={themeColors.inputBg}
                    color={themeColors.pageText}
                    borderColor={themeColors.inputBorder}
                    _placeholder={{ color: themeColors.inputPlaceholder }}
                />
            </Box>

            {activeFilters.length > 0 && (
                <Box maxW="540px" mx="auto" mb={8}>
                    <Stack direction="row" wrap="wrap" spacing={2}>
                        {activeFilters.map((filter) => {
                            const normalizedFilter = filter.value.toLowerCase();
                            const isDietaryFilter = filter.kind === 'dietary';
                            const isCautionFilter = filter.kind === 'caution';
                            const isMealTypeFilter = filter.kind === 'mealType';
                            const isDishTypeFilter = filter.kind === 'dishType';

                            return (
                                <Badge
                                    key={`${filter.kind}-${filter.value}`}
                                    bg={isDietaryFilter ? themeColors.dietaryBg : isCautionFilter ? themeColors.cautionBg : isDishTypeFilter ? themeColors.dishBg : themeColors.mealBg}
                                    color={isDietaryFilter ? themeColors.dietaryText : isCautionFilter ? themeColors.cautionText : isDishTypeFilter ? themeColors.dishText : themeColors.mealText}
                                    border="1px solid"
                                    borderColor={isDietaryFilter ? themeColors.dietaryBorder : isCautionFilter ? themeColors.cautionBorder : isDishTypeFilter ? themeColors.dishBorder : themeColors.mealBorder}
                                    cursor="pointer"
                                    onClick={() => toggleFilter(filter.value, filter.kind)}
                                >
                                    {filter.value} ✕
                                </Badge>
                            );
                        })}
                    </Stack>
                </Box>
            )}

            <SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} spacing={6}>
                {filteredRecipes.length > 0 ? (
                    filteredRecipes.map((recipe) => {
                        const { isVegan, isVegetarian } = getDietaryFlags(recipe);

                        return (
                            <Box
                                key={recipe.key}
                                onClick={() => onSelectRecipe(recipe)}
                                borderWidth="1px"
                                borderRadius="xl"
                                borderColor={themeColors.surfaceBorder}
                                m={2}
                                overflow="hidden"
                                bg={themeColors.surface}
                                boxShadow="md"
                                cursor="pointer"
                                transition="transform 0.2s, box-shadow 0.2s"
                                _hover={{ transform: 'translateY(-2px)', boxShadow: 'lg' }}
                            >
                                <Image src={recipe.image} alt={recipe.label} h="220px" w="100%" objectFit="cover" />

                                <Stack spacing={3} p={5}>
                                    <Stack direction="row" wrap="wrap">
                                        <Badge
                                            bg={themeColors.mealBg}
                                            color={themeColors.mealText}
                                            border="1px solid"
                                            borderColor={themeColors.mealBorder}
                                            cursor="pointer"
                                            onClick={(event) => {
                                                event.stopPropagation();
                                                const mealType = recipe.mealType?.[0];
                                                if (mealType) {
                                                    toggleFilter(mealType, 'mealType');
                                                }
                                            }}
                                        >
                                            {recipe.mealType?.[0] || 'Meal'}
                                        </Badge>
                                        {isVegan && (
                                            <Badge
                                                bg={themeColors.dietaryBg}
                                                color={themeColors.dietaryText}
                                                border="1px solid"
                                                borderColor={themeColors.dietaryBorder}
                                                cursor="pointer"
                                                onClick={(event) => {
                                                    event.stopPropagation();
                                                    toggleFilter('vegan', 'dietary');
                                                }}
                                            >
                                                Vegan
                                            </Badge>
                                        )}
                                        {isVegetarian && !isVegan && (
                                            <Badge
                                                bg={themeColors.dietaryBg}
                                                color={themeColors.dietaryText}
                                                border="1px solid"
                                                borderColor={themeColors.dietaryBorder}
                                                cursor="pointer"
                                                onClick={(event) => {
                                                    event.stopPropagation();
                                                    toggleFilter('vegetarian', 'dietary');
                                                }}
                                            >
                                                Vegetarian
                                            </Badge>
                                        )}
                                        {!isVegan && !isVegetarian && (
                                            <Badge
                                                bg={themeColors.notVeganBg}
                                                color={themeColors.notVeganText}
                                                cursor="pointer"
                                                onClick={(event) => {
                                                    event.stopPropagation();
                                                    toggleFilter('not vegan', 'dietary');
                                                }}
                                            >
                                                Not vegan
                                            </Badge>
                                        )}
                                    </Stack>

                                    <Heading as="h2" size="md">
                                        {recipe.label}
                                    </Heading>

                                    <Text color={themeColors.mutedText}>
                                        <strong>Dish type:</strong>{' '}
                                        <Box
                                            as="span"
                                            bg={themeColors.dishBg}
                                            color={themeColors.dishText}
                                            border="1px solid"
                                            borderColor={themeColors.dishBorder}
                                            borderRadius="md"
                                            px={2}
                                            py={0.5}
                                            cursor="pointer"
                                            onClick={(event) => {
                                                event.stopPropagation();
                                                const dishType = recipe.dishType?.[0];
                                                if (dishType) {
                                                    toggleFilter(dishType, 'dishType');
                                                }
                                            }}
                                        >
                                            {recipe.dishType?.[0] || 'N/A'}
                                        </Box>
                                    </Text>

                                    <Box>
                                        <Text fontWeight="semibold" mb={1} color={themeColors.pageText}>
                                            Cautions
                                        </Text>
                                        <Stack direction="row" wrap="wrap" spacing={2}>
                                            {(recipe.cautions?.length ? recipe.cautions : ['None']).map((caution) => (
                                                <Badge
                                                    key={caution}
                                                    bg={themeColors.cautionBg}
                                                    color={themeColors.cautionText}
                                                    border="1px solid"
                                                    borderColor={themeColors.cautionBorder}
                                                    cursor="pointer"
                                                    onClick={(event) => {
                                                        event.stopPropagation();
                                                        if (caution) {
                                                            toggleFilter(caution, 'caution');
                                                        }
                                                    }}
                                                >
                                                    {caution}
                                                </Badge>
                                            ))}
                                        </Stack>
                                    </Box>
                                </Stack>
                            </Box>
                        );
                    })
                ) : (
                    <Box gridColumn="1 / -1" textAlign="center" py={10}>
                        <Text fontSize="lg" color={themeColors.mutedText}>
                            No recipes match your search.
                        </Text>
                    </Box>
                )}
            </SimpleGrid>
        </Box>
    );
};