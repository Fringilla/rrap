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

export const RecipeListPage = ({ recipes, onSelectRecipe }) => {
    const [search, setSearch] = useState('');
    const [activeFilters, setActiveFilters] = useState([]);

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
        <Box minH="100vh" px={{ base: 4, md: 8 }} py={8} bg="gray.50">
            <Heading as="h1" size="lg" mb={4} textAlign="center" color="teal.600">
                React Recipe App Project
            </Heading>

            <Box maxW="540px" mx="auto" mb={4}>
                <Input
                    placeholder="Search recipes"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    bg="white"
                    color="gray.900"
                    borderColor="gray.200"
                    _placeholder={{ color: 'gray.400' }}
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
                                    bg={isDietaryFilter ? 'purple.100' : isCautionFilter ? 'red.50' : isDishTypeFilter ? 'gray.100' : 'teal.50'}
                                    color={isDietaryFilter ? 'purple.900' : isCautionFilter ? 'red.700' : isDishTypeFilter ? 'gray.800' : 'teal.700'}
                                    border="1px solid"
                                    borderColor={isDietaryFilter ? 'purple.300' : isCautionFilter ? 'red.200' : isDishTypeFilter ? 'gray.300' : 'teal.200'}
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
                                borderColor="gray.200"
                                m={2}
                                overflow="hidden"
                                bg="white"
                                boxShadow="md"
                                cursor="pointer"
                                transition="transform 0.2s, box-shadow 0.2s"
                                _hover={{ transform: 'translateY(-2px)', boxShadow: 'lg' }}
                            >
                                <Image src={recipe.image} alt={recipe.label} h="220px" w="100%" objectFit="cover" />

                                <Stack spacing={3} p={5}>
                                    <Stack direction="row" wrap="wrap">
                                        <Badge
                                            bg="teal.50"
                                            color="teal.700"
                                            border="1px solid"
                                            borderColor="teal.200"
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
                                                bg="purple.100"
                                                color="purple.900"
                                                border="1px solid"
                                                borderColor="purple.300"
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
                                                bg="purple.100"
                                                color="purple.900"
                                                border="1px solid"
                                                borderColor="purple.300"
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
                                                bg="gray.100"
                                                color="gray.700"
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

                                    <Text color="gray.600">
                                        <strong>Dish type:</strong>{' '}
                                        <Box
                                            as="span"
                                            bg="gray.100"
                                            color="gray.800"
                                            border="1px solid"
                                            borderColor="gray.300"
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
                                        <Text fontWeight="semibold" mb={1}>
                                            Cautions
                                        </Text>
                                        <Stack direction="row" wrap="wrap" spacing={2}>
                                            {(recipe.cautions?.length ? recipe.cautions : ['None']).map((caution) => (
                                                <Badge
                                                    key={caution}
                                                    bg="red.50"
                                                    color="red.700"
                                                    border="1px solid"
                                                    borderColor="red.200"
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
                        <Text fontSize="lg" color="gray.600">
                            No recipes match your search.
                        </Text>
                    </Box>
                )}
            </SimpleGrid>
        </Box>
    );
};