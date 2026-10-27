import reactHooks from "eslint-plugin-react-hooks";
export default [ { files:["src/**/*.jsx"], languageOptions:{parserOptions:{ecmaFeatures:{jsx:true}}, sourceType:"module"}, ...reactHooks.configs.flat["recommended-latest"] } ];
