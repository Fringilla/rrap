import { App } from '../App';

export const RecipePage = ({ recipe, onReturn }) => {
    return (
        <div onClick={() => onReturn(null)}>
            <h1>{recipe.label}</h1>
            <img src={recipe.image} alt={recipe.label} />
            <p>{recipe.description}</p>
        </div>
    );
};