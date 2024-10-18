import globals from 'globals';
import pluginJs from '@eslint/js';

export default [
    { languageOptions: { globals: globals.browser } },
    pluginJs.configs.recommended,
    {
        rules: {
            'no-undef': 'error', // 선언되지 않은 변수 사용 금지
            'no-unused-vars': 'warn', // 사용되지 않는 변수 경고
            'no-cond-assign': ['error', 'always'], // 조건문에서 의도치 않은 할당 방지
            'no-duplicate-imports': 'error', // 중복 import 금지
            'one-var': ['error', 'never'], // 한 줄에서 여러 변수 선언 금지
            'prefer-const': 'error', // 가능한 곳에서 const 사용
            'no-mixed-spaces-and-tabs': 'error', // 탭과 공백 혼용 금지
            eqeqeq: ['error', 'always'], // ===, !== 사용 강제
            indent: ['error', 4], // 들여쓰기 4칸
            quotes: ['error', 'single'], // 싱글 쿼트 사용
            curly: ['error', 'all'], // 모든 제어문에서 중괄호 사용 강제
        },
    },
];
