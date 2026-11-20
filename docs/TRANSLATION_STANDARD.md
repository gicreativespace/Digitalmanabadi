# Telugu / English Translation Standard

Digital Mana Badi supports Telugu (`te`) and English (`en`). All new user-facing text must be authored in both languages.

## Required pattern

Every UI module that displays text must receive the shared `T` function from its caller and use it for visible text:

```js
export function createExampleSection({ main, state, T }) {
  const t = (telugu, english) => T(telugu, english);
  main.innerHTML = `
    <h2>${t("విద్యార్థుల వివరాలు", "Student Details")}</h2>
    <label>${t("పూర్తి పేరు", "Full Name")}</label>
    <input placeholder="${t("పేరు నమోదు చేయండి", "Enter full name")}">
    <button>${t("సేవ్ చేయండి", "Save")}</button>
  `;
}
```

## Rules for all future code

1. Write every visible label, heading, button, status, validation message, toast, placeholder, title, and accessibility label as `T("Telugu", "English")`.
2. Pass the existing `T` function into child modules. Do not create a second language state or read/write `gim_lang` from feature modules.
3. When changing a button or status after an asynchronous action, call `T()` again at the time the text is assigned. Do not store only the currently selected language string.
4. Translate dynamic list labels and empty states with paired Telugu/English values. Keep IDs, database values, email addresses, numbers, and user-entered content unchanged.
5. Do not rely on automatic dictionary replacement for new features. It is a legacy fallback only and skips ambiguous phrases by design.
6. Do not use one Telugu phrase for multiple different English meanings in `translationPairs`. Prefer explicit `T()` at the point of use.
7. Do not mark a container `data-translation-managed="true"` unless every user-facing string inside it is already rendered through `T()`.
8. Keep language switching within the existing app state and existing toggle. Do not alter authentication, roles, permissions, data services, layout, or unrelated functionality to add translations.
9. Test each changed screen in both Telugu and English, including dynamic loading, validation errors, empty states, success messages, and action buttons.

## Existing shared helpers

- `createTranslator(() => state.lang)` creates the shared `T(te, en)` function.
- `createDictionaryTranslator(() => state.lang)` is only for legacy static text not yet converted to explicit paired strings.
- `translationPairs` remains a compatibility dictionary; ambiguous mappings are intentionally ignored by the fallback translator.
