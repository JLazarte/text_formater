interface TextParts {
    before: string,
    selected: string,
    after: string
}

interface Selection {
    start: number;
    end: number;
}

interface Tag {
    tagOpenAt?: number;
    isOpenTag: boolean;
    tagType: string;
}

interface Suggestion {
    word: string;
    options: Array<string>;
}

export {
    TextParts,
    Selection,
    Tag,
    Suggestion
};
