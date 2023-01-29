import type { Note } from 'stores';

export const openAiPromptForSummary = (note: Pick<Note, 'title' | 'content'>) => `
Stwórz opis z podsumowaniem w języku polskim który będzie informował o czym jest dana notatka, opis powinien zawierać maksymalnie 1 zdanie.
TITLE: ${note.title}
CONTENT: ${note.content}
`;

export const openAiPromptForTags = (note: Pick<Note, 'title' | 'content'>) => `
Wygeneruj od 1 do 5 tagów w języku polskim na bazie notatki, tagi nie powinny zawierać znaków interpunkcyjnych oraz specjalnych.
Tagi powinny być oddzielone przecinkami.
MAX LENGTH: 5 tags
TITLE: ${note.title}
CONTENT: ${note.content}
`;
